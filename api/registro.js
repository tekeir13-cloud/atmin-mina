// ═══════════════════════════════════════════════════════════════════════════════
// MUKICLOUD · Alta de personal desde el celular  (POST /api/registro)
//
// Quien registra entra a /registro con la clave de Administración y llena la ficha del
// trabajador nuevo, con su foto. Al guardar, la persona queda creada en el sistema y
// Administración termina de completarla desde RRHH › Personal.
//
// La escritura se hace AQUÍ, en el servidor: la página nunca recibe la planilla ni la clave
// viaja a ningún otro sitio. Y se hace leyendo-modificando-escribiendo el módulo `personal`,
// que es como la app guarda su gente.
// ═══════════════════════════════════════════════════════════════════════════════

const SB_URL = process.env.SUPABASE_URL || 'https://ueiermflrxiapeednrov.supabase.co';
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlaWVybWZscnhpYXBlZWRucm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MTM4NDYsImV4cCI6MjA5NTQ4OTg0Nn0.75qDiRT0azEfjR0Boqah4rWy2GFumLfhJayKU6S_6e8';

// La clave de Administración. Se puede cambiar sin tocar el código poniendo REGISTRO_PASSWORD
// en las variables de entorno de Vercel; si no está, vale la del usuario de Administración.
const CLAVE = process.env.REGISTRO_PASSWORD || 'admin2024';

const https = require('https');
function pedir(metodo, url, headers, cuerpo) {
  return new Promise((resolve) => {
    try {
      const datos = cuerpo == null ? null : Buffer.from(JSON.stringify(cuerpo), 'utf8');
      const h = Object.assign({}, headers);
      if (datos) { h['Content-Type'] = 'application/json'; h['Content-Length'] = datos.length; }
      const req = https.request(url, { method: metodo, headers: h, timeout: 20000 }, (r) => {
        let txt = '';
        r.setEncoding('utf8');
        r.on('data', (c) => { txt += c; });
        r.on('end', () => {
          if (r.statusCode < 200 || r.statusCode >= 300) {
            return resolve({ ok: false, estado: r.statusCode, detalle: txt.slice(0, 300) });
          }
          try { resolve({ ok: true, json: txt ? JSON.parse(txt) : null }); }
          catch (e) { resolve({ ok: true, json: null }); }
        });
      });
      req.on('timeout', () => { req.destroy(); resolve({ ok: false, estado: 0, detalle: 'tiempo agotado' }); });
      req.on('error', (e) => resolve({ ok: false, estado: 0, detalle: String(e && e.message || e).slice(0, 200) }));
      if (datos) req.write(datos);
      req.end();
    } catch (e) {
      resolve({ ok: false, estado: 0, detalle: String(e && e.message || e).slice(0, 200) });
    }
  });
}

const CAB = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, Accept: 'application/json' };

async function leerModulo(nombre) {
  const url = SB_URL + '/rest/v1/app_modulos?select=data&modulo=eq.' + encodeURIComponent(nombre) + '&limit=1';
  const r = await pedir('GET', url, CAB);
  if (!r.ok) return null;
  const j = r.json;
  return (Array.isArray(j) && j.length) ? j[0].data : null;
}
// Alta o reemplazo del snapshot del módulo (upsert por clave primaria `modulo`).
async function escribirModulo(nombre, data) {
  const url = SB_URL + '/rest/v1/app_modulos?on_conflict=modulo';
  const r = await pedir('POST', url,
    Object.assign({}, CAB, { Prefer: 'resolution=merge-duplicates,return=minimal' }),
    [{ modulo: nombre, data, updated_at: new Date().toISOString() }]);
  return r.ok;
}

const soloDigitos = (s) => String(s == null ? '' : s).replace(/\D/g, '');
const limpio = (s, max) => String(s == null ? '' : s).trim().slice(0, max || 160);

// Cargos que ya se usan en la planilla, para que el desplegable del celular ofrezca los mismos
// y no se inventen variantes ("COMPRESORISTA" y "Compresorista" conviviendo).
function cargosDe(personal) {
  const vistos = new Map();
  (personal || []).forEach((p) => {
    const t = limpio(p && p.rol, 60);
    if (!t) return;
    const k = t.toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (!vistos.has(k)) vistos.set(k, t);
  });
  return [...vistos.values()].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}

