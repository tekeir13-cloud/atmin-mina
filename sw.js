// ═══════════ MUKICLOUD — Service Worker (modo offline) ═══════════
// Estrategia: la app es un solo index.html.
//  · Navegaciones: red primero (para recibir versiones nuevas al instante) y,
//    si no hay señal, se sirve la última copia buena desde caché → la app abre en interior mina.
//  · Supabase y demás peticiones de datos: solo red (la app ya maneja sus fallos y su cola offline).
// Al desplegar una versión nueva basta con cambiar CACHE_V: el SW viejo se limpia solo.
const CACHE_V = 'mukicloud-v2026.08.24-96';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_V)
      .then(c => c.addAll(['./', './index.html']).catch(() => {}))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
      // Avisar a todas las pestañas que hay versión nueva activa → la página se recarga sola.
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(cls => cls.forEach(c => { try { c.postMessage({ type: 'sw-updated', v: CACHE_V }); } catch (e) {} }))
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Chart.js viene de un CDN y es el ÚNICO recurso de fuera que se guarda. Sin él la app se queda
  // sin gráficos justo donde peor cae: en interior mina, sin señal. Caché primero, red de respaldo.
  // (Los datos de la operación nunca se cachean: eso sigue igual, en la línea de abajo.)
  if (url.href.indexOf('cdn.jsdelivr.net/npm/chart.js') >= 0) {
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) {
          const copia = res.clone();
          caches.open(CACHE_V).then(c => c.put(req, copia)).catch(() => {});
        }
        return res;
      }).catch(() => caches.match(req)))
    );
    return;
  }

  // Datos (Supabase u otros orígenes): solo red — nunca cachear datos de la operación.
  if (url.origin !== self.location.origin) return;

  // La consulta pública del trabajador (/tareo) va siempre a la red: no se cachea ni se
  // reemplaza por la app, que es otra cosa.
  if (url.pathname === '/tareo' || url.pathname.endsWith('/tareo.html') || url.pathname.startsWith('/api/')) return;

  // App shell (index.html y navegaciones): red primero, caché de respaldo.
  if (req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html')) {
    e.respondWith(
      fetch(req)
        .then(res => {
          if (res && res.ok) {
            const copia = res.clone();
            caches.open(CACHE_V).then(c => c.put(req, copia)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Otros recursos propios (manifest, íconos): caché primero, red de respaldo.
  e.respondWith(
    caches.match(req).then(r => r || fetch(req).then(res => {
      if (res && res.ok) {
        const copia = res.clone();
        caches.open(CACHE_V).then(c => c.put(req, copia)).catch(() => {});
      }
      return res;
    }))
  );
});
