import {
  state,
  listEntries,
  addEntry,
  updateEntry,
  deleteEntry,
  rememberFood,
  listRecentFoods
} from '../store.js';
import { getFoodByBarcode } from '../off.js';
import {
  loadLocalIndex,
  searchLocal,
  defaultSuggestions,
  searchPackaged,
  invalidateLocalIndex
} from '../foodsearch.js';
import { MEAL_SLOTS, slotForNow } from '../config.js';
import { openSheet, confirmSheet, macroBarsHTML, PLUS_SVG } from '../ui.js';
import {
  esc,
  fmt,
  num,
  round,
  debounce,
  sumMacros,
  scaleMacros,
  toast,
  isoWeekday,
  formatDateLong
} from '../utils.js';
import { render } from '../router.js';

// ---------------------------------------------------------------------------
// Scheda porzione: da un alimento (per 100 g) all'entry salvata
// ---------------------------------------------------------------------------

function portionSheet({ food, slot, entryId = null, grams = null }) {
  const start = num(grams, food.servingG || 100);
  const quick = [30, 50, 100, 150, 200, 250];
  if (food.servingG && !quick.includes(food.servingG)) quick.unshift(food.servingG);

  openSheet({
    size: 'md',
    html: `
      <h2>${esc(food.name)}</h2>
      <p>${esc([food.brand, food.quantity].filter(Boolean).join(' · ') || 'Valori per 100 g')}</p>

      <label class="field">
        <span>Quantità in grammi</span>
        <input type="number" id="p-grams" inputmode="decimal" min="1" step="1" value="${start}" />
      </label>

      <div class="chips" id="p-quick">
        ${quick.map((g) => `<button class="chip" type="button" data-g="${g}">${g} g</button>`).join('')}
      </div>

      <label class="field">
        <span>Pasto</span>
        <select id="p-slot">
          ${MEAL_SLOTS.map(
            (s) => `<option value="${s.id}" ${s.id === slot ? 'selected' : ''}>${s.icon} ${s.label}</option>`
          ).join('')}
        </select>
      </label>

      <div class="preview" id="p-preview"></div>

      <button class="btn" id="p-save" type="button">${entryId ? 'Salva modifiche' : 'Aggiungi al diario'}</button>
      ${entryId ? '<button class="btn btn--danger" id="p-del" type="button">Elimina</button>' : ''}
      <button class="btn btn--ghost" data-close type="button">Annulla</button>`,

    onMount: (panel, close) => {
      const gramsInput = panel.querySelector('#p-grams');
      const preview = panel.querySelector('#p-preview');

      const paint = () => {
        const g = num(gramsInput.value);
        const m = scaleMacros(food.per100, g);
        preview.innerHTML = `
          <span class="preview__k">${fmt(m.kcal)}<small> kcal</small></span>
          <span class="preview__m">P ${fmt(m.protein, 1)} · C ${fmt(m.carbs, 1)} · G ${fmt(m.fat, 1)} g</span>`;
        panel
          .querySelectorAll('#p-quick .chip')
          .forEach((c) => c.setAttribute('aria-pressed', String(num(c.dataset.g) === g)));
      };
      paint();

      gramsInput.addEventListener('input', paint);
      panel.querySelector('#p-quick').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-g]');
        if (!btn) return;
        gramsInput.value = btn.dataset.g;
        paint();
      });

      panel.querySelector('#p-save').addEventListener('click', async () => {
        const g = num(gramsInput.value);
        if (g <= 0) return toast('Inserisci una quantità maggiore di zero', 'error');

        const payload = {
          date: state.selectedDate,
          slot: panel.querySelector('#p-slot').value,
          name: food.name,
          brand: food.brand || '',
          code: food.code || '',
          image: food.image || '',
          grams: round(g, 1),
          per100: food.per100,
          totals: scaleMacros(food.per100, g)
        };

        try {
          if (entryId) await updateEntry(entryId, payload);
          else await addEntry(payload);
          await rememberFood({
            name: food.name,
            brand: food.brand || '',
            code: food.code || '',
            image: food.image || '',
            servingG: food.servingG || null,
            per100: food.per100,
            source: food.source || 'manual'
          });
          invalidateLocalIndex(); // i recenti sono cambiati
          close();
          toast(entryId ? 'Pasto aggiornato' : 'Aggiunto al diario', 'ok');
          render();
        } catch (err) {
          toast(`Salvataggio fallito: ${err.message}`, 'error');
        }
      });

      panel.querySelector('#p-del')?.addEventListener('click', async () => {
        close();
        const ok = await confirmSheet({
          title: 'Eliminare questo alimento?',
          text: `"${food.name}" verrà rimosso dal diario del giorno.`
        });
        if (!ok) return;
        await deleteEntry(entryId);
        toast('Eliminato', 'ok');
        render();
      });
    }
  });
}

