// ---------------------------------------------------------------------------
// Risolve una foto per ogni idea ricetta usando l'API di Pexels e riscrive
// IDEA_PHOTOS dentro public/js/data/recipe-ideas.js.
//
// Si esegue UNA VOLTA, non fa parte dell'app: la chiave resta qui e non finisce
// mai nel codice servito al browser.
//
//   PEXELS_API_KEY=xxxx node scripts/fetch-pexels.mjs
//   PEXELS_API_KEY=xxxx node scripts/fetch-pexels.mjs --dry            (non scrive)
//   PEXELS_API_KEY=xxxx node scripts/fetch-pexels.mjs --only a,b,c     (solo alcune)
//   ... --only a,b --skip 1                (scarta i primi N risultati: cambia foto)
//
// Con --only le altre foto già presenti restano intatte.
//
// Chiave gratuita: https://www.pexels.com/api/  (nessuna carta di credito)
// Licenza Pexels: uso libero anche commerciale, attribuzione non obbligatoria
// ma gradita — la salviamo e la mostriamo nella scheda della ricetta.
// ---------------------------------------------------------------------------
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const KEY = process.env.PEXELS_API_KEY;
const DRY = process.argv.includes('--dry');

const argOf = (nome) => {
  const i = process.argv.indexOf(nome);
  return i > -1 ? process.argv[i + 1] : null;
};
const ONLY = (argOf('--only') || '').split(',').map((s) => s.trim()).filter(Boolean);
const SKIP = Number(argOf('--skip') || 0);
const HERE = dirname(fileURLToPath(import.meta.url));
const DATA = join(HERE, '..', 'public', 'js', 'data', 'recipe-ideas.js');

if (!KEY) {
  console.error('Manca PEXELS_API_KEY. Prendila gratis su https://www.pexels.com/api/ e riprova:');
  console.error('  PEXELS_API_KEY=la_tua_chiave node scripts/fetch-pexels.mjs');
  process.exit(1);
}

// Query in inglese: il catalogo Pexels è indicizzato in inglese.
const QUERIES = {
  'porridge-mirtilli': 'oatmeal porridge blueberries',
  'yogurt-bowl-proteica': 'greek yogurt bowl berries',
  'pancake-proteici-banana': 'banana pancakes',
  'toast-avocado-uovo': 'avocado toast egg',
  'overnight-oats': 'overnight oats jar',
  'pasta-integrale-zucchine-gamberi': 'pasta shrimp zucchini',
  'pasta-pomodorini-ricotta': 'spaghetti tomato basil plate',
  'farro-verdure': 'grain salad vegetables',
  'quinoa-ceci-curry': 'quinoa chickpea curry',
  'zuppa-lenticchie': 'red lentil soup bowl',
  'risotto-zucca-leggero': 'pumpkin risotto',
  'pasta-legumi-pomodoro': 'pasta tomato sauce',
  'merluzzo-forno-patate': 'baked white fish potatoes',
  'salmone-asparagi': 'baked salmon asparagus',
  'insalata-tonno-fagioli': 'tuna salad beans',
  'orata-verdure': 'baked fish vegetables',
  'polpette-tonno-forno': 'fish cakes plate',
  'pollo-limone-rosmarino': 'lemon chicken rosemary',
  'pollo-verdure-wok': 'chicken stir fry',
  'tacchino-insalata': 'turkey salad avocado',
  'polpette-manzo-sugo': 'meatballs tomato sauce',
  'bresaola-rucola-grana': 'cured beef arugula parmesan',
  'frittata-zucchine-forno': 'frittata zucchini',
  'tofu-verdure': 'tofu broccoli stir fry',
  'burger-lenticchie': 'veggie burger patty',
  'parmigiana-leggera': 'eggplant parmesan bake',
  'ceci-spinaci': 'chickpea spinach stew',
  'vellutata-zucca-zenzero': 'pumpkin soup bowl',
  'insalata-quinoa-avocado': 'quinoa avocado salad',
  'peperoni-ripieni-riso': 'stuffed bell peppers rice',
  'insalata-finocchi-arance': 'fennel orange salad',
  'verdure-grigliate': 'grilled vegetables',
  'patate-forno-rosmarino': 'roasted potatoes rosemary',
  'caponata-leggera': 'ratatouille vegetable stew',
  'hummus-casalingo': 'hummus bowl',
  'poke-salmone': 'salmon poke bowl',
  'buddha-bowl': 'buddha bowl vegetarian',
  'chili-vegetariano': 'vegetarian chili beans',
  'cous-cous-pollo-verdure': 'couscous chicken vegetables',
  'uova-pomodoro-shakshuka': 'shakshuka',
  'insalata-riso-integrale': 'rice salad bowl',
  'zuppa-ceci-rosmarino': 'chickpea soup',
  'omelette-spinaci-feta': 'spinach omelette feta',
  'seitan-peperoni': 'stewed bell peppers onions pan',
  'frittata-albumi-verdure': 'egg white omelette',
  'pollo-patate-dolci': 'roast chicken sweet potato',
  'insalata-greca': 'greek salad',
  'crema-funghi-orzo': 'mushroom risotto barley',
  'gamberi-zucchine-limone': 'shrimp zucchini lemon',
  'sformato-broccoli': 'broccoli casserole bake',
  'tempeh-verdure': 'tempeh vegetables'
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const falliti = [];

// Riparte da quanto già risolto, così --only non perde il resto.
const srcIniziale = readFileSync(DATA, 'utf8');
const esistenti = {};
const blocoAttuale = srcIniziale.match(/export const IDEA_PHOTOS = \{([\s\S]*?)\n\};/);
if (blocoAttuale) {
  for (const m of blocoAttuale[1].matchAll(/'([^']+)':\s*\{\s*url:\s*'([^']+)',\s*credit:\s*"?'?([^"']+)"?'?\s*\}/g)) {
    esistenti[m[1]] = { url: m[2], credit: m[3] };
  }
}

