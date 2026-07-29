import { state, saveTargets, savePlan, refreshState } from '../store.js';
import { GOALS, MEAL_SLOTS, WEEKDAYS } from '../config.js';
import { statHTML, openSheet, confirmSheet, PLUS_SVG } from '../ui.js';
import { openFoodPicker } from './meals.js';
import { parsePlan, planSummary, templateCSV } from '../planimport.js';
import { DIETS, findDiet, targetsFromDiet } from '../diets.js';
import {
  esc,
  fmt,
  num,
  round,
  tdee,
  suggestTargets,
  macroKcal,
  scaleMacros,
  sumMacros,
  isoWeekday,
  toast,
  toISODate
} from '../utils.js';
import { render } from '../router.js';

let openDay = isoWeekday(toISODate());

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Import del piano da modello CSV, file o testo incollato.
 * `apply(nextPlan)` riceve il piano risultante.
 */
function importSheet(apply) {
  let parsed = null;

  openSheet({
    size: 'lg',
    html: `<div class="picker">
      <header class="picker__head">
        <div><h2>Importa piano settimanale</h2>
          <p class="picker__sub">Da file, da modello o incollando il testo</p></div>
        <button class="iconbtn" data-close type="button" aria-label="Chiudi">✕</button>
      </header>

      <div data-mode="import">
        <div class="chips" style="margin-bottom:16px">
          <button class="chip" type="button" id="imp-template">⬇️ Scarica modello CSV</button>
          <label class="chip" for="imp-file">📂 Carica file CSV o JSON</label>
          <input id="imp-file" type="file" accept=".csv,.txt,.json,text/csv,application/json" hidden />
        </div>

        <label class="field">
          <span>Oppure incolla qui il piano</span>
          <textarea id="imp-text" rows="9" placeholder="lunedi,pranzo,Pasta di semola (c),90
lunedi,pranzo,Petto di pollo (c),150
lunedi,cena,Merluzzo (c),200"></textarea>
        </label>

        <p class="stat__hint">
          Una riga per alimento: <code>giorno, pasto, alimento, grammi</code>.
          I valori nutrizionali sono facoltativi — se li ometti vengono cercati fra i
          186 alimenti in archivio. Da un sito web: seleziona la tabella, copiala e incollala qui
          (il browser non può scaricare direttamente le pagine di altri siti).
        </p>

        <div id="imp-preview"></div>
      </div>

      <footer class="picker__foot">
        <button class="btn btn--sm" type="button" id="imp-check" style="width:auto">Analizza</button>
        <button class="btn btn--sm" type="button" id="imp-apply" style="width:auto" disabled>Sostituisci piano</button>
      </footer>
    </div>`,

    onMount: (panel, close) => {
      const textarea = panel.querySelector('#imp-text');
      const preview = panel.querySelector('#imp-preview');
      const applyBtn = panel.querySelector('#imp-apply');

      panel.querySelector('#imp-template').addEventListener('click', () => {
        downloadBlob(new Blob([templateCSV()], { type: 'text/csv;charset=utf-8' }),
          'simple-diet-modello-piano.csv');
        toast('Modello scaricato', 'ok');
      });

      panel.querySelector('#imp-file').addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        textarea.value = await file.text();
        analyse();
      });

      const analyse = () => {
        const raw = textarea.value.trim();
        if (!raw) {
          preview.innerHTML = '<p class="empty">Incolla il piano o carica un file.</p>';
          applyBtn.disabled = true;
          return;
        }
        parsed = parsePlan(raw);
        const rows = planSummary(parsed.plan);
        const totale = rows.reduce((a, r) => a + r.count, 0);
        applyBtn.disabled = totale === 0;

        preview.innerHTML = `
          <p class="picker__label">Anteprima — ${fmt(parsed.aggiunti)} alimenti su ${fmt(parsed.righe)} righe</p>
          <div class="tablewrap">
            <table><thead><tr><th>Giorno</th><th>Alimenti</th><th>Calorie</th></tr></thead>
              <tbody>${rows
                .map(
                  (r) =>
                    `<tr><td>${esc(r.day.label)}</td><td>${r.count || '—'}</td><td>${
                      r.kcal ? `${fmt(r.kcal)} kcal` : '—'
                    }</td></tr>`
                )
                .join('')}</tbody></table>
          </div>
          ${
            parsed.avvisi.length
              ? `<p class="picker__label" style="margin-top:14px">Avvisi (${parsed.avvisi.length})</p>
                 <ul class="warnlist">${parsed.avvisi
                   .slice(0, 12)
                   .map((w) => `<li>${esc(w)}</li>`)
                   .join('')}</ul>`
              : ''
          }`;
      };

      panel.querySelector('#imp-check').addEventListener('click', analyse);
      textarea.addEventListener('paste', () => setTimeout(analyse, 0));

      applyBtn.addEventListener('click', async () => {
        if (!parsed) return;
        const totale = Object.values(parsed.plan).reduce((a, v) => a + v.length, 0);
        close();
        const ok = await confirmSheet({
          title: 'Sostituire il piano attuale?',
          text: `Il piano settimanale verrà rimpiazzato con ${totale} alimenti. L'operazione non è annullabile.`,
          confirmLabel: 'Sostituisci'
        });
        if (!ok) return;
        await apply(parsed.plan);
        toast(`Piano importato: ${totale} alimenti`, 'ok');
      });
    }
  });
}

