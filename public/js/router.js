import { destroyAllCharts } from './charts.js';
import { closeSheet } from './ui.js';
import { $, $$ } from './utils.js';

const routes = new Map();
let current = null;
let running = 0;

export function registerRoute(name, def) {
  routes.set(name, def);
}

export function currentRoute() {
  return current;
}

function routeFromHash() {
  const name = (location.hash.replace(/^#\/?/, '').split('?')[0] || 'dashboard').toLowerCase();
  return routes.has(name) ? name : 'dashboard';
}

export function navigate(name) {
  if (location.hash === `#/${name}`) return render();
  location.hash = `#/${name}`;
}

export async function render() {
  const name = routeFromHash();
  const def = routes.get(name);
  if (!def) return;

  const token = ++running;
  current = name;
  closeSheet();
  destroyAllCharts();

  // Vale sia per la nav principale sia per il pulsante Profilo nella topbar.
  $$('[data-route]').forEach((a) =>
    a.setAttribute('aria-current', a.dataset.route === name ? 'page' : 'false')
  );
  $('#view-title').textContent = def.title;
  $('#view-sub').textContent = def.subtitle || '';
  $('#datenav').hidden = !def.usesDate;

  const view = $('#view');
  view.innerHTML = '<p class="loading">Caricamento…</p>';
  window.scrollTo({ top: 0 });

  try {
    await def.render(view);
  } catch (err) {
    if (token !== running) return; // una navigazione più recente ha già preso il controllo
    console.error(err);
    view.innerHTML = `<div class="card"><h2>Errore</h2><p>${err.message}</p></div>`;
  }
}

export function startRouter() {
  window.addEventListener('hashchange', render);
  if (!location.hash) location.hash = '#/dashboard';
  return render();
}
