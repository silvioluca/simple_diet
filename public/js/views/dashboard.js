import { state, listEntries, listEntriesRange, listMeasures } from '../store.js';
import { ringHTML, macroBarsHTML, statHTML, alertHTML } from '../ui.js';
import { kcalHistoryChart, macroHistoryChart, macroSplitChart, trendChart } from '../charts.js';
import {
  esc,
  lastNDays,
  sumMacros,
  fmt,
  round,
  num,
  toISODate,
  formatDateLong,
  addDays
} from '../utils.js';

const WINDOW_DAYS = 14;

/** Somma le macro per ogni giorno della finestra; giorni senza dati = 0. */
function groupByDay(entries, days) {
  const byDay = new Map(days.map((d) => [d, []]));
  entries.forEach((e) => byDay.get(e.date)?.push(e));
  return days.map((d) => ({ date: d, ...sumMacros(byDay.get(d)), count: byDay.get(d).length }));
}

function buildAlerts({ date, totals, targets, daily, measures }) {
  const alerts = [];
  const isToday = date === toISODate();
  const kcalTarget = num(targets.kcal, 2000);

  if (totals.kcal > kcalTarget * 1.1) {
    alerts.push({
      kind: 'bad',
      icon: '🔥',
      title: `${fmt(totals.kcal - kcalTarget)} kcal oltre il target`,
      text: 'Surplus sopra il 10%. Compensa nei prossimi giorni o alza il target se cresci di peso.'
    });
  } else if (!isToday && totals.kcal > 0 && totals.kcal < kcalTarget * 0.7) {
    alerts.push({
      kind: 'warn',
      icon: '📉',
      title: `Solo ${fmt(totals.kcal)} kcal registrate`,
      text: 'Sotto il 70% del fabbisogno: pasti dimenticati o deficit troppo aggressivo.'
    });
  }

  const proteinTarget = num(targets.protein, 0);
  if (proteinTarget > 0 && totals.protein < proteinTarget * 0.8 && totals.kcal > 0) {
    alerts.push({
      kind: 'warn',
      icon: '🥩',
      title: `Proteine basse: mancano ${fmt(proteinTarget - totals.protein)} g`,
      text: 'Sotto l’80% del target. In deficit le proteine proteggono la massa magra.'
    });
  }

  const missing = daily.filter((d) => d.count === 0 && d.date <= toISODate()).length;
  if (missing >= 3) {
    alerts.push({
      kind: 'warn',
      icon: '🗓️',
      title: `${missing} giorni senza registrazioni negli ultimi ${WINDOW_DAYS}`,
      text: 'Le medie e i grafici diventano poco affidabili con troppi buchi.'
    });
  }

  const last = measures[0];
  if (!last) {
    alerts.push({
      kind: 'warn',
      icon: '📏',
      title: 'Nessuna misura registrata',
      text: 'Inserisci il peso nella sezione Misure: serve anche a calcolare il fabbisogno.'
    });
  } else {
    const daysSince = Math.round(
      (Date.parse(toISODate()) - Date.parse(last.date)) / 86400000
    );
    if (daysSince > 10) {
      alerts.push({
        kind: 'warn',
        icon: '⚖️',
        title: `Ultima pesata ${daysSince} giorni fa`,
        text: 'Pesati almeno una volta a settimana per vedere se il target funziona.'
      });
    }
  }

  if (!alerts.length && totals.kcal > 0) {
    alerts.push({
      kind: 'ok',
      icon: '✅',
      title: 'Giornata in linea con il piano',
      text: 'Calorie e macro rientrano negli obiettivi impostati.'
    });
  }
  return alerts;
}

/** Media sui soli giorni con almeno una registrazione. */
function avgLogged(daily, key) {
  const logged = daily.filter((d) => d.count > 0);
  if (!logged.length) return 0;
  return logged.reduce((a, d) => a + num(d[key]), 0) / logged.length;
}

function weightDelta(measures, days) {
  const withWeight = measures.filter((m) => num(m.weight) > 0);
  if (withWeight.length < 2) return null;
  const latest = withWeight[0];
  const limit = addDays(latest.date, -days);
  const past = withWeight.find((m) => m.date <= limit) || withWeight[withWeight.length - 1];
  if (past.date === latest.date) return null;
  return round(num(latest.weight) - num(past.weight), 1);
}

