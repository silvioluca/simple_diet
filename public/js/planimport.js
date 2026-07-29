// Importazione di un piano settimanale da testo, CSV o JSON.
//
// Il browser non può scaricare una pagina di un sito qualsiasi: la Same-Origin
// Policy blocca le fetch cross-origin senza CORS, e nessun sito di diete lo
// abilita. Il percorso che funziona davvero è copiare il testo e incollarlo,
// oppure caricare un file. Il parser è volutamente tollerante.
import { MEAL_SLOTS, WEEKDAYS } from './config.js';
import { searchBaseFoods, normalize } from './data/foods-base.js';
import { num, round, scaleMacros } from './utils.js';

const DAY_ALIASES = {
  1: ['lunedi', 'lun', 'mon', 'monday', '1'],
  2: ['martedi', 'mar', 'tue', 'tuesday', '2'],
  3: ['mercoledi', 'mer', 'wed', 'wednesday', '3'],
  4: ['giovedi', 'gio', 'thu', 'thursday', '4'],
  5: ['venerdi', 'ven', 'fri', 'friday', '5'],
  6: ['sabato', 'sab', 'sat', 'saturday', '6'],
  7: ['domenica', 'dom', 'sun', 'sunday', '7']
};

const SLOT_ALIASES = {
  colazione: ['colazione', 'breakfast', 'mattina presto'],
  spuntino1: ['spuntino1', 'spuntino mattina', 'spuntino mattutino', 'merenda mattina', 'snack1'],
  pranzo: ['pranzo', 'lunch'],
  spuntino2: ['spuntino2', 'spuntino pomeriggio', 'merenda', 'merenda pomeriggio', 'snack2'],
  cena: ['cena', 'dinner'],
  spuntino3: ['spuntino3', 'dopo cena', 'spuntino sera', 'snack3']
};

function matchDay(raw) {
  const v = normalize(raw);
  if (!v) return null;
  for (const [id, names] of Object.entries(DAY_ALIASES)) {
    if (names.some((n) => v === n || v.startsWith(n))) return Number(id);
  }
  return null;
}

function matchSlot(raw) {
  const v = normalize(raw);
  if (!v) return null;
  for (const [id, names] of Object.entries(SLOT_ALIASES)) {
    if (names.some((n) => v === n || v.startsWith(n))) return id;
  }
  // "spuntino" generico finisce nello spuntino del pomeriggio
  if (v.includes('spuntino') || v.includes('merenda')) return 'spuntino2';
  return null;
}

