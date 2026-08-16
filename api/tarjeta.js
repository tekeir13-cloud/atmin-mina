// ═══════════════════════════════════════════════════════════════════════════════
// MUKICLOUD · Consulta pública de la tarjeta de tareo  (POST /api/tarjeta)
//
// El trabajador entra a /tareo, escribe su DNI y su fecha de nacimiento (o la de
// ingreso, mientras RRHH no complete su ficha) y ve SU tarjeta del mes en curso.
//
// El filtro se hace AQUÍ, en el servidor, y la respuesta lleva únicamente los datos
// de esa persona. Si el filtro se hiciera en el navegador, cualquiera podría abrir
// la consola y leer la planilla entera con los jornales de los 63 trabajadores.
//
// Solo se devuelve el MES EN CURSO: la consulta pública no es un archivo histórico.
// ═══════════════════════════════════════════════════════════════════════════════

const SB_URL = process.env.SUPABASE_URL || 'https://ueiermflrxiapeednrov.supabase.co';
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlaWVybWZscnhpYXBlZWRucm92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MTM4NDYsImV4cCI6MjA5NTQ4OTg0Nn0.75qDiRT0azEfjR0Boqah4rWy2GFumLfhJayKU6S_6e8';

// Los mismos marcadores del tareo de la app: qué significan y cuánto pagan.
const MARCAS = {
  DL:  { l: 'Día libre',              paga: 0, c: '#2563eb' },
  F:   { l: 'Falta',                  paga: 0, c: '#6b7280' },
  DM:  { l: 'Descanso médico',        paga: 1, c: '#06b6d4' },
  P:   { l: 'Permiso con goce',       paga: 1, c: '#4f46e5' },
  PSG: { l: 'Permiso sin goce',       paga: 0, c: '#78716c' },
  T:   { l: 'Tardanza',               paga: 1, c: '#ea580c' },
  S:   { l: 'Suspensión',             paga: 0, c: '#7f1d1d' },
  V:   { l: 'Vacaciones',             paga: 1, c: '#14b8a6' },
};
const COL_TAREA = { '1':'#16a34a','1.25':'#84cc16','1.5':'#d97706','1.75':'#f59e0b','2':'#dc2626',
                    '2.25':'#e11d48','2.5':'#ec4899','2.75':'#c026d3','3':'#8b5cf6' };

async function modulo(nombre) {
  const url = SB_URL + '/rest/v1/app_modulos?select=data&modulo=eq.' + encodeURIComponent(nombre) + '&limit=1';
  const r = await fetch(url, { headers: { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY } });
  if (!r.ok) return null;
  const j = await r.json();
  return (Array.isArray(j) && j.length) ? j[0].data : null;
}

const soloDigitos = (s) => String(s == null ? '' : s).replace(/\D/g, '');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'metodo' });

  try {
    const cuerpo = (typeof req.body === 'string') ? JSON.parse(req.body || '{}') : (req.body || {});
    const dni = soloDigitos(cuerpo.dni);
    const fecha = String(cuerpo.fecha || '').slice(0, 10);
    if (dni.length < 8) return res.status(200).json({ error: 'dni', msg: 'Escribe tu DNI completo (8 dígitos).' });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return res.status(200).json({ error: 'fecha', msg: 'Falta tu fecha de nacimiento.' });

    const personal = await modulo('personal');
    if (!Array.isArray(personal)) return res.status(200).json({ error: 'nube', msg: 'No se pudo consultar en este momento. Intenta de nuevo.' });

    const p = personal.find(x => soloDigitos(x && x.dni) === dni && (x.estado !== 'baja'));
    // El mismo mensaje para DNI inexistente y fecha equivocada: si fueran distintos,
    // se podría averiguar qué DNI está en planilla probando uno por uno.
    const noCoincide = { error: 'datos', msg: 'Los datos no coinciden. Verifica tu DNI y tu fecha; si tu ficha aún no está completa, usa tu fecha de ingreso.' };
    if (!p) return res.status(200).json(noCoincide);

    const f = p.ficha || {};
    const validas = [f.fechaNac, p.ingreso, f.fechaIngreso].filter(Boolean).map(x => String(x).slice(0, 10));
    if (!validas.includes(fecha)) return res.status(200).json(noCoincide);

    // ── Mes en curso, hora de Perú ──
    const ahora = new Date(Date.now() - 5 * 3600 * 1000);
    const mes = ahora.toISOString().slice(0, 7);

    const tareas = (await modulo('tareas')) || [];
    const mias = tareas.filter(t => t && String(t.trabajadorId) === String(p.id) && String(t.fecha || '').slice(0, 7) === mes);

    const jornal = Number(p.jornal) || 0;
    const trabajo = mias.filter(t => t.tipo !== 'libre' && t.tipo !== 'falta' && t.tipo !== 'ausencia');
    const ausencias = mias.filter(t => t.tipo === 'ausencia');
    const diasTrab = new Set(trabajo.map(t => t.fecha)).size;
    const tareasNum = trabajo.reduce((s, t) => s + (Number(t.mult) || 1), 0)
                    + ausencias.reduce((s, t) => s + (Number(t.mult) || 0), 0);
    const dlTomados = mias.filter(t => t.tipo === 'libre').length;
    const faltas = mias.filter(t => t.tipo === 'falta').length;
    const comprados = Math.max(0, diasTrab / 2 - dlTomados);
    const pago = (tareasNum + dlTomados + comprados) * jornal;

    const marcaDe = (t) => {
      if (t.tipo === 'libre') return 'DL';
      if (t.tipo === 'falta') return 'F';
      if (t.tipo === 'ausencia') return t.codigo || 'F';
      const m = String(Number(t.mult || 1));
      return (m in COL_TAREA) ? m : '1';
    };
    const dias = mias
      .slice()
      .sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)))
      .map(t => {
        const v = marcaDe(t);
        const M = MARCAS[v];
        const mult = M ? M.paga : (Number(v) || 0);
        return { dia: String(t.fecha).slice(8, 10), marca: v, concepto: M ? M.l : 'Tareo',
                 color: M ? M.c : (COL_TAREA[v] || '#16a34a'), tareas: mult, monto: mult * jornal };
      });

    const adel = (await modulo('adelantos')) || {};
    const suyos = (adel.data || adel)[p.id] || {};
    const prestamo = Number(suyos[mes]) || 0;
    const descuento = Number(suyos[mes + '_desc']) || 0;

    const notas = (await modulo('tarjeta_notas')) || {};
    const nota = ((notas[p.id] || {})[mes]) || {};

    const bandera = prestamo > 0 ? { color: '#ef4444', txt: 'Con préstamo', icono: '🔴' }
      : (descuento > 0 || String(nota.descTexto || '').trim())
        ? { color: '#f59e0b', txt: 'Descuento pendiente', icono: '🟠' }
        : { color: '#22c55e', txt: 'Sin pendientes', icono: '🟢' };

    return res.status(200).json({
      ok: true, mes,
      trabajador: { nombre: p.nombre || '', dni: p.dni || '', cargo: p.rol || '',
                    guardia: p.guardia || '', jornal, foto: p.foto || '' },
      resumen: { diasTrab, tareas: Math.round(tareasNum * 100) / 100, dlTomados, faltas, pago,
                 neto: pago - prestamo - descuento },
      dias,
      pendientes: { prestamo, descuento, detalle: nota.descTexto || '', anotacion: nota.texto || '' },
      bandera,
    });
  } catch (e) {
    return res.status(200).json({ error: 'interno', msg: 'No se pudo consultar en este momento.' });
  }
};