function dietCardHTML(diet) {
  const foto = diet.photo?.url
    ? `<img class="cover__img" src="${esc(diet.photo.url)}" alt="" loading="lazy" decoding="async" />`
    : '';
  return `
    <button class="dietcard" type="button" data-diet="${esc(diet.id)}">
      <span class="cover cover--diet" style="background:${diet.cover}" aria-hidden="true">
        <span class="cover__icon">${diet.icon}</span>${foto}
      </span>
      <span class="dietcard__body">
        <span class="dietcard__name">${esc(diet.name)}</span>
        <span class="dietcard__claim">${esc(diet.claim)}</span>
        <span class="dietcard__macro">
          <b>${fmt(diet.media.kcal)}</b> kcal/giorno ·
          C ${diet.split.carbs}% · P ${diet.split.protein}% · G ${diet.split.fat}%
        </span>
      </span>
    </button>`;
}

/** Scheda dieta: descrizione, settimana giorno per giorno, applicazione. */
function dietSheet(diet, apply) {
  openSheet({
    size: 'lg',
    html: `<div class="picker">
      <header class="picker__head picker__head--cover">
        <span class="cover cover--sm" style="background:${diet.cover}" aria-hidden="true">
          <span class="cover__icon">${diet.icon}</span>
          ${diet.photo?.url ? `<img class="cover__img" src="${esc(diet.photo.url)}" alt="" />` : ''}
        </span>
        <div><h2>Dieta ${esc(diet.name)}</h2>
          <p class="picker__sub">${fmt(diet.media.kcal)} kcal al giorno · ${diet.conteggio} alimenti</p></div>
        <button class="iconbtn" data-close type="button" aria-label="Chiudi">✕</button>
      </header>

      <div data-mode="dieta">
        <p class="idea__steps">${esc(diet.description)}</p>

        <div class="chips" style="margin:14px 0">
          ${diet.highlights.map((h) => `<span class="chip chip--static">${esc(h)}</span>`).join('')}
        </div>

        <p class="picker__label">Media giornaliera</p>
        <div class="preview">
          <span class="preview__k">${fmt(diet.media.kcal)}<small> kcal</small></span>
          <span class="preview__m">P ${fmt(diet.media.protein)} · C ${fmt(diet.media.carbs)} · G ${fmt(diet.media.fat)} g</span>
        </div>

        <p class="picker__label" style="margin-top:16px">La settimana</p>
        <div class="tablewrap">
          <table><thead><tr><th>Giorno</th><th>Alimenti</th><th>Calorie</th></tr></thead>
            <tbody>${diet.perGiorno
              .map(
                (g) =>
                  `<tr><td>${esc(g.day.label)}</td><td>${g.items.length}</td><td>${fmt(g.totals.kcal)} kcal</td></tr>`
              )
              .join('')}</tbody></table>
        </div>

        ${diet.perGiorno
          .map(
            (g) => `
          <p class="picker__label" style="margin-top:16px">${esc(g.day.label)}</p>
          <ul class="list list--compact">
            ${MEAL_SLOTS.map((slot) => {
              const own = g.items.filter((i) => i.slot === slot.id);
              if (!own.length) return '';
              return own
                .map((i) => {
                  const m = scaleMacros(i.per100, i.grams);
                  return `<li class="food"><div class="food__row food__row--static">
                    <span class="food__name">${slot.icon} ${esc(i.name)}</span>
                    <span class="food__qty">${fmt(i.grams)} g</span>
                    <span class="food__kcal">${fmt(m.kcal)}<small> kcal</small></span>
                  </div></li>`;
                })
                .join('');
            }).join('')}
          </ul>`
          )
          .join('')}

        ${diet.photo?.credit ? `<p class="idea__credit">Foto: ${esc(diet.photo.credit)}</p>` : ''}
      </div>

      <footer class="picker__foot">
        <label class="switch" style="margin:0 auto 0 0">
          <input type="checkbox" id="d-targets" checked />
          <span>Imposta anche gli obiettivi</span>
        </label>
        <button class="btn btn--sm" id="d-apply" type="button" style="width:auto">Applica al piano</button>
      </footer>
    </div>`,

    onMount: (panel, close) => {
      panel.querySelector('#d-apply').addEventListener('click', async () => {
        const anche = panel.querySelector('#d-targets').checked;
        close();
        const ok = await confirmSheet({
          title: `Applicare la dieta ${diet.name}?`,
          text:
            `Il piano settimanale verrà sostituito con ${diet.conteggio} alimenti` +
            (anche ? ' e gli obiettivi giornalieri verranno ricalcolati' : '') +
            '. I pasti già registrati non vengono toccati.',
          confirmLabel: 'Applica'
        });
        if (!ok) return;
        await apply(diet, anche);
      });
    }
  });
}

