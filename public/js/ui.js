// Componenti riusabili: anello calorie, barre macro, sheet modale.
import { esc, fmt, clamp, num } from './utils.js';

/** Icona "+" come SVG: il glifo di testo non si centra mai nel cerchio,
 *  perché la sua altezza dipende dalle metriche del font. */
export const PLUS_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
  '<path d="M12 5.5v13M5.5 12h13" fill="none" stroke="currentColor" ' +
  'stroke-width="2.6" stroke-linecap="round"/></svg>';

const RING_R = 62;
const RING_C = 2 * Math.PI * RING_R;

/** Anello di progresso calorie + numero di kcal rimanenti al centro. */
export function ringHTML(consumed, target) {
  const t = Math.max(1, num(target));
  const pct = clamp(consumed / t, 0, 1);
  const offset = RING_C * (1 - pct);
  const left = Math.round(t - consumed);
  const over = left < 0;
  return `
    <div class="ring">
      <div class="ring__wrap">
        <svg class="ring__svg" viewBox="0 0 148 148" aria-hidden="true">
          <circle class="ring__track" cx="74" cy="74" r="${RING_R}"></circle>
          <circle class="ring__bar" cx="74" cy="74" r="${RING_R}"
                  stroke="${over ? 'var(--danger)' : 'var(--kcal)'}"
                  stroke-dasharray="${RING_C.toFixed(1)}"
                  stroke-dashoffset="${offset.toFixed(1)}"></circle>
        </svg>
        <div class="ring__center">
          <span class="ring__num">${fmt(Math.abs(left))}</span>
          <span class="ring__cap">${over ? 'kcal oltre' : 'kcal rimaste'}</span>
        </div>
      </div>
      <div>
        <p class="stat__label">Calorie</p>
        <p class="stat__value">${fmt(consumed)}<span class="stat__unit">/ ${fmt(t)} kcal</span></p>
        <p class="stat__hint">${Math.round(pct * 100)}% del fabbisogno giornaliero</p>
      </div>
    </div>`;
}

const MACRO_META = [
  { key: 'protein', name: 'Proteine', cls: 'protein' },
  { key: 'carbs', name: 'Carboidrati', cls: 'carbs' },
  { key: 'fat', name: 'Grassi', cls: 'fat' }
];

/** Tre barre proteine/carboidrati/grassi con valore su target. */
export function macroBarsHTML(totals, targets) {
  return `<div class="macros">${MACRO_META.map(({ key, name, cls }) => {
    const value = num(totals[key]);
    const target = Math.max(1, num(targets[key]));
    const pct = clamp((value / target) * 100, 0, 100);
    const over = value > target * 1.05;
    return `
      <div>
        <div class="macro__top">
          <span class="macro__name">${name}</span>
          <span class="macro__val">${fmt(value)} / ${fmt(target)} g</span>
        </div>
        <div class="bar">
          <div class="bar__fill bar__fill--${over ? 'over' : cls}" style="width:${pct}%"></div>
        </div>
      </div>`;
  }).join('')}</div>`;
}

/** `tone`: kcal | protein | carbs | fat | ok — colora bordo e valore. */
export function statHTML({ label, value, unit = '', hint = '', hintClass = '', tone = '' }) {
  return `
    <div class="stat${tone ? ` stat--${tone}` : ''}">
      <span class="stat__label">${esc(label)}</span>
      <span class="stat__value">${value}${unit ? `<span class="stat__unit">${esc(unit)}</span>` : ''}</span>
      ${hint ? `<span class="stat__hint ${hintClass}">${hint}</span>` : ''}
    </div>`;
}

export function alertHTML({ kind = 'warn', icon = '⚠️', title, text }) {
  return `
    <div class="alert alert--${kind}">
      <span aria-hidden="true">${icon}</span>
      <span><strong>${esc(title)}</strong><span>${esc(text)}</span></span>
    </div>`;
}

// ---------- Sheet modale ----------

let activeSheet = null;

/**
 * Su iOS la comparsa della tastiera NON riduce l'altezza della finestra: una
 * modale alta 100dvh resterebbe per metà nascosta dietro la tastiera, ed è
 * proprio la parte con l'elenco dei risultati. `visualViewport` dà l'altezza
 * realmente visibile, e la si riporta al pannello.
 * Ritorna la funzione per smettere di ascoltare.
 */
function adattaAllaTastiera(wrap) {
  const vv = window.visualViewport;
  if (!vv) return () => {};
  const applica = () => {
    wrap.style.setProperty('--vv-h', `${Math.round(vv.height)}px`);
    // Con la tastiera aperta iOS sposta anche l'origine del viewport visibile.
    wrap.style.setProperty('--vv-top', `${Math.round(vv.offsetTop)}px`);
  };
  applica();
  vv.addEventListener('resize', applica);
  vv.addEventListener('scroll', applica);
  return () => {
    vv.removeEventListener('resize', applica);
    vv.removeEventListener('scroll', applica);
  };
}

/**
 * Apre un pannello modale. `onMount(panel, close)` riceve il nodo per attaccare
 * gli handler. `size`: 'sm' | 'md' (default) | 'lg'.
 * Ritorna la funzione di chiusura.
 */
export function openSheet({ html, onMount, onClose, size = 'md' }) {
  closeSheet();
  const root = document.getElementById('modal-root');
  const wrap = document.createElement('div');
  wrap.className = 'sheet';
  wrap.innerHTML = `<div class="sheet__panel sheet__panel--${size}" role="dialog" aria-modal="true"></div>`;
  const panel = wrap.firstElementChild;
  panel.innerHTML = html;
  root.appendChild(wrap);

  const smettiAdattare = size === 'lg' ? adattaAllaTastiera(wrap) : () => {};
  wrap.cleanup = smettiAdattare;

  const close = () => {
    if (activeSheet !== wrap) return;
    smettiAdattare();
    wrap.remove();
    document.removeEventListener('keydown', onKey);
    activeSheet = null;
    onClose?.();
  };
  const onKey = (e) => {
    if (e.key === 'Escape') close();
  };

  wrap.addEventListener('click', (e) => {
    if (e.target === wrap || e.target.closest('[data-close]')) close();
  });
  document.addEventListener('keydown', onKey);
  activeSheet = wrap;

  onMount?.(panel, close);
  panel.querySelector('input, select, textarea, button')?.focus({ preventScroll: true });
  return close;
}

export function closeSheet() {
  // Anche la chiusura "dall'esterno" deve smettere di ascoltare il viewport.
  activeSheet?.cleanup?.();
  activeSheet?.remove();
  activeSheet = null;
}

/** Conferma bloccante per le azioni distruttive. */
export function confirmSheet({ title, text, confirmLabel = 'Elimina' }) {
  return new Promise((resolve) => {
    let answered = false;
    const done = (value) => {
      answered = true;
      resolve(value);
    };
    const close = openSheet({
      size: 'sm',
      html: `
        <h2>${esc(title)}</h2>
        <p>${esc(text)}</p>
        <button class="btn btn--danger" data-yes type="button">${esc(confirmLabel)}</button>
        <button class="btn btn--ghost" data-close type="button">Annulla</button>`,
      onMount: (panel, closeFn) => {
        panel.querySelector('[data-yes]').addEventListener('click', () => {
          done(true);
          closeFn();
        });
      },
      onClose: () => {
        if (!answered) resolve(false);
      }
    });
    void close;
  });
}