// ---------------------------------------------------------------------------
// Scheda ricerca alimento
// ---------------------------------------------------------------------------

const SOURCE_ICON = { base: '🥬', recipe: '📖', manual: '✏️', off: '🏷️' };

function suggestionHTML(food, index, src) {
  const meta =
    [food.brand, food.quantity].filter(Boolean).join(' · ') ||
    (food.source === 'manual' ? 'Inserito a mano' : 'Open Food Facts');
  const icon = SOURCE_ICON[food.source] || '🍽️';
  return `
    <button class="sugg" type="button" data-idx="${index}" data-src="${src}">
      ${
        food.image
          ? `<img class="sugg__img" src="${esc(food.image)}" alt="" loading="lazy" />`
          : `<span class="sugg__img sugg__img--none">${icon}</span>`
      }
      <span class="sugg__name">${esc(food.name)}</span>
      <span class="sugg__meta">${esc(meta)}</span>
      <span class="sugg__kcal">${fmt(food.per100.kcal)}<small>kcal/100g</small></span>
    </button>`;
}

/**
 * Scheda di ricerca alimento.
 * `onPick(food)` sostituisce il salvataggio nel diario (usato dal piano settimanale).
 * `lockSlot` nasconde il selettore di pasto.
 */
export function openFoodPicker(slot, { onPick, lockSlot = false } = {}) {
  let controller = null;
  let localShown = [];   // ricette + alimenti base + recenti
  let offShown = [];     // prodotti confezionati da Open Food Facts
  let mode = 'browse';   // browse | barcode | manual

  openSheet({
    size: 'lg',
    html: `
      <div class="picker">
        <header class="picker__head">
          <div>
            <h2>Aggiungi alimento</h2>
            <p class="picker__sub">${esc(formatDateLong(state.selectedDate))}</p>
          </div>
          <button class="iconbtn" data-close type="button" aria-label="Chiudi">✕</button>
        </header>

        ${
          lockSlot
            ? ''
            : `<label class="field picker__slot">
                 <span>Pasto</span>
                 <select id="pk-slot">
                   ${MEAL_SLOTS.map(
                     (s) => `<option value="${s.id}" ${s.id === slot ? 'selected' : ''}>${s.icon} ${s.label}</option>`
                   ).join('')}
                 </select>
               </label>`
        }

        <div data-mode="browse">
          <div class="search">
            <input id="q" type="search" placeholder="Mela, petto di pollo, zucchine…" autocomplete="off" enterkeyhint="search" />
            <span class="search__spin" id="spin" hidden></span>
          </div>
          <p class="picker__label" id="list-label">Recenti</p>
          <div class="sugglist" id="list"><p class="empty">Caricamento…</p></div>
          <p class="picker__label" id="off-label" hidden>Prodotti confezionati</p>
          <div class="sugglist" id="off-list"></div>
        </div>

        <div data-mode="barcode" hidden>
          <label class="field"><span>Codice a barre EAN</span>
            <input id="bc" type="text" inputmode="numeric" placeholder="8001234567890" enterkeyhint="go" /></label>
          <button class="btn" id="bc-go" type="button">Cerca prodotto</button>
          <p class="stat__hint" style="margin-top:12px">Digita il codice sotto le barre: Safari su iPad non espone la scansione dalla fotocamera.</p>
        </div>

        <div data-mode="manual" hidden>
          <div class="formgrid">
            <label class="field"><span>Nome alimento</span><input id="m-name" type="text" placeholder="Es. Pasta al pomodoro" /></label>
            <label class="field"><span>Calorie / 100 g</span><input id="m-kcal" type="number" inputmode="decimal" min="0" step="1" /></label>
            <label class="field"><span>Proteine / 100 g</span><input id="m-protein" type="number" inputmode="decimal" min="0" step="0.1" /></label>
            <label class="field"><span>Carboidrati / 100 g</span><input id="m-carbs" type="number" inputmode="decimal" min="0" step="0.1" /></label>
            <label class="field"><span>Grassi / 100 g</span><input id="m-fat" type="number" inputmode="decimal" min="0" step="0.1" /></label>
          </div>
          <button class="btn" id="m-next" type="button">Continua</button>
        </div>

        <footer class="picker__foot">
          <button class="chip" type="button" data-mode-btn="browse" aria-pressed="true">🔍 Cerca</button>
          <button class="chip" type="button" data-mode-btn="barcode" aria-pressed="false">📷 Barcode</button>
          <button class="chip" type="button" data-mode-btn="manual" aria-pressed="false">✏️ Manuale</button>
        </footer>
      </div>`,

    onMount: (panel, close) => {
      const listBox = panel.querySelector('#list');
      const listLabel = panel.querySelector('#list-label');
      const spin = panel.querySelector('#spin');
      const queryInput = panel.querySelector('#q');

      const chosenSlot = () => panel.querySelector('#pk-slot')?.value || slot;

      const pick = (food) => {
        if (!food) return;
        const target = chosenSlot();
        close();
        if (onPick) onPick(food);
        else portionSheet({ food, slot: target });
      };

      const offLabel = panel.querySelector('#off-label');
      const offBox = panel.querySelector('#off-list');

      const paintLocal = (items, label, emptyText) => {
        localShown = items;
        listLabel.textContent = label;
        listBox.innerHTML = items.length
          ? items.map((f, i) => suggestionHTML(f, i, 'local')).join('')
          : `<p class="empty">${esc(emptyText)}</p>`;
      };

      const clearOff = () => {
        offShown = [];
        offLabel.hidden = true;
        offBox.innerHTML = '';
      };

      const showDefaults = () => {
        clearOff();
        const items = defaultSuggestions();
        paintLocal(
          items,
          items.length ? 'Usati di recente' : 'Suggerimenti',
          'Cerca un alimento: frutta, verdura, carne e pesce sono già in archivio.'
        );
      };

      // Ricette e alimenti recenti dell'utente, poi i suggerimenti iniziali.
      (async () => {
        try {
          await loadLocalIndex();
          if (!queryInput.value.trim()) showDefaults();
        } catch (err) {
          listBox.innerHTML = `<p class="empty">${esc(err.message)}</p>`;
        }
      })();

      const runSearch = debounce(async (term) => {
        controller?.abort();
        controller = new AbortController();
        const signal = controller.signal;

        if (term.trim().length < 2) {
          spin.hidden = true;
          return showDefaults();
        }

        // Fase 1 — locale: ricette e alimenti base, subito e senza rete.
        paintLocal(
          searchLocal(term),
          'Alimenti e ricette',
          'Nessun alimento base con questo nome. Guarda fra i prodotti confezionati o usa “Manuale”.'
        );

        // Fase 2 — Open Food Facts. Se fallisce, i risultati locali restano.
        clearOff();
        spin.hidden = false;
        offLabel.hidden = false;
        try {
          const packaged = await searchPackaged(term, { signal });
          if (signal.aborted) return;
          offShown = packaged;
          offBox.innerHTML = packaged.length
            ? packaged.map((f, i) => suggestionHTML(f, i, 'off')).join('')
            : '<p class="empty">Nessun prodotto confezionato con questo nome.</p>';
        } catch (err) {
          if (err.name === 'AbortError') return;
          offBox.innerHTML =
            '<p class="empty">Open Food Facts non risponde ora. Gli alimenti qui sopra funzionano lo stesso.</p>';
        } finally {
          if (!signal.aborted) spin.hidden = true;
        }
      }, 500);

      queryInput.addEventListener('input', (e) => runSearch(e.target.value));

      const onListClick = (e) => {
        const btn = e.target.closest('[data-idx]');
        if (!btn) return;
        pick((btn.dataset.src === 'off' ? offShown : localShown)[Number(btn.dataset.idx)]);
      };
      listBox.addEventListener('click', onListClick);
      offBox.addEventListener('click', onListClick);

      // --- cambio modalità ---
      panel.querySelector('.picker__foot').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-mode-btn]');
        if (!btn) return;
        mode = btn.dataset.modeBtn;
        panel
          .querySelectorAll('[data-mode-btn]')
          .forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
        panel.querySelectorAll('[data-mode]').forEach((p) => (p.hidden = p.dataset.mode !== mode));
        if (mode === 'browse') queryInput.focus();
      });

      // --- barcode ---
      const lookup = async () => {
        const code = panel.querySelector('#bc').value.trim();
        if (!code) return;
        try {
          const food = await getFoodByBarcode(code);
          if (!food) return toast('Prodotto non trovato su Open Food Facts', 'error');
          pick(food);
        } catch (err) {
          toast(err.message, 'error');
        }
      };
      panel.querySelector('#bc-go').addEventListener('click', lookup);
      panel.querySelector('#bc').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') lookup();
      });

      // --- manuale ---
      panel.querySelector('#m-next').addEventListener('click', () => {
        const name = panel.querySelector('#m-name').value.trim();
        if (!name) return toast('Serve un nome per l’alimento', 'error');
        pick({
          name,
          brand: '',
          code: '',
          image: '',
          servingG: null,
          source: 'manual',
          per100: {
            kcal: num(panel.querySelector('#m-kcal').value),
            protein: num(panel.querySelector('#m-protein').value),
            carbs: num(panel.querySelector('#m-carbs').value),
            fat: num(panel.querySelector('#m-fat').value)
          }
        });
      });
    }
  });
}