function planItemHTML(item, index) {
  const m = scaleMacros(item.per100, item.grams);
  return `
    <li class="food">
      <div class="food__row food__row--x">
        <span class="food__name">${esc(item.name)}</span>
        <span class="food__qty">${fmt(item.grams)} g</span>
        <span class="food__kcal">${fmt(m.kcal)}<small> kcal</small></span>
        <button class="food__x" type="button" data-remove="${index}" aria-label="Rimuovi ${esc(item.name)}">✕</button>
      </div>
    </li>`;
}

function planHTML(plan, targets) {
  const items = plan[String(openDay)] || [];
  const totals = sumMacros(items, (i) => scaleMacros(i.per100, i.grams));
  const diff = round(totals.kcal - num(targets.kcal));
  const offTarget = Math.abs(diff) > num(targets.kcal) * 0.1;

  const slots = MEAL_SLOTS.map((slot) => {
    const own = items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => item.slot === slot.id);
    const sum = sumMacros(own.map((o) => o.item), (i) => scaleMacros(i.per100, i.grams));
    return `
      <section class="slot">
        <div class="slot__head">
          <span class="slot__name">${slot.icon} ${slot.label}</span>
          <span class="slot__sum">${own.length ? `${fmt(sum.kcal)} kcal` : '—'}</span>
          <button class="addbtn addbtn--sm" type="button" data-plan-add="${slot.id}"
                  aria-label="Aggiungi a ${esc(slot.label)}">${PLUS_SVG}</button>
        </div>
        ${own.length ? `<ul class="list list--compact">${own.map(({ item, index }) => planItemHTML(item, index)).join('')}</ul>` : ''}
      </section>`;
  }).join('');

  return `
    <div class="chips chips--days" id="day-tabs">
      ${WEEKDAYS.map(
        (d) =>
          `<button class="chip" type="button" data-day="${d.id}" aria-pressed="${d.id === openDay}">${d.short}</button>`
      ).join('')}
    </div>

    <div class="planbar ${offTarget ? 'planbar--off' : ''}">
      <div>
        <span class="planbar__k">${fmt(totals.kcal)} kcal</span>
        <span class="planbar__d">${diff > 0 ? '+' : ''}${fmt(diff)} vs target</span>
      </div>
      <span class="planbar__m">P ${fmt(totals.protein)} · C ${fmt(totals.carbs)} · G ${fmt(totals.fat)} g</span>
    </div>

    <div class="slots">${slots}</div>
    ${
      items.length
        ? `<button class="btn btn--ghost btn--sm" type="button" data-copy-day style="margin-top:12px">📄 Copia questo giorno su…</button>`
        : ''
    }`;
}

