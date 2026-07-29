// Logica delle diete mensili: risolve gli alimenti sulla tabella, calcola le
// medie giornaliere e converte una dieta nel formato del piano settimanale.
import { MONTHLY_DIETS, DIET_PHOTOS } from './data/monthly-diets.js';
import { findBaseFood } from './data/foods-base.js';
import { WEEKDAYS } from './config.js';
import { scaleMacros, sumMacros, num, round, EMPTY_MACROS } from './utils.js';

/** Da riga [slot, nome, grammi] a voce di piano, con le macro dalla tabella. */
function toPlanItem([slot, name, grams], mancanti) {
  const food = findBaseFood(name);
  if (!food) {
    mancanti.push(name);
    return null;
  }
  return { slot, name: food.name, brand: '', code: '', grams: num(grams), per100: food.per100 };
}

/** Dieta completa: piano nel formato di `state.plan` più le medie giornaliere. */
export function hydrateDiet(diet) {
  const mancanti = [];
  const plan = {};
  const perGiorno = [];

  for (const d of WEEKDAYS) {
    const righe = diet.meals[d.id] || [];
    const items = righe.map((r) => toPlanItem(r, mancanti)).filter(Boolean);
    plan[String(d.id)] = items;
    perGiorno.push({
      day: d,
      items,
      totals: items.length
        ? sumMacros(items, (i) => scaleMacros(i.per100, i.grams))
        : { ...EMPTY_MACROS }
    });
  }

  const giorniPieni = perGiorno.filter((g) => g.items.length);
  const media = giorniPieni.length
    ? {
        kcal: round(giorniPieni.reduce((a, g) => a + g.totals.kcal, 0) / giorniPieni.length),
        protein: round(giorniPieni.reduce((a, g) => a + g.totals.protein, 0) / giorniPieni.length),
        carbs: round(giorniPieni.reduce((a, g) => a + g.totals.carbs, 0) / giorniPieni.length),
        fat: round(giorniPieni.reduce((a, g) => a + g.totals.fat, 0) / giorniPieni.length)
      }
    : { ...EMPTY_MACROS };

  const [c1, c2] = diet.color;
  return {
    ...diet,
    plan,
    perGiorno,
    media,
    mancanti,
    photo: DIET_PHOTOS[diet.id] || null,
    cover: `linear-gradient(135deg, ${c1}, ${c2})`,
    // Quanti alimenti in tutta la settimana
    conteggio: Object.values(plan).reduce((a, v) => a + v.length, 0)
  };
}

export const DIETS = MONTHLY_DIETS.map(hydrateDiet);

export function findDiet(id) {
  return DIETS.find((d) => d.id === id) || null;
}

/** Target giornalieri derivati dalla ripartizione della dieta e dalle kcal scelte. */
export function targetsFromDiet(diet, kcal) {
  const k = num(kcal, diet.media.kcal);
  return {
    kcal: Math.round(k),
    protein: Math.round((k * diet.split.protein) / 100 / 4),
    carbs: Math.round((k * diet.split.carbs) / 100 / 4),
    fat: Math.round((k * diet.split.fat) / 100 / 9),
    auto: false
  };
}
