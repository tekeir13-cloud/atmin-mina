// ═══════════ MUKICLOUD — Service Worker (modo offline) ═══════════
// Estrategia: la app es un solo index.html.
//  · Navegaciones: red primero (para recibir versiones nuevas al instante) y,
//    si no hay señal, se sirve la última copia buena desde caché → la app abre en interior mina.
//  · Supabase y demás peticiones de datos: solo red (la app ya maneja sus fallos y su cola offline).
// Al desplegar una versión nueva basta con cambiar CACHE_V: el SW viejo se limpia solo.
const CACHE_V = 'mukicloud-v2026.10.29-279';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_V)
      .then(c => c.addAll(['./', './index.html', './vendor/supabase-js-2.118.0.js', './vendor/xlsx-js-style-1.2.0.js']).catch(() => {})
        // El cliente de nube se baja ya, mientras hay señal buena —normalmente al instalar la
        // app en el campamento—, para que no dependa de que el CDN conteste en bocamina.
        .then(() => fetch('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2', { mode: 'no-cors' })
          .then(r => c.put('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2', r)).catch(() => {})))
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

  // Las DOS librerías de fuera que se guardan. Los datos de la operación nunca se cachean: eso
  // sigue igual, en la línea de abajo.
  //
  //  · Chart.js — sin él la app se queda sin gráficos justo donde peor cae: en interior mina.
  //
  //  · supabase-js — ESTA es la que importa. Es el cliente de nube, y venía de internet sin
  //    guardarse: si el celular abre la app con mala señal, el archivo no baja, el cliente nunca
  //    se crea, y la app arranca CIEGA. No descarga los reportes de los demás y los propios se
  //    quedan en la cola. El equipo no avisa de nada raro —abre y funciona— y el hombre ve su
  //    listado parado en el último día que sí alcanzó a sincronizar. Fue justo lo que le pasó a
  //    un jefe de guardia: su teléfono decía "no se pudo leer la nube desde este equipo".
  //    Guardada, basta con que haya bajado UNA vez para que el teléfono vuelva a tener nube
  //    siempre que haya señal, aunque el CDN no responda.
  if (url.href.indexOf('cdn.jsdelivr.net/npm/chart.js') >= 0 ||
      url.href.indexOf('@supabase/supabase-js') >= 0) {
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
  if (url.pathname === '/tareo' || url.pathname.endsWith('/tareo.html') ||
      url.pathname === '/registro' || url.pathname.endsWith('/registro.html') ||
      url.pathname.startsWith('/api/')) return;

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
