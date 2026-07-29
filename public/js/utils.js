import { ACTIVITY_LEVELS, GOALS } from './config.js';

// ---------- DOM ----------

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Escape per interpolazione sicura dentro i template literal HTML. */
export function esc(value) {
  if (value == null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function debounce(fn, ms = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

let toastTimer;
export function toast(message, kind = 'info') {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.dataset.kind = kind;
  el.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('is-visible'), 3200);
}

// ---------- Date ----------

/** Data locale in formato YYYY-MM-DD (niente UTC: evita lo shift di fuso). */
export function toISODate(date = new Date()) {
  const d = new Date(date);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

export function fromISODate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso, delta) {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + delta);
  return toISODate(d);
}

/** 1 = lunedì … 7 = domenica. */
export function isoWeekday(iso) {
  const day = fromISODate(iso).getDay();
  return day === 0 ? 7 : day;
}

export function formatDateLong(iso) {
  const today = toISODate();
  if (iso === today) return 'Oggi';
  if (iso === addDays(today, -1)) return 'Ieri';
  if (iso === addDays(today, 1)) return 'Domani';
  return fromISODate(iso).toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
}

export function formatDateShort(iso) {
  return fromISODate(iso).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
}

/** Ultimi n giorni fino a `endIso` incluso, dal più vecchio al più recente. */
export function lastNDays(n, endIso = toISODate()) {
  return Array.from({ length: n }, (_, i) => addDays(endIso, i - n + 1));
}

// ---------- Numeri ----------

export function num(value, fallback = 0) {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : fallback;
}

export function round(value, decimals = 0) {
  const f = 10 ** decimals;
  return Math.round(num(value) * f) / f;
}

export function fmt(value, decimals = 0) {
  return round(value, decimals).toLocaleString('it-IT', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export const EMPTY_MACROS = { kcal: 0, protein: 0, carbs: 0, fat: 0 };

export function sumMacros(list, pick = (x) => x.totals) {
  return list.reduce(
    (acc, item) => {
      const m = pick(item) || EMPTY_MACROS;
      acc.kcal += num(m.kcal);
      acc.protein += num(m.protein);
      acc.carbs += num(m.carbs);
      acc.fat += num(m.fat);
      return acc;
    },
    { ...EMPTY_MACROS }
  );
}

/** Macro per `grams` a partire dai valori per 100 g. */
export function scaleMacros(per100, grams) {
  const k = num(grams) / 100;
  return {
    kcal: round(num(per100.kcal) * k, 1),
    protein: round(num(per100.protein) * k, 1),
    carbs: round(num(per100.carbs) * k, 1),
    fat: round(num(per100.fat) * k, 1)
  };
}

// ---------- Ricette ----------

/** Grammi totali e macro totali di un elenco di ingredienti. */
export function recipeTotals(ingredients = []) {
  const totals = sumMacros(ingredients, (i) => scaleMacros(i.per100, i.grams));
  const totalGrams = ingredients.reduce((a, i) => a + num(i.grams), 0);
  return { totals, totalGrams: round(totalGrams, 1) };
}

/** Macro per 100 g della ricetta finita (peso crudo degli ingredienti). */
export function recipePer100(ingredients = []) {
  const { totals, totalGrams } = recipeTotals(ingredients);
  if (totalGrams <= 0) return { ...EMPTY_MACROS };
  const k = 100 / totalGrams;
  return {
    kcal: round(totals.kcal * k, 1),
    protein: round(totals.protein * k, 1),
    carbs: round(totals.carbs * k, 1),
    fat: round(totals.fat * k, 1)
  };
}

/** Una ricetta usata come alimento: la porzione tipica è una porzione. */
export function recipeToFood(recipe) {
  const servings = Math.max(1, num(recipe.servings, 1));
  const totalGrams = num(recipe.totalGrams, 0);
  return {
    code: '',
    name: recipe.name,
    brand: 'Ricetta',
    quantity: `${fmt(servings)} porzioni · ${fmt(totalGrams)} g`,
    image: '',
    source: 'recipe',
    recipeId: recipe.id,
    servingG: totalGrams > 0 ? round(totalGrams / servings, 0) : 100,
    per100: recipe.per100 || recipePer100(recipe.ingredients)
  };
}

// ---------- Fabbisogno ----------

export function age(birthDate) {
  if (!birthDate) return 30;
  const b = fromISODate(birthDate);
  const now = new Date();
  let a = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) a--;
  return a;
}

/** Metabolismo basale — Mifflin-St Jeor. */
export function bmr({ sex, weightKg, heightCm, birthDate }) {
  const base = 10 * num(weightKg) + 6.25 * num(heightCm) - 5 * age(birthDate);
  return sex === 'f' ? base - 161 : base + 5;
}

export function tdee(profile) {
  const activity = num(profile.activity, ACTIVITY_LEVELS[0].id);
  return bmr(profile) * activity;
}

/** Target kcal + split macro suggerito a partire dal profilo. */
export function suggestTargets(profile) {
  const goal = GOALS.find((g) => g.id === profile.goal) || GOALS[2];
  const kcal = Math.round(tdee(profile) * goal.factor);
  const weight = num(profile.weightKg, 70);
  const protein = Math.round(clamp(weight * num(profile.proteinPerKg, 2), 40, 300));
  const fat = Math.round((kcal * num(profile.fatPercent, 25)) / 100 / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  return { kcal, protein, carbs, fat };
}

export function macroKcal({ protein, carbs, fat }) {
  return num(protein) * 4 + num(carbs) * 4 + num(fat) * 9;
}