/** Divide una riga su virgola, punto e virgola, tab o barra verticale. */
function splitCells(line) {
  const sep = [';', '\t', '|', ','].find((s) => line.includes(s)) || ',';
  return line.split(sep).map((c) => c.trim().replace(/^["']|["']$/g, ''));
}

/** Cerca i valori nutrizionali nella tabella base quando mancano nel file. */
function lookupPer100(name) {
  const hits = searchBaseFoods(name, 1);
  return hits.length ? hits[0].per100 : null;
}

/**
 * Converte righe testuali in un piano settimanale.
 * Formato atteso per riga:
 *   giorno, pasto, alimento, grammi [, kcal100, proteine100, carboidrati100, grassi100]
 * Le colonne nutrizionali sono opzionali: se mancano si cerca in archivio.
 *
 * Ritorna { plan, righe, aggiunti, avvisi }.
 */
export function parsePlanText(text) {
  const plan = {};
  const avvisi = [];
  let aggiunti = 0;

  const lines = String(text)
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  lines.forEach((line, i) => {
    const cells = splitCells(line);
    const numero = i + 1;

    // Salta l'intestazione del modello.
    if (i === 0 && normalize(cells[0]).startsWith('giorno')) return;
    if (cells.length < 4) {
      avvisi.push(`Riga ${numero}: servono almeno giorno, pasto, alimento e grammi.`);
      return;
    }

    const day = matchDay(cells[0]);
    if (!day) {
      avvisi.push(`Riga ${numero}: giorno "${cells[0]}" non riconosciuto.`);
      return;
    }
    const slot = matchSlot(cells[1]);
    if (!slot) {
      avvisi.push(`Riga ${numero}: pasto "${cells[1]}" non riconosciuto.`);
      return;
    }
    const name = cells[2];
    const grams = num(cells[3]);
    if (!name || grams <= 0) {
      avvisi.push(`Riga ${numero}: alimento o grammi mancanti.`);
      return;
    }

    let per100;
    if (cells.length >= 8 && cells.slice(4, 8).some((c) => c !== '')) {
      per100 = {
        kcal: num(cells[4]),
        protein: num(cells[5]),
        carbs: num(cells[6]),
        fat: num(cells[7])
      };
    } else {
      per100 = lookupPer100(name);
      if (!per100) {
        avvisi.push(
          `Riga ${numero}: "${name}" non è in archivio e la riga non ha i valori nutrizionali. Saltata.`
        );
        return;
      }
    }

    const key = String(day);
    (plan[key] ||= []).push({ slot, name, brand: '', code: '', grams: round(grams, 1), per100 });
    aggiunti++;
  });

  return { plan, righe: lines.length, aggiunti, avvisi };
}

/** Accetta anche il JSON esportato dall'app stessa. */
export function parsePlanJSON(text) {
  const data = JSON.parse(text);
  const source = data.plan || data;
  const plan = {};
  const avvisi = [];
  let aggiunti = 0;

  for (const [key, items] of Object.entries(source)) {
    const day = matchDay(key) || (Number(key) >= 1 && Number(key) <= 7 ? Number(key) : null);
    if (!day || !Array.isArray(items)) {
      avvisi.push(`Chiave "${key}" ignorata.`);
      continue;
    }
    items.forEach((it) => {
      const slot = matchSlot(it.slot || '') || 'pranzo';
      const per100 = it.per100 || lookupPer100(it.name || '');
      const grams = num(it.grams);
      if (!it.name || !per100 || grams <= 0) {
        avvisi.push(`"${it.name || '?'}" saltato: dati incompleti.`);
        return;
      }
      (plan[String(day)] ||= []).push({
        slot,
        name: it.name,
        brand: it.brand || '',
        code: it.code || '',
        grams: round(grams, 1),
        per100
      });
      aggiunti++;
    });
  }
  return { plan, righe: aggiunti, aggiunti, avvisi };
}

/** Sceglie il parser in base al contenuto. */
export function parsePlan(text) {
  const trimmed = String(text).trim();
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return parsePlanJSON(trimmed);
    } catch (err) {
      return { plan: {}, righe: 0, aggiunti: 0, avvisi: [`JSON non valido: ${err.message}`] };
    }
  }
  return parsePlanText(trimmed);
}

/** Riepilogo kcal per giorno, per mostrare l'anteprima prima di confermare. */
export function planSummary(plan) {
  return WEEKDAYS.map((d) => {
    const items = plan[String(d.id)] || [];
    const kcal = items.reduce((a, i) => a + scaleMacros(i.per100, i.grams).kcal, 0);
    return { day: d, count: items.length, kcal: round(kcal) };
  });
}

/** Modello CSV precompilato con una giornata d'esempio. */
export function templateCSV() {
  const header =
    'giorno,pasto,alimento,grammi,kcal_100g,proteine_100g,carboidrati_100g,grassi_100g';
  const note = [
    '# Simple Diet - modello piano settimanale',
    '# Una riga per alimento. Le 4 colonne nutrizionali sono FACOLTATIVE:',
    '# se le lasci vuote, i valori vengono cercati in archivio dal nome.',
    `# Giorni ammessi: ${WEEKDAYS.map((d) => d.label.toLowerCase()).join(', ')}`,
    `# Pasti ammessi: ${MEAL_SLOTS.map((s) => s.id).join(', ')}`
  ];
  const rows = [
    'lunedi,colazione,Yogurt greco 0%,170,,,,',
    'lunedi,colazione,Fiocchi d’avena,60,,,,',
    'lunedi,pranzo,Pasta di semola (c),90,,,,',
    'lunedi,pranzo,Petto di pollo (c),150,,,,',
    'lunedi,pranzo,Olio extravergine d’oliva,10,,,,',
    'lunedi,cena,Merluzzo (c),200,,,,',
    'lunedi,cena,Zucchine,200,,,,',
    'martedi,colazione,Pane integrale,80,,,,',
    'martedi,pranzo,Riso bianco (c),90,,,,',
    'martedi,cena,Uovo intero,110,,,,',
    'mercoledi,pranzo,Frullato proteico,300,55,8,3,1'
  ];
  return [...note, header, ...rows].join('\n');
}
