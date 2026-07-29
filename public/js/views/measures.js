import { state, saveMeasure, deleteMeasure, getMeasure, listMeasures } from '../store.js';
import { MEASURE_FIELDS } from '../config.js';
import { statHTML, confirmSheet } from '../ui.js';
import { trendChart } from '../charts.js';
import { esc, fmt, num, round, toast, formatDateLong, addDays } from '../utils.js';
import { render } from '../router.js';

let openMetric = 'weight';

function fieldsHTML(current) {
  return `<div class="formgrid">${MEASURE_FIELDS.map(
    (f) => `
      <label class="field">
        <span>${esc(f.label)} (${esc(f.unit)})</span>
        <input id="ms-${f.id}" type="number" inputmode="decimal" min="0" step="${f.step}"
               value="${current?.[f.id] != null ? num(current[f.id]) : ''}" placeholder="—" />
      </label>`
  ).join('')}
  <label class="field" style="grid-column:1/-1">
    <span>Nota</span>
    <input id="ms-note" type="text" value="${esc(current?.note || '')}" placeholder="Es. mattina a digiuno" />
  </label></div>`;
}

/** Differenza rispetto alla misura più vicina a `days` giorni prima. */
function delta(measures, field, days) {
  const list = measures.filter((m) => num(m[field]) > 0);
  if (list.length < 2) return null;
  const latest = list[0];
  const limit = addDays(latest.date, -days);
  const past = list.find((m) => m.date <= limit) || list[list.length - 1];
  if (past.date === latest.date) return null;
  return round(num(latest[field]) - num(past[field]), 1);
}

function bmi(weightKg, heightCm) {
  const h = num(heightCm) / 100;
  if (h <= 0 || num(weightKg) <= 0) return null;
  return round(num(weightKg) / (h * h), 1);
}

function bmiLabel(value) {
  if (value == null) return '';
  if (value < 18.5) return 'Sottopeso';
  if (value < 25) return 'Normopeso';
  if (value < 30) return 'Sovrappeso';
  return 'Obesità';
}