export async function renderDiet(view) {
  const { profile, targets, plan } = state;
  const suggested = suggestTargets(profile);

  view.innerHTML = `
    <h2 class="sectiontitle">Diete mensili</h2>
    <p class="sectionlead">Una settimana tipo che si ripete per il mese. Applicandola
      sostituisci il piano settimanale qui sotto.</p>
    <div class="dietgrid">${DIETS.map(dietCardHTML).join('')}</div>

    <div class="grid grid--stats section">
      ${statHTML({ label: 'Fabbisogno (TDEE)', value: fmt(tdee(profile)), unit: 'kcal', hint: 'Dal profilo', tone: 'carbs' })}
      ${statHTML({
        label: 'Consigliato',
        value: fmt(suggested.kcal),
        unit: 'kcal',
        hint: GOALS.find((g) => g.id === profile.goal)?.label || '',
        tone: 'protein'
      })}
      ${statHTML({ label: 'Target attivo', value: fmt(targets.kcal), unit: 'kcal', hint: targets.auto ? 'Automatico' : 'Manuale', tone: 'kcal' })}
      ${statHTML({
        label: 'Split macro',
        value: `${fmt(targets.protein)}/${fmt(targets.carbs)}/${fmt(targets.fat)}`,
        hint: 'Proteine / carbo / grassi (g)',
        tone: 'fat'
      })}
    </div>

    <div class="sectionbar">
      <h2 class="sectiontitle">Piano settimanale</h2>
      <div class="sectionbar__acts">
        <button class="btn btn--ghost btn--sm" type="button" id="plan-import">📥 Importa</button>
        <button class="btn btn--ghost btn--sm" type="button" id="plan-export">📤 Esporta</button>
      </div>
    </div>
    <section class="card">
      <div id="plan">${planHTML(plan, targets)}</div>
    </section>`;

  // ---- piano settimanale ----
  const planBox = view.querySelector('#plan');
  const repaintPlan = () => {
    planBox.innerHTML = planHTML(state.plan, state.targets);
  };

  const persistPlan = async (next) => {
    state.plan = next;
    repaintPlan();
    try {
      await savePlan(next);
    } catch (err) {
      toast(`Salvataggio piano fallito: ${err.message}`, 'error');
    }
  };

  planBox.addEventListener('click', (e) => {
    const dayBtn = e.target.closest('[data-day]');
    if (dayBtn) {
      openDay = Number(dayBtn.dataset.day);
      return repaintPlan();
    }

    const addBtn = e.target.closest('[data-plan-add]');
    if (addBtn) {
      const slot = addBtn.dataset.planAdd;
      return openFoodPicker(slot, { onPick: (food) => askGrams(food, slot), lockSlot: true });
    }

    const removeBtn = e.target.closest('[data-remove]');
    if (removeBtn) {
      const index = Number(removeBtn.dataset.remove);
      const key = String(openDay);
      return persistPlan({
        ...state.plan,
        [key]: (state.plan[key] || []).filter((_, i) => i !== index)
      });
    }

    if (e.target.closest('[data-copy-day]')) return copyDaySheet();
  });

  // ---- diete mensili ----
  view.querySelector('.dietgrid').addEventListener('click', (e) => {
    const card = e.target.closest('[data-diet]');
    if (!card) return;
    const diet = findDiet(card.dataset.diet);
    if (!diet) return;

    dietSheet(diet, async (d, ancheTarget) => {
      await persistPlan(d.plan);
      if (ancheTarget) {
        // I target seguono la ripartizione della dieta, ma sulle calorie
        // dell'utente: il piano è un modello, il fabbisogno è personale.
        const kcal = num(state.targets.kcal) || d.media.kcal;
        await saveTargets(targetsFromDiet(d, kcal));
        await refreshState();
      }
      toast(`Dieta ${d.name} applicata`, 'ok');
      render();
    });
  });

  view.querySelector('#plan-import').addEventListener('click', () => importSheet(persistPlan));
  view.querySelector('#plan-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify({ plan: state.plan }, null, 2)], {
      type: 'application/json'
    });
    downloadBlob(blob, `simple-diet-piano-${toISODate()}.json`);
    toast('Piano esportato', 'ok');
  });

  function askGrams(food, slot) {
    openSheet({
      size: 'sm',
      html: `
        <h2>${esc(food.name)}</h2>
        <p>Quantità pianificata per ${esc(MEAL_SLOTS.find((s) => s.id === slot)?.label || '')}</p>
        <label class="field"><span>Grammi</span>
          <input id="pl-g" type="number" inputmode="decimal" min="1" step="1" value="${food.servingG || 100}" /></label>
        <button class="btn" id="pl-ok" type="button">Aggiungi al piano</button>
        <button class="btn btn--ghost" data-close type="button">Annulla</button>`,
      onMount: (panel, close) => {
        panel.querySelector('#pl-ok').addEventListener('click', () => {
          const grams = num(panel.querySelector('#pl-g').value);
          if (grams <= 0) return toast('Quantità non valida', 'error');
          const key = String(openDay);
          const item = {
            slot,
            name: food.name,
            brand: food.brand || '',
            code: food.code || '',
            grams: round(grams, 1),
            per100: food.per100
          };
          close();
          persistPlan({ ...state.plan, [key]: [...(state.plan[key] || []), item] });
          toast('Aggiunto al piano', 'ok');
        });
      }
    });
  }

  function copyDaySheet() {
    const source = WEEKDAYS.find((d) => d.id === openDay);
    openSheet({
      size: 'sm',
      html: `
        <h2>Copia ${esc(source.label)}</h2>
        <p>I giorni selezionati verranno sovrascritti.</p>
        <div class="chips" id="copy-targets">
          ${WEEKDAYS.filter((d) => d.id !== openDay)
            .map((d) => `<button class="chip" type="button" data-t="${d.id}" aria-pressed="false">${d.label}</button>`)
            .join('')}
        </div>
        <button class="btn" id="copy-go" type="button">Copia</button>
        <button class="btn btn--ghost" data-close type="button">Annulla</button>`,
      onMount: (panel, close) => {
        panel.querySelector('#copy-targets').addEventListener('click', (e) => {
          const b = e.target.closest('[data-t]');
          if (b) b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
        });
        panel.querySelector('#copy-go').addEventListener('click', async () => {
          const picked = Array.from(panel.querySelectorAll('[data-t][aria-pressed="true"]')).map(
            (b) => b.dataset.t
          );
          if (!picked.length) return toast('Seleziona almeno un giorno', 'error');
          const items = state.plan[String(openDay)] || [];
          const next = { ...state.plan };
          picked.forEach((d) => {
            next[d] = items.map((i) => ({ ...i }));
          });
          close();
          await persistPlan(next);
          toast(`Copiato su ${picked.length} giorni`, 'ok');
        });
      }
    });
  }
}