// Los frentes activos de la operación. Se mantienen aquí porque la página pública no carga la
// app; si mañana se abre un frente nuevo, se agrega en esta lista.
const FRENTES = [
  { id: 1, nombre: 'RA Brenda' }, { id: 2, nombre: 'CRNE' },
  { id: 'ESCM4365', nombre: 'ESCM 4365' }, { id: 'ESCM4410', nombre: 'ESCM 4410' },
  { id: 'ESCM4435', nombre: 'ESCM 4435' }, { id: 'SN5100NW', nombre: 'SN 5100 NW' },
  { id: 'GLNW3', nombre: 'GLNW 3' }, { id: 'GLSE3', nombre: 'GLSE 3' },
  { id: 'TJ5100', nombre: 'TJ 5100' },
];

// Campos de la ficha que son obligatorios en el formato oficial: se cuentan para avisar
// cuántos quedaron pendientes, nunca para impedir el registro.
const FICHA_REQ = ['apPaterno', 'apMaterno', 'nombres', 'fechaNac', 'dni', 'estadoCivil',
  'viaNombre', 'domDistrito', 'celular', 'fechaIngreso', 'cargoActual', 'sistema'];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo' });

  try {
    const cuerpo = (typeof req.body === 'string') ? JSON.parse(req.body || '{}') : (req.body || {});
    if (String(cuerpo.clave || '') !== CLAVE) {
      return res.status(200).json({ error: 'clave', msg: 'La clave no es correcta.' });
    }

    const personal = await leerModulo('personal');
    if (!Array.isArray(personal)) {
      return res.status(200).json({ error: 'nube', msg: 'No se pudo consultar la planilla en este momento. Intenta de nuevo.' });
    }

    // ── Solo comprobar la clave: devuelve lo que el formulario necesita para armarse ──
    if (cuerpo.accion === 'verificar') {
      return res.status(200).json({ ok: true, cargos: cargosDe(personal), frentes: FRENTES });
    }

    // ── Crear al trabajador ──
    const t = cuerpo.trabajador || {};
    const nombre = limpio(t.nombre, 120).toUpperCase();
    if (!nombre) return res.status(200).json({ error: 'nombre', msg: 'Falta el nombre del trabajador.' });

    const dni = soloDigitos(t.dni).slice(0, 8);
    // Un DNI repetido casi siempre es la misma persona registrada dos veces: se avisa en vez de
    // duplicarla, porque después los tareos se reparten entre las dos fichas y no cuadra nada.
    if (dni) {
      const ya = personal.find((p) => p && soloDigitos(p.dni) === dni);
      if (ya) return res.status(200).json({ error: 'duplicado',
        msg: 'Ese DNI ya está registrado a nombre de ' + (ya.nombre || '—') + '. Si es otra persona, revisa el número.' });
    }

    const ficha = (t.ficha && typeof t.ficha === 'object') ? t.ficha : {};
    // Lo que se escribió arriba manda sobre la ficha: es lo que vio quien registró.
    if (dni && !ficha.dni) ficha.dni = dni;
    if (t.fechaIngreso && !ficha.fechaIngreso) ficha.fechaIngreso = limpio(t.fechaIngreso, 10);
    if (t.rol && !ficha.cargoActual) ficha.cargoActual = limpio(t.rol, 60);

    const id = 'P' + Date.now() + Math.random().toString(36).slice(2, 7);
    const nuevo = {
      id, _ts: Date.now(),
      nombre, dni,
      rol: limpio(t.rol, 60) || 'AYUDANTE DE MINA',
      jornal: Number(t.jornal) || 0,
      frente: t.frente || '',
      guardia: limpio(t.guardia, 20),
      unidad: (t.unidad === 'MB') ? 'MB' : 'NV2820',
      estado: 'activo',
      fechaIngreso: limpio(t.fechaIngreso, 10),
      ficha,
      // De dónde salió el registro: sirve para que Administración sepa qué fichas vienen de
      // campo y conviene revisar.
      altaDesde: 'registro-movil',
    };

    personal.push(nuevo);
    const okP = await escribirModulo('personal', personal);
    if (!okP) return res.status(200).json({ error: 'guardar', msg: 'No se pudo guardar en la nube. Intenta de nuevo.' });

    // La foto va a su propio módulo, igual que en la app: dentro de `personal` haría que cada
    // equipo se la descargue en cada apertura aunque nadie la mire.
    const foto = String(cuerpo.foto || '');
    if (foto.startsWith('data:image/')) {
      try {
        const fotos = (await leerModulo('personal_fotos')) || {};
        fotos[id] = foto;
        await escribirModulo('personal_fotos', fotos);
      } catch (e) { /* la foto es opcional: si falla, el trabajador ya quedó creado */ }
    }

    const pendientes = FICHA_REQ.filter((k) => !ficha[k]).length;
    return res.status(200).json({ ok: true, id, nombre, pendientes });
  } catch (e) {
    return res.status(200).json({ error: 'interno', msg: 'No se pudo completar el registro.' });
  }
};