function historyTableHTML(measures) {
  if (!measures.length) return '<p class="empty">Nessuna misura registrata.</p>';
  const cols = MEASURE_FIELDS.filter((f) => measures.some((m) => num(m[f.id]) > 0));
  return `
    <div class="tablewrap">
      <table>
        <thead><tr><th>Data</th>${cols.map((c) => `<th>${esc(c.label)}</th>`).join('')}<th></th></tr></thead>
        <tbody>
          ${measures
            .slice(0, 30)
            .map(
              (m) => `
            <tr>
              <td>${esc(formatDateLong(m.date))}</td>
              ${cols.map((c) => `<td>${m[c.id] != null && num(m[c.id]) > 0 ? fmt(m[c.id], 1) : '—'}</td>`).join('')}
              <td><button class="iconbtn" type="button" data-del="${esc(m.date)}" aria-label="Elimina">🗑</button></td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    </div>`;
}

export async function renderMeasures(view) {
  const date = state.selectedDate;
  const [current, measures] = await Promise.all([getMeasure(date), listMeasures(200)]);

  const latest = measures.find((m) => num(m.weight) > 0);
  const d7 = delta(measures, 'weight', 7);
  const d30 = delta(measures, 'weight', 30);
  const bmiValue = latest ? bmi(latest.weight, state.profile.heightCm) : null;
  const waistHip =
    latest && num(latest.waist) > 0 && num(latest.hips) > 0
      ? round(num(latest.waist) / num(latest.hips), 2)
      : null;

  const available = MEASURE_FIELDS.filter((f) => measures.some((m) => num(m[f.id]) > 0));
  if (!available.some((f) => f.id === openMetric)) openMetric = available[0]?.id || 'weight';

  const deltaClass = (d) => (d == null || d === 0 ? '' : d > 0 ? 'stat__hint--up' : 'stat__hint--down');
  const deltaText = (d, label) =>
    d == null ? `Serve una seconda misura` : `${d > 0 ? '+' : ''}${fmt(d, 1)} kg in ${label}`;

  view.innerHTML = `
    <div class="grid grid--stats">
      ${statHTML({
        label: 'Peso attuale',
        tone: 'protein',
        value: latest ? fmt(latest.weight, 1) : '—',
        unit: latest ? 'kg' : '',
        hint: latest ? formatDateLong(latest.date) : 'Nessuna pesata'
      })}
      ${statHTML({
        label: 'Ultimi 7 giorni',
        tone: 'carbs',
        value: d7 != null ? `${d7 > 0 ? '+' : ''}${fmt(d7, 1)}` : '—',
        unit: d7 != null ? 'kg' : '',
        hint: deltaText(d7, '7 giorni'),
        hintClass: deltaClass(d7)
      })}
      ${statHTML({
        label: 'Ultimi 30 giorni',
        tone: 'fat',
        value: d30 != null ? `${d30 > 0 ? '+' : ''}${fmt(d30, 1)}` : '—',
        unit: d30 != null ? 'kg' : '',
        hint: deltaText(d30, '30 giorni'),
        hintClass: deltaClass(d30)
      })}
      ${statHTML({
        label: 'BMI',
        tone: 'grape',
        value: bmiValue != null ? fmt(bmiValue, 1) : '—',
        hint: waistHip != null ? `Vita/fianchi ${fmt(waistHip, 2)}` : bmiLabel(bmiValue)
      })}
    </div>

    <section class="card section">
      <div class="card__head">
        <h2>Misure di ${esc(formatDateLong(date).toLowerCase())}</h2>
        ${current ? '<button class="btn btn--ghost btn--sm" type="button" id="ms-del">Elimina giorno</button>' : ''}
      </div>
      ${fieldsHTML(current)}
      <button class="btn" id="ms-save" type="button">Salva misure</button>
    </section>

    <section class="card section">
      <div class="card__head"><h2>Andamento</h2></div>
      ${
        available.length
          ? `<div class="chips" id="metric-tabs">
               ${available
                 .map(
                   (f) =>
                     `<button class="chip" type="button" data-metric="${f.id}" aria-pressed="${
                       f.id === openMetric
                     }">${esc(f.label)}</button>`
                 )
                 .join('')}
             </div>
             <div class="chartbox"><canvas id="ch-measure"></canvas></div>`
          : '<p class="empty">Registra almeno due misure per vedere il grafico.</p>'
      }
    </section>

    <section class="card section">
      <div class="card__head"><h2>Storico</h2></div>
      ${historyTableHTML(measures)}
    </section>`;

  const drawMetric = () => {
    const field = MEASURE_FIELDS.find((f) => f.id === openMetric);
    if (!field) return;
    const points = measures
      .filter((m) => num(m[openMetric]) > 0)
      .reverse()
      .map((m) => ({ x: m.date, y: num(m[openMetric]) }));
    if (points.length < 2) return;
    trendChart('ch-measure', points, { label: field.label, unit: field.unit });
  };
  drawMetric();

  view.querySelector('#metric-tabs')?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-metric]');
    if (!btn) return;
    openMetric = btn.dataset.metric;
    view
      .querySelectorAll('[data-metric]')
      .forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
    drawMetric();
  });

  view.querySelector('#ms-save').addEventListener('click', async () => {
    const values = {};
    MEASURE_FIELDS.forEach((f) => {
      const raw = view.querySelector(`#ms-${f.id}`).value.trim();
      values[f.id] = raw === '' ? null : round(num(raw), 2);
    });
    values.note = view.querySelector('#ms-note').value.trim();

    if (MEASURE_FIELDS.every((f) => values[f.id] == null)) {
      return toast('Inserisci almeno un valore', 'error');
    }
    await saveMeasure(date, values);
    toast('Misure salvate', 'ok');
    render();
  });

  view.querySelector('#ms-del')?.addEventListener('click', async () => {
    const ok = await confirmSheet({
      title: 'Eliminare le misure del giorno?',
      text: `Tutti i valori di ${formatDateLong(date).toLowerCase()} verranno rimossi.`
    });
    if (!ok) return;
    await deleteMeasure(date);
    toast('Misure eliminate', 'ok');
    render();
  });

  view.querySelector('.tablewrap')?.addEventListener('click', async (e) => {
    const btn = e.target.closest('[data-del]');
    if (!btn) return;
    const target = btn.dataset.del;
    const ok = await confirmSheet({
      title: 'Eliminare la misura?',
      text: `Riga del ${formatDateLong(target).toLowerCase()}.`
    });
    if (!ok) return;
    await deleteMeasure(target);
    toast('Eliminata', 'ok');
    render();
  });
}
