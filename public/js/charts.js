// Wrapper Chart.js: legge i colori dal tema corrente e tiene traccia delle
// istanze così ogni cambio di view può distruggerle senza leak sul canvas.
import { formatDateShort } from './utils.js';

const instances = new Map();

function css(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function palette() {
  return {
    kcal: css('--kcal'),
    protein: css('--protein'),
    carbs: css('--carbs'),
    fat: css('--fat'),
    line: css('--line'),
    text: css('--text-dim'),
    accent: css('--accent'),
    danger: css('--danger')
  };
}

function baseOptions(p) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        display: true,
        labels: { color: p.text, boxWidth: 10, boxHeight: 10, usePointStyle: true, padding: 14 }
      },
      tooltip: {
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
        boxPadding: 4
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: p.text, maxRotation: 0, autoSkipPadding: 12 } },
      y: {
        beginAtZero: true,
        grid: { color: p.line, drawBorder: false },
        ticks: { color: p.text, precision: 0 }
      }
    }
  };
}

/** Crea (o ricrea) un grafico dentro il canvas con quell'id. */
function mount(canvasId, config) {
  const canvas = document.getElementById(canvasId);
  if (!canvas || typeof window.Chart === 'undefined') return null;
  instances.get(canvasId)?.destroy();
  const chart = new window.Chart(canvas.getContext('2d'), config);
  instances.set(canvasId, chart);
  return chart;
}

export function destroyAllCharts() {
  instances.forEach((c) => c.destroy());
  instances.clear();
}

/** Barre kcal per giorno + linea del target. */
export function kcalHistoryChart(canvasId, days, values, target) {
  const p = palette();
  const opts = baseOptions(p);
  return mount(canvasId, {
    type: 'bar',
    data: {
      labels: days.map(formatDateShort),
      datasets: [
        {
          label: 'Calorie',
          data: values,
          backgroundColor: values.map((v) =>
            target && v > target * 1.05 ? p.danger : p.kcal
          ),
          borderRadius: 6,
          maxBarThickness: 34
        },
        {
          label: 'Target',
          type: 'line',
          data: days.map(() => target),
          borderColor: p.accent,
          borderDash: [5, 5],
          borderWidth: 2,
          pointRadius: 0,
          fill: false
        }
      ]
    },
    options: opts
  });
}

/** Grammi di proteine/carboidrati/grassi per giorno, barre impilate. */
export function macroHistoryChart(canvasId, days, series) {
  const p = palette();
  return mount(canvasId, {
    type: 'bar',
    data: {
      labels: days.map(formatDateShort),
      datasets: [
        { label: 'Proteine', data: series.protein, backgroundColor: p.protein, borderRadius: 4 },
        { label: 'Carboidrati', data: series.carbs, backgroundColor: p.carbs, borderRadius: 4 },
        { label: 'Grassi', data: series.fat, backgroundColor: p.fat, borderRadius: 4 }
      ]
    },
    options: {
      ...baseOptions(p),
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { color: p.text, maxRotation: 0 } },
        y: {
          stacked: true,
          beginAtZero: true,
          grid: { color: p.line },
          ticks: { color: p.text, callback: (v) => `${v} g` }
        }
      }
    }
  });
}

/** Ripartizione calorica dei macro di oggi. */
export function macroSplitChart(canvasId, { protein, carbs, fat }) {
  const p = palette();
  return mount(canvasId, {
    type: 'doughnut',
    data: {
      labels: ['Proteine', 'Carboidrati', 'Grassi'],
      datasets: [
        {
          data: [protein * 4, carbs * 4, fat * 9],
          backgroundColor: [p.protein, p.carbs, p.fat],
          borderWidth: 0,
          hoverOffset: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '62%',
      plugins: {
        legend: {
          position: 'bottom',
          labels: { color: p.text, usePointStyle: true, boxWidth: 8, padding: 14 }
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0) || 1;
              const pct = Math.round((ctx.parsed / total) * 100);
              return `${ctx.label}: ${Math.round(ctx.parsed)} kcal (${pct}%)`;
            }
          }
        }
      }
    }
  });
}

/** Linea singola (peso, circonferenza…). `points` = [{x: isoDate, y: value}]. */
export function trendChart(canvasId, points, { label, unit = '', color } = {}) {
  const p = palette();
  const stroke = color || p.accent;
  return mount(canvasId, {
    type: 'line',
    data: {
      labels: points.map((pt) => formatDateShort(pt.x)),
      datasets: [
        {
          label,
          data: points.map((pt) => pt.y),
          borderColor: stroke,
          backgroundColor: `${stroke}22`,
          borderWidth: 2.5,
          tension: 0.3,
          pointRadius: points.length > 40 ? 0 : 3,
          pointHoverRadius: 5,
          fill: true,
          spanGaps: true
        }
      ]
    },
    options: {
      ...baseOptions(p),
      plugins: { ...baseOptions(p).plugins, legend: { display: false } },
      scales: {
        x: { grid: { display: false }, ticks: { color: p.text, maxRotation: 0, autoSkipPadding: 16 } },
        y: {
          beginAtZero: false,
          grid: { color: p.line },
          ticks: { color: p.text, callback: (v) => `${v}${unit ? ` ${unit}` : ''}` }
        }
      }
    }
  });
}
