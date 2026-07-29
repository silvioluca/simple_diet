// Service worker minimale: la cache serve SOLO da rete di scorta offline.
//
// Strategia: network-first su tutto ciò che è di origine locale.
// Cache-first sarebbe più veloce ma dopo un aggiornamento servirebbe un
// index.html nuovo insieme a moduli JS vecchi: la pagina si rompe perché
// il codice cerca elementi che non esistono più. Meglio qualche ms in più.
//
// I dati Firestore hanno già la loro persistenza offline nell'SDK.
const VERSION = 'v6';
const SHELL = `simple-diet-shell-${VERSION}`;

const SHELL_FILES = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/css/style.css',
  '/js/app.js',
  '/js/auth.js',
  '/js/charts.js',
  '/js/config.js',
  '/js/firebase-init.js',
  '/js/foodsearch.js',
  '/js/ideas.js',
  '/js/planimport.js',
  '/js/data/foods-base.js',
  '/js/data/recipe-ideas.js',
  '/js/off.js',
  '/js/router.js',
  '/js/store.js',
  '/js/ui.js',
  '/js/utils.js',
  '/js/views/dashboard.js',
  '/js/views/meals.js',
  '/js/views/diet.js',
  '/js/views/measures.js',
  '/js/views/profile.js',
  '/js/views/recipes.js',
  '/icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL)
      .then((cache) => cache.addAll(SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== SHELL).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Firebase, Google e Open Food Facts devono sempre passare dalla rete.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((res) => {
        // Copia in cache solo le risposte valide, per l'uso offline.
        if (res.ok && res.type === 'basic') {
          const copy = res.clone();
          caches.open(SHELL).then((c) => c.put(request, copy));
        }
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(request, { ignoreSearch: true });
        if (cached) return cached;
        // Offline su una navigazione: serve comunque la shell.
        if (request.mode === 'navigate') return caches.match('/index.html');
        return Response.error();
      })
  );
});
