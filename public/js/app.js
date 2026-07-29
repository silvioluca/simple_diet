import { watchAuth, login } from './auth.js';
import { state, setUser, refreshState } from './store.js';
import { registerRoute, startRouter, render } from './router.js';
import { renderDashboard } from './views/dashboard.js';
import { renderMeals } from './views/meals.js';
import { renderDiet } from './views/diet.js';
import { renderMeasures } from './views/measures.js';
import { renderProfile } from './views/profile.js';
import { renderRecipes } from './views/recipes.js';
import { $, toISODate, addDays, formatDateLong, toast } from './utils.js';

// ---------- Rotte ----------

registerRoute('dashboard', {
  title: 'Dashboard',
  usesDate: true,
  render: renderDashboard
});
registerRoute('pasti', {
  title: 'Pasti',
  usesDate: true,
  render: renderMeals
});
registerRoute('ricette', {
  title: 'Ricette',
  subtitle: 'Combinazioni di ingredienti riutilizzabili',
  usesDate: false,
  render: renderRecipes
});
registerRoute('dieta', {
  title: 'Dieta',
  subtitle: 'Fabbisogno, obiettivi e piano settimanale',
  usesDate: false,
  render: renderDiet
});
registerRoute('misure', {
  title: 'Misure corporee',
  usesDate: true,
  render: renderMeasures
});
registerRoute('profilo', {
  title: 'Profilo',
  subtitle: 'Dati personali e account',
  usesDate: false,
  render: renderProfile
});

// ---------- Selettore data ----------

const dateInput = $('#date-input');

function setDate(iso) {
  state.selectedDate = iso;
  dateInput.value = iso;
  localStorage.setItem('sd:date', iso);
  render();
}

function initDateNav() {
  // La data non persiste tra i giorni: se l'ultima sessione era ieri, si riparte da oggi.
  const stored = localStorage.getItem('sd:date');
  state.selectedDate = stored && stored >= toISODate() ? stored : toISODate();
  dateInput.value = state.selectedDate;
  dateInput.max = addDays(toISODate(), 1);

  dateInput.addEventListener('change', () => {
    if (dateInput.value) setDate(dateInput.value);
  });

  $('#datenav').addEventListener('click', (e) => {
    const step = e.target.closest('[data-date-step]');
    if (step) setDate(addDays(state.selectedDate, Number(step.dataset.dateStep)));
  });

  $('#today-btn').addEventListener('click', () => setDate(toISODate()));

  // Swipe orizzontale per cambiare giorno (comodo su iPad).
  let startX = 0;
  let startY = 0;
  const main = $('#view');
  main.addEventListener(
    'touchstart',
    (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    },
    { passive: true }
  );
  main.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if (Math.abs(dx) > 90 && Math.abs(dy) < 50 && !$('#datenav').hidden) {
        setDate(addDays(state.selectedDate, dx < 0 ? 1 : -1));
      }
    },
    { passive: true }
  );
}

// ---------- Sottotitolo con la data corrente ----------

function syncSubtitle() {
  const sub = $('#view-sub');
  if (!$('#datenav').hidden) sub.textContent = formatDateLong(state.selectedDate);
}
new MutationObserver(syncSubtitle).observe($('#view'), { childList: true });

// ---------- Avvio ----------

let booted = false;

watchAuth(async (user, reason) => {
  const gate = $('#gate');
  const app = $('#app');
  const msg = $('#gate-msg');
  $('#boot').hidden = true;

  if (!user) {
    app.hidden = true;
    gate.hidden = false;
    msg.textContent =
      reason === 'not-allowed'
        ? 'Questo account Google non è autorizzato ad accedere all’app.'
        : '';
    return;
  }

  setUser(user.uid);
  state.user = user;
  gate.hidden = true;
  app.hidden = false;
  // Nel pulsante Profilo mostro solo il nome proprio: la topbar è stretta.
  $('#profile-name').textContent = (user.displayName || 'Profilo').split(' ')[0];
  const img = $('#avatar-img');
  if (user.photoURL) img.src = user.photoURL;
  else img.replaceWith(Object.assign(document.createElement('span'), { textContent: '👤' }));

  try {
    await refreshState();
  } catch (err) {
    toast(`Impossibile leggere i dati: ${err.message}`, 'error');
  }

  if (!booted) {
    booted = true;
    initDateNav();
    await startRouter();
  } else {
    await render();
  }
  syncSubtitle();
});

$('#login-btn').addEventListener('click', async () => {
  const msg = $('#gate-msg');
  msg.textContent = '';
  try {
    await login();
  } catch (err) {
    msg.textContent = `Accesso non riuscito: ${err.message}`;
  }
});

// ---------- Immagini non raggiungibili ----------

// Una foto che non carica lascerebbe il glifo di immagine spezzata sopra la
// copertina generata. La si toglie e resta il gradiente con l'emoji.
// L'evento `error` non fa bubbling: serve la fase di cattura.
document.addEventListener(
  'error',
  (e) => {
    const img = e.target;
    if (img instanceof HTMLImageElement && img.classList.contains('cover__img')) img.remove();
  },
  true
);

// ---------- Service worker ----------

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Relativo alla pagina: funziona anche servito da una sottocartella.
    navigator.serviceWorker.register(new URL('../sw.js', import.meta.url)).catch(() => {});
  });
}