// ---------------------------------------------------------------------------
// View Pasti
// ---------------------------------------------------------------------------

function entryHTML(entry) {
  const t = entry.totals || {};
  return `
    <li class="food">
      <button class="food__row" type="button" data-entry="${esc(entry.id)}">
        <span class="food__name">${esc(entry.name)}</span>
        <span class="food__qty">${fmt(entry.grams)} g</span>
        <span class="food__kcal">${fmt(t.kcal)}<small> kcal</small></span>
      </button>
    </li>`;
}

/** Copia nel diario i pasti pianificati per il giorno della settimana scelto. */
async function importPlan(date) {
  const items = state.plan?.[String(isoWeekday(date))] || [];
  if (!items.length) {
    return toast('Nessun pasto pianificato per questo giorno. Impostalo in Dieta.', 'error');
  }
  const ok = await confirmSheet({
    title: 'Importare il piano del giorno?',
    text: `${items.length} alimenti verranno aggiunti al diario di ${formatDateLong(date).toLowerCase()}.`,
    confirmLabel: 'Importa'
  });
  if (!ok) return;

  await Promise.all(
    items.map((item) =>
      addEntry({
        date,
        slot: item.slot,
        name: item.name,
        brand: item.brand || '',
        code: item.code || '',
        image: item.image || '',
        grams: num(item.grams),
        per100: item.per100,
        totals: scaleMacros(item.per100, item.grams)
      })
    )
  );
  toast(`${items.length} alimenti importati dal piano`, 'ok');
  render();
}