export async function renderDashboard(view) {
  const date = state.selectedDate;
  const days = lastNDays(WINDOW_DAYS, date);
  const [entries, rangeEntries, measures] = await Promise.all([
    listEntries(date),
    listEntriesRange(days[0], date),
    listMeasures(120)
  ]);

  const totals = sumMacros(entries);
  const targets = state.targets;
  const daily = groupByDay(rangeEntries, days);
  const alerts = buildAlerts({ date, totals, targets, daily, measures });

  const avg7 = avgLogged(daily.slice(-7), 'kcal');
  const lastWeight = measures.find((m) => num(m.weight) > 0);
  const d7 = weightDelta(measures, 7);
  const d30 = weightDelta(measures, 30);
  const weightPoints = measures
    .filter((m) => num(m.weight) > 0)
    .slice(0, 90)
    .reverse()
    .map((m) => ({ x: m.date, y: num(m.weight) }));

  const deltaHint = (d) =>
    d == null ? '' : `${d > 0 ? '+' : ''}${fmt(d, 1)} kg`;
  const deltaClass = (d) => (d == null || d === 0 ? '' : d > 0 ? 'stat__hint--up' : 'stat__hint--down');

  view.innerHTML = `
    <h2 class="sectiontitle">${esc(formatDateLong(date))}</h2>
    <div class="grid">
      <section class="card card--span2">${ringHTML(totals.kcal, targets.kcal)}</section>
      <section class="card">
        <div class="card__head"><h2>Macronutrienti</h2></div>
        ${macroBarsHTML(totals, targets)}
      </section>
    </div>

    <h2 class="sectiontitle">In sintesi</h2>
    <div class="grid grid--stats">
      ${statHTML({
        label: 'Assunte oggi',
        value: fmt(totals.kcal),
        unit: 'kcal',
        hint: `${entries.length} alimenti registrati`
      })}
      ${statHTML({
        label: 'Media 7 giorni',
        value: fmt(avg7),
        unit: 'kcal',
        hint: avg7 ? `${fmt(avg7 - num(targets.kcal))} kcal vs target` : 'Nessun dato'
      })}
      ${statHTML({
        label: 'Peso attuale',
        value: lastWeight ? fmt(lastWeight.weight, 1) : '—',
        unit: lastWeight ? 'kg' : '',
        hint: d7 != null ? `${deltaHint(d7)} in 7 giorni` : 'Serve una seconda pesata',
        hintClass: deltaClass(d7)
      })}
      ${statHTML({
        label: 'Variazione 30 gg',
        value: d30 != null ? `${d30 > 0 ? '+' : ''}${fmt(d30, 1)}` : '—',
        unit: d30 != null ? 'kg' : '',
        hint: `Target: ${fmt(targets.kcal)} kcal/giorno`,
        hintClass: deltaClass(d30)
      })}
    </div>

    <h2 class="sectiontitle">Avvisi</h2>
    <div class="alerts">${alerts.map(alertHTML).join('')}</div>

    <h2 class="sectiontitle">Andamento</h2>
    <div class="grid">
      <section class="card card--span2">
        <div class="card__head"><h2>Calorie ultimi ${WINDOW_DAYS} giorni</h2></div>
        <div class="chartbox"><canvas id="ch-kcal"></canvas></div>
      </section>
      <section class="card">
        <div class="card__head"><h2>Ripartizione di oggi</h2></div>
        <div class="chartbox">${
          totals.kcal > 0
            ? '<canvas id="ch-split"></canvas>'
            : '<p class="empty">Nessun pasto registrato per questo giorno.</p>'
        }</div>
      </section>
      <section class="card card--span2">
        <div class="card__head"><h2>Macro per giorno</h2></div>
        <div class="chartbox"><canvas id="ch-macros"></canvas></div>
      </section>
      <section class="card">
        <div class="card__head"><h2>Andamento peso</h2></div>
        <div class="chartbox">${
          weightPoints.length > 1
            ? '<canvas id="ch-weight"></canvas>'
            : '<p class="empty">Servono almeno due pesate per il grafico.</p>'
        }</div>
      </section>
    </div>`;

  kcalHistoryChart('ch-kcal', days, daily.map((d) => round(d.kcal)), num(targets.kcal));
  macroHistoryChart('ch-macros', days, {
    protein: daily.map((d) => round(d.protein)),
    carbs: daily.map((d) => round(d.carbs)),
    fat: daily.map((d) => round(d.fat))
  });
  if (totals.kcal > 0) macroSplitChart('ch-split', totals);
  if (weightPoints.length > 1) trendChart('ch-weight', weightPoints, { label: 'Peso', unit: 'kg' });
}