const risolte = { ...esistenti };
// Nessuna foto ripetuta su due ricette diverse.
const usati = new Set(Object.values(esistenti).map((p) => p.url));

const ids = ONLY.length ? ONLY : Object.keys(QUERIES);
for (let i = 0; i < ids.length; i++) {
  const id = ids[i];
  const q = QUERIES[id];
  if (!q) { falliti.push(`${id} (id sconosciuto)`); continue; }
  const url =
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}` +
    '&per_page=15&orientation=landscape&size=medium';

  try {
    const r = await fetch(url, { headers: { Authorization: KEY } });

    if (r.status === 401) {
      console.error('\nChiave rifiutata (401). Controlla PEXELS_API_KEY.');
      process.exit(1);
    }
    if (r.status === 429) {
      console.error(`\nRate limit raggiunto a ${i}/${ids.length}. Riprova fra un po'.`);
      break;
    }
    if (!r.ok) { falliti.push(`${id} (HTTP ${r.status})`); continue; }

    const j = await r.json();
    const disponibili = (j.photos || []).filter((p) => !usati.has(p.src.medium));
    const scelto = disponibili[SKIP] || disponibili[0];
    if (!scelto) { falliti.push(`${id} (nessun risultato per "${q}")`); continue; }

    usati.delete(risolte[id]?.url); // libera quella vecchia se la stiamo sostituendo
    usati.add(scelto.src.medium);
    risolte[id] = {
      url: scelto.src.medium,
      credit: `${scelto.photographer} / Pexels`
    };
    console.log(
      `[${String(i + 1).padStart(2)}/${ids.length}] ${id.padEnd(34)} ${String(scelto.alt || '').slice(0, 44)}`
    );
    await sleep(220);
  } catch (e) {
    falliti.push(`${id} (${e.cause?.code || e.message})`);
  }
}

console.log(`\nrisolte ${Object.keys(risolte).length}/${ids.length}`);
if (falliti.length) console.log('non risolte:\n  ' + falliti.join('\n  '));

if (DRY) {
  console.log('\n--dry: nessun file modificato.');
  process.exit(0);
}

// Riscrive solo il blocco IDEA_PHOTOS, lasciando intatto il resto del file.
const src = readFileSync(DATA, 'utf8');
const righe = Object.entries(risolte)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([id, p]) => `  '${id}': { url: '${p.url}', credit: ${JSON.stringify(p.credit)} }`)
  .join(',\n');
const blocco = `export const IDEA_PHOTOS = {\n${righe}\n};`;
const next = src.replace(/export const IDEA_PHOTOS = \{[\s\S]*?\n\};/, blocco);

if (next === src) {
  console.error('\nBlocco IDEA_PHOTOS non trovato in recipe-ideas.js: niente scritto.');
  process.exit(1);
}
writeFileSync(DATA, next);
console.log(`\nScritto IDEA_PHOTOS in ${DATA}`);
