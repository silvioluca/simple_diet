// Logica delle Idee ricette: risolve gli ingredienti sulla tabella alimenti,
// calcola le macro e filtra per ingrediente o per tag.
import { RECIPE_IDEAS, IDEA_ICONS, IDEA_TONES, IDEA_PHOTOS } from './data/recipe-ideas.js';
import { findBaseFood, normalize } from './data/foods-base.js';
import { recipeTotals, recipePer100, num, round } from './utils.js';

/**
 * Da idea a ricetta completa: ogni ingrediente prende le macro dalla tabella.
 * `mancanti` elenca i nomi non risolti (deve restare vuoto: c'è un test).
 */
export function hydrateIdea(idea) {
  const mancanti = [];
  const ingredients = idea.ingredients
    .map(([name, grams]) => {
      const food = findBaseFood(name);
      if (!food) {
        mancanti.push(name);
        return null;
      }
      return { name: food.name, brand: food.category, code: '', grams: num(grams), per100: food.per100 };
    })
    .filter(Boolean)
    // Gli ingredienti a 0 g (spezie in punta di cucchiaio) restano visibili
    // nell'elenco ma non spostano le macro.
    .filter((i) => i.grams >= 0);

  const { totals, totalGrams } = recipeTotals(ingredients);
  const servings = Math.max(1, num(idea.servings, 1));

  const momento = ['colazione', 'pranzo', 'cena', 'contorno'].find((t) => idea.tags.includes(t));
  const [c1, c2] = IDEA_TONES[momento] || IDEA_TONES.default;

  return {
    ...idea,
    icon: IDEA_ICONS[idea.id] || '🍽️',
    cover: `linear-gradient(135deg, ${c1}, ${c2})`,
    photo: IDEA_PHOTOS[idea.id] || null,
    momento: momento || 'piatto',
    ingredients,
    mancanti,
    servings,
    totalGrams,
    totals,
    per100: recipePer100(ingredients),
    servingG: totalGrams > 0 ? round(totalGrams / servings, 0) : 100,
    perServing: {
      kcal: round(totals.kcal / servings, 1),
      protein: round(totals.protein / servings, 1),
      carbs: round(totals.carbs / servings, 1),
      fat: round(totals.fat / servings, 1)
    }
  };
}

/** Tutte le idee, già calcolate. */
export const IDEAS = RECIPE_IDEAS.map(hydrateIdea);

// ---------------------------------------------------------------------------
// Copertine per le ricette dell'utente
// ---------------------------------------------------------------------------

/** Emoji per categoria della tabella alimenti. */
const CATEGORY_ICON = {
  Frutta: '🍎',
  Verdura: '🥬',
  Carne: '🍗',
  Pesce: '🐟',
  'Uova e latticini': '🧀',
  'Cereali e pane': '🍞',
  Legumi: '🫘',
  'Frutta secca e semi': '🥜',
  'Primi piatti': '🍝',
  'Secondi e piatti unici': '🍲',
  'Contorni e piatti freddi': '🥗',
  'Colazione e snack': '🥐',
  'Condimenti e salse': '🫙',
  Dolci: '🍰',
  Bevande: '🥤',
  'Integratori e dietetici': '💪',
  'Spezie ed erbe': '🌿',
  'Fast food e da asporto': '🍔'
};

// Categorie che non caratterizzano il piatto: l'olio è in quasi tutte le ricette.
const CATEGORIE_DEBOLI = new Set(['Condimenti e salse', 'Spezie ed erbe', 'Bevande']);

const TONI = [
  ['#4a9fd8', '#2f6aa8'],
  ['#7a6cd6', '#524aad'],
  ['#5ec27a', '#358a55'],
  ['#f0a94b', '#dd7a2e'],
  ['#5aa9a0', '#37776f'],
  ['#d8687f', '#a8405a']
];

/** Somma stabile dei caratteri: stesso nome, stesso colore, sempre. */
function hash(text) {
  let h = 0;
  for (let i = 0; i < String(text).length; i++) h = (h * 31 + String(text).charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Copertina per una ricetta creata dall'utente: emoji dedotta dall'ingrediente
 * che pesa di più (ignorando olio e spezie) e colore stabile dal nome.
 * Se la ricetta ha `photo` quella vince, come per le idee.
 */
export function coverForRecipe(recipe) {
  const ing = recipe?.ingredients || [];
  const principale = ing
    .map((i) => ({ i, food: findBaseFood(i.name) }))
    .filter((x) => x.food && !CATEGORIE_DEBOLI.has(x.food.category))
    .sort((a, b) => num(b.i.grams) - num(a.i.grams))[0];

  const [c1, c2] = TONI[hash(recipe?.name || '') % TONI.length];
  return {
    icon: CATEGORY_ICON[principale?.food.category] || '📖',
    cover: `linear-gradient(135deg, ${c1}, ${c2})`,
    photo: recipe?.photo?.url ? recipe.photo : null
  };
}

/** Un'idea usata come alimento: la porzione tipica è una porzione. */
export function ideaToFood(idea) {
  return {
    code: '',
    name: idea.name,
    brand: 'Idea ricetta',
    quantity: `${idea.servings} porzioni · ${round(idea.totalGrams)} g`,
    image: '',
    source: 'recipe',
    servingG: idea.servingG,
    per100: idea.per100
  };
}

/**
 * Filtra per testo (nome o ingrediente) e per tag.
 * `ingredient` fa match sugli ingredienti, non sul titolo: cercando "pollo"
 * escono anche i piatti che lo contengono senza averlo nel nome.
 */
export function filterIdeas({ text = '', ingredient = '', tag = '' } = {}) {
  const q = normalize(text);
  const ing = normalize(ingredient);

  return IDEAS.filter((idea) => {
    if (tag && !idea.tags.includes(tag)) return false;

    if (ing) {
      const hit = idea.ingredients.some((i) => normalize(i.name).includes(ing));
      if (!hit) return false;
    }

    if (q) {
      const hay = normalize(
        `${idea.name} ${idea.tags.join(' ')} ${idea.ingredients.map((i) => i.name).join(' ')}`
      );
      if (!q.split(' ').every((w) => hay.includes(w))) return false;
    }
    return true;
  });
}

/** Ingredienti citati almeno due volte: sono i filtri che vale la pena mostrare. */
export function frequentIngredients(minCount = 2) {
  const count = new Map();
  IDEAS.forEach((idea) =>
    idea.ingredients.forEach((i) => count.set(i.name, (count.get(i.name) || 0) + 1))
  );
  return [...count.entries()]
    .filter(([, n]) => n >= minCount)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, n]) => ({ name, count: n }));
}

export function ideaTags() {
  const count = new Map();
  IDEAS.forEach((idea) => idea.tags.forEach((t) => count.set(t, (count.get(t) || 0) + 1)));
  return [...count.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([name, n]) => ({ name, count: n }));
}
