// Client Open Food Facts. API pubblica, senza chiave, CORS abilitato.
// Docs: https://openfoodfacts.github.io/openfoodfacts-server/api/
import { OFF_COUNTRY } from './config.js';
import { num, round } from './utils.js';

// L'host nazionale regge meglio del mondiale, che risponde 503 quasi sempre
// sulla ricerca full-text. `world` resta come seconda scelta.
const HOSTS = [`https://${OFF_COUNTRY}.openfoodfacts.org`, 'https://world.openfoodfacts.org'];
const HOST = HOSTS[0];
const FIELDS = [
  'code',
  'product_name',
  'product_name_it',
  'generic_name',
  'brands',
  'quantity',
  'serving_size',
  'serving_quantity',
  'image_front_small_url',
  'nutriments',
  'nutriscore_grade'
].join(',');

/** Estrae i valori per 100 g; null se il prodotto non ha dati nutrizionali. */
function readPer100(nutriments = {}) {
  const kcalRaw = nutriments['energy-kcal_100g'];
  const kjRaw = nutriments['energy-kj_100g'] ?? nutriments['energy_100g'];
  const kcal = kcalRaw != null ? num(kcalRaw) : kjRaw != null ? num(kjRaw) / 4.184 : null;
  const protein = nutriments['proteins_100g'];
  const carbs = nutriments['carbohydrates_100g'];
  const fat = nutriments['fat_100g'];

  if (kcal == null && protein == null && carbs == null && fat == null) return null;

  return {
    kcal: round(kcal ?? 0, 1),
    protein: round(num(protein), 1),
    carbs: round(num(carbs), 1),
    fat: round(num(fat), 1),
    fiber: round(num(nutriments['fiber_100g']), 1),
    sugars: round(num(nutriments['sugars_100g']), 1),
    salt: round(num(nutriments['salt_100g']), 2)
  };
}

function normalize(product) {
  const per100 = readPer100(product.nutriments);
  if (!per100) return null;
  const name =
    product.product_name_it || product.product_name || product.generic_name || 'Senza nome';
  const servingG = num(product.serving_quantity, 0);
  return {
    code: product.code || '',
    name: name.trim(),
    brand: (product.brands || '').split(',')[0].trim(),
    quantity: product.quantity || '',
    servingSize: product.serving_size || '',
    servingG: servingG > 0 ? round(servingG, 0) : null,
    image: product.image_front_small_url || '',
    nutriscore: (product.nutriscore_grade || '').toUpperCase(),
    per100,
    source: 'off'
  };
}

const sleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(t);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

/** Errore che la UI può distinguere: OFF non disponibile, non "nessun risultato". */
export class OffUnavailableError extends Error {
  constructor(message) {
    super(message);
    this.name = 'OffUnavailableError';
  }
}

async function getJSON(url, signal) {
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (res.status === 429 || res.status === 503 || res.status === 502) {
    // Sovraccarico o rate limit (~10 ricerche/minuto per IP).
    const err = new OffUnavailableError(`Open Food Facts sovraccarico (${res.status})`);
    err.retriable = true;
    throw err;
  }
  if (!res.ok) throw new OffUnavailableError(`Open Food Facts ha risposto ${res.status}`);
  return res.json();
}

/** Prova gli host in ordine, con una pausa crescente sui 503. */
async function getJSONResilient(path, signal) {
  let last;
  for (let attempt = 0; attempt < HOSTS.length + 1; attempt++) {
    const host = HOSTS[Math.min(attempt, HOSTS.length - 1)];
    try {
      return await getJSON(host + path, signal);
    } catch (err) {
      if (err.name === 'AbortError') throw err;
      last = err;
      if (!err.retriable && !(err instanceof TypeError)) throw err;
      await sleep(400 * (attempt + 1), signal);
    }
  }
  throw last;
}

// Cache di sessione: rileggere lo stesso termine non consuma il rate limit.
const searchCache = new Map();
const CACHE_MAX = 60;

/** Ricerca full-text fra i prodotti confezionati. Solo quelli con macro. */
export async function searchFoods(query, { signal, pageSize = 25 } = {}) {
  const term = query.trim().toLowerCase();
  if (term.length < 2) return [];
  if (searchCache.has(term)) return searchCache.get(term);

  const path =
    `/cgi/search.pl?search_terms=${encodeURIComponent(term)}` +
    `&search_simple=1&action=process&json=1&page_size=${pageSize}&fields=${FIELDS}`;
  const data = await getJSONResilient(path, signal);
  const products = (data.products || []).map(normalize).filter(Boolean);

  if (searchCache.size >= CACHE_MAX) searchCache.delete(searchCache.keys().next().value);
  searchCache.set(term, products);
  return products;
}

/** Lookup per codice a barre EAN. */
export async function getFoodByBarcode(barcode, { signal } = {}) {
  const code = barcode.replace(/\D/g, '');
  if (!code) return null;
  const data = await getJSONResilient(`/api/v2/product/${code}.json?fields=${FIELDS}`, signal);
  if (data.status !== 1 || !data.product) return null;
  return normalize(data.product);
}

export { HOST };