export async function renderMeals(view) {
  const date = state.selectedDate;
  const entries = await listEntries(date);
  const totals = sumMacros(entries);
  const target = num(state.targets.kcal, 2000);

  const slotsHTML = MEAL_SLOTS.map((slot) => {
    const items = entries.filter((e) => e.slot === slot.id);
    const sum = sumMacros(items);
    return `
      <section class="slot">
        <div class="slot__head">
          <span class="slot__name">${slot.icon} ${slot.label}</span>
          <span class="slot__sum">${items.length ? `${fmt(sum.kcal)} kcal` : ''}</span>
          <button class="addbtn addbtn--sm" type="button" data-add="${slot.id}"
                  aria-label="Aggiungi a ${esc(slot.label)}">${PLUS_SVG}</button>
        </div>
        ${
          items.length
            ? `<ul class="list list--compact">${items.map(entryHTML).join('')}</ul>`
            : '<p class="slot__empty">Niente registrato</p>'
        }
      </section>`;
  }).join('');

  // Tutto dentro un contenitore ricreato a ogni render: il listener delegato
  // vive sul contenitore, non su #view (che invece sopravvive ai cambi di view).
  view.innerHTML = `<div id="meals-root">
    <h2 class="sectiontitle">Riepilogo</h2>
    <section class="card">
      <div class="card__head">
        <h2>Totale ${esc(formatDateLong(date).toLowerCase())}</h2>
        <strong class="bigkcal">${fmt(totals.kcal)}<span>/ ${fmt(target)} kcal</span></strong>
      </div>
      ${macroBarsHTML(totals, state.targets)}
      <button class="btn btn--ghost btn--sm" type="button" data-import style="margin-top:18px">
        📋 Importa piano del giorno
      </button>
    </section>

    <h2 class="sectiontitle">Diario dei pasti</h2>
    <div class="slots">${slotsHTML}</div>

    <button class="addbtn addbtn--fab" type="button" data-fab aria-label="Aggiungi alimento">${PLUS_SVG}</button>
  </div>`;

  view.querySelector('#meals-root').addEventListener('click', (e) => {
    if (e.target.closest('[data-fab]')) return openFoodPicker(slotForNow());

    const addBtn = e.target.closest('[data-add]');
    if (addBtn) return openFoodPicker(addBtn.dataset.add);

    if (e.target.closest('[data-import]')) return importPlan(date);

    const row = e.target.closest('[data-entry]');
    if (row) {
      const entry = entries.find((x) => x.id === row.dataset.entry);
      if (!entry) return;
      portionSheet({
        food: {
          name: entry.name,
          brand: entry.brand,
          code: entry.code,
          image: entry.image,
          per100: entry.per100,
          servingG: null,
          source: entry.code ? 'off' : 'manual'
        },
        slot: entry.slot,
        entryId: entry.id,
        grams: entry.grams
      });
    }
  });
}
