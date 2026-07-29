// Ricerca unificata degli alimenti.
//
// Tre sorgenti, in ordine di rilevanza:
//   1. ricette dell'utente          (locale, immediata)
//   2. tabella alimenti base        (locale, immediata — frutta, verdura, carne…)
//   3. Open Food Facts              (rete, prodotti confezionati con barcode)
//
// Le prime due rispondono sempre, anche offline: se OFF è sovraccarico la
// ricerca resta comunque utile invece di fallire del tutto.
import { searchBaseFoods, normalize } from './data/foods-base.js';
import { searchFoods } from './off.js';
import { listRecipes, listRecentFoods } from './store.js';
import { recipeToFood } from './utils.js';

let cache = null;

/** Carica ricette e alimenti recenti una volta per sessione. */
export async function loadLocalIndex({ force = false } = {}) {
  if (cache && !force) return cache;
  const [recipes, recents] = await Promise.all([
    listRecipes().catch(() => []),
    listRecentFoods().catch(() => [])
  ]);
  cache = {
    recipes: recipes.map(recipeToFood),
    recents: recents.filter((f) => f?.per100)
  };
  return cache;
}

/** Da invalidare quando si salva una ricetta o si aggiunge un alimento. */
export function invalidateLocalIndex() {
  cache = null;
}

function matches(food, words) {
  const hay = normalize(`${food.name} ${food.brand || ''}`);
  return words.every((w) => hay.includes(w));
}

/**
 * Risultati locali per un termine di ricerca: ricette + alimenti base.
 * I recenti non entrano qui — hanno una sezione propria a ricerca vuota.
 */
export function searchLocal(term, index = cache) {
  const words = normalize(term).split(' ').filter(Boolean);
  if (!words.length) return [];
  const recipes = (index?.recipes || []).filter((f) => matches(f, words));
  const base = searchBaseFoods(term, 25);
  return [...recipes, ...base];
}

/** Suggerimenti a ricerca vuota: prima i recenti, poi le ricette. */
export function defaultSuggestions(index = cache) {
  const recents = index?.recents || [];
  const seen = new Set(recents.map((f) => normalize(f.name)));
  const recipes = (index?.recipes || []).filter((f) => !seen.has(normalize(f.name)));
  return [...recents, ...recipes];
}

/** Prodotti confezionati. Può fallire: chi chiama mostra già i risultati locali. */
export function searchPackaged(term, options) {
  return searchFoods(term, options);
}
