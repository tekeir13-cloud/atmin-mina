-- ════════════════════════════════════════════════════════════════
-- MUKICLOUD · Esquema base (Fase 1)
-- Pegar TODO esto en Supabase → SQL Editor → New query → Run
-- Crea las tablas que la app ya usa. No borra nada existente.
-- La seguridad estricta por rol se agrega en la Fase 3.
-- ════════════════════════════════════════════════════════════════

-- ──────────────────────────────────────────────
-- 1) MESES  (periodo activo de operación)
-- ──────────────────────────────────────────────
create table if not exists public.meses (
  id          bigint generated always as identity primary key,
  mes         int  not null,           -- 1..12
  "año"       int  not null,
  activo      boolean default false,
  cerrado_en  timestamptz,
  created_at  timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 2) PERFILES DE USUARIO  (ligado a Supabase Auth)
-- ──────────────────────────────────────────────
create table if not exists public.perfiles_usuario (
  id       uuid primary key references auth.users(id) on delete cascade,
  email    text unique not null,
  nombre   text not null,
  rol      text not null,
  modulos  text[] default '{}'
);

-- ──────────────────────────────────────────────
-- 3) PERSONAL  (planilla / cuadrilla)
-- ──────────────────────────────────────────────
create table if not exists public.personal (
  id          bigint generated always as identity primary key,
  nombre      text not null,
  dni         text,
  rol         text,
  frente      text,
  estado      text default 'activo',
  jornal      numeric default 0,
  ingreso     date,
  "motivoBaja" text,
  "fechaBaja"  date,
  "obsBaja"    text,
  created_at  timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 4) PERFORACIÓN  (avance por frente)
-- ──────────────────────────────────────────────
create table if not exists public.perforacion (
  id        bigint generated always as identity primary key,
  fecha     date not null,
  mes_id    bigint references public.meses(id) on delete set null,
  frente    text,
  metros    numeric default 0,
  personas  int default 0,
  roca      text,
  obs       text
);

-- ──────────────────────────────────────────────
-- 5) EXPLOSIVOS  (historial + stock)
-- ──────────────────────────────────────────────
create table if not exists public.explosivos_historial (
  id        bigint generated always as identity primary key,
  fecha     date not null,
  mes_id    bigint references public.meses(id) on delete set null,
  frente    text,
  tipo      text,
  cantidad  numeric default 0,
  detalle   text,
  precio    numeric default 0
);
create table if not exists public.explosivos_stock (
  tipo        text primary key,
  cantidad    numeric default 0,
  updated_at  timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 6) PETRÓLEO  (historial + stock)
-- ──────────────────────────────────────────────
create table if not exists public.petroleo_historial (
  id        bigint generated always as identity primary key,
  fecha     date not null,
  mes_id    bigint references public.meses(id) on delete set null,
  frente    text,
  equipo    text,
  galones   numeric default 0,
  precio    numeric default 0
);
create table if not exists public.petroleo_stock (
  id          bigint primary key default 1,
  cantidad    numeric default 0,
  updated_at  timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 7) ACEROS  (historial)
-- ──────────────────────────────────────────────
create table if not exists public.aceros_historial (
  id        bigint generated always as identity primary key,
  fecha     date not null,
  mes_id    bigint references public.meses(id) on delete set null,
  frente    text,
  tipo      text,
  cantidad  numeric default 0,
  detalle   text,
  precio    numeric default 0
);

-- ──────────────────────────────────────────────
-- 8) MANTENIMIENTO
-- ──────────────────────────────────────────────
create table if not exists public.mantenimiento (
  id           bigint generated always as identity primary key,
  fecha        date not null,
  mes_id       bigint references public.meses(id) on delete set null,
  equipo       text,
  tipo         text,
  responsable  text,
  costo        numeric default 0,
  descripcion  text,
  estado       text
);

-- ──────────────────────────────────────────────
-- 9) HORÓMETROS
-- ──────────────────────────────────────────────
create table if not exists public.horometros (
  id          bigint generated always as identity primary key,
  fecha       date not null,
  equipo      text,
  lectura     numeric default 0,
  horas_hoy   numeric default 0,
  obs         text
);

-- ──────────────────────────────────────────────
-- 10) TAREAS  (tareo diario)
-- ──────────────────────────────────────────────
create table if not exists public.tareas (
  id             bigint generated always as identity primary key,
  fecha          date not null,
  mes_id         bigint references public.meses(id) on delete set null,
  trabajador_id  bigint references public.personal(id) on delete set null,
  tarea          text,
  frente         text,
  detalle        text,
  estado_tarea   text,
  mult           numeric default 1,
  jornal         numeric default 0,
  turno          text,
  obs            text
);

-- ──────────────────────────────────────────────
-- 11) ÓRDENES DE COMPRA
-- ──────────────────────────────────────────────
create table if not exists public.ordenes_compra (
  id           bigint generated always as identity primary key,
  fecha        date not null,
  mes_id       bigint references public.meses(id) on delete set null,
  categoria    text,
  proveedor    text,
  descripcion  text,
  monto        numeric default 0,
  solicitante  text,
  estado       text default 'pendiente'
);

-- ──────────────────────────────────────────────
-- 12) VALORIZACIONES
-- ──────────────────────────────────────────────
create table if not exists public.valorizaciones (
  id              bigint generated always as identity primary key,
  fecha           date not null,
  mes_id          bigint references public.meses(id) on delete set null,
  tipo            text,
  concepto        text,
  metros          numeric default 0,
  precio_metro    numeric default 0,
  monto_adicional numeric default 0,
  monto           numeric default 0
);

-- ──────────────────────────────────────────────
-- 13) EPP  (entrega de equipo de protección)
-- ──────────────────────────────────────────────
create table if not exists public.epp_historial (
  id          bigint generated always as identity primary key,
  fecha       date not null,
  mes_id      bigint references public.meses(id) on delete set null,
  tipo        text,
  trabajador  text,
  cantidad    numeric default 0,
  precio      numeric default 0,
  motivo      text
);

-- ──────────────────────────────────────────────
-- 14) CIERRES MENSUALES
-- ──────────────────────────────────────────────
create table if not exists public.cierres_mensuales (
  id               bigint generated always as identity primary key,
  mes_id           bigint references public.meses(id) on delete set null,
  mes              int,
  "año"            int,
  metros_total     numeric default 0,
  costo_total      numeric default 0,
  ingreso_total    numeric default 0,
  utilidad         numeric default 0,
  personal_activo  int default 0,
  dias_operados    int default 0,
  snapshot_json    jsonb,
  cerrado_por      text,
  created_at       timestamptz default now()
);

-- ──────────────────────────────────────────────
-- 15) REPORTES DE SEGURIDAD
-- ──────────────────────────────────────────────
create table if not exists public.reportes_seguridad (
  id              bigint generated always as identity primary key,
  fecha           date not null,
  hora            text,
  mes_id          bigint references public.meses(id) on delete set null,
  frente          text,
  turno           text,
  taladros        int default 0,
  cargados        int default 0,
  disparados      int default 0,
  obs             text,
  foto_url        text,
  foto_base64     text,
  registrado_por  text,
  created_at      timestamptz default now()
);

-- ════════════════════════════════════════════════════════════════
-- ÍNDICES (consultas por mes más rápidas)
-- ════════════════════════════════════════════════════════════════
create index if not exists idx_perforacion_mes  on public.perforacion(mes_id);
create index if not exists idx_exphist_mes       on public.explosivos_historial(mes_id);
create index if not exists idx_pethist_mes       on public.petroleo_historial(mes_id);
create index if not exists idx_acehist_mes       on public.aceros_historial(mes_id);
create index if not exists idx_mant_mes          on public.mantenimiento(mes_id);
create index if not exists idx_tareas_mes        on public.tareas(mes_id);
create index if not exists idx_oc_mes            on public.ordenes_compra(mes_id);
create index if not exists idx_val_mes           on public.valorizaciones(mes_id);
create index if not exists idx_epp_mes           on public.epp_historial(mes_id);
create index if not exists idx_segur_mes         on public.reportes_seguridad(mes_id);

-- ════════════════════════════════════════════════════════════════
-- SEMILLA: un mes activo para arrancar (ajusta mes/año si quieres)
-- ════════════════════════════════════════════════════════════════
insert into public.meses (mes, "año", activo)
select 6, 2026, true
where not exists (select 1 from public.meses where activo = true);

-- ════════════════════════════════════════════════════════════════
-- RLS TEMPORAL (Fase 1): permite que la app funcione con la llave
-- pública (anon). En la Fase 3 reemplazamos esto por reglas por rol.
-- ════════════════════════════════════════════════════════════════
do $$
declare t text;
begin
  for t in
    select unnest(array[
      'meses','perfiles_usuario','personal','perforacion',
      'explosivos_historial','explosivos_stock','petroleo_historial',
      'petroleo_stock','aceros_historial','mantenimiento','horometros',
      'tareas','ordenes_compra','valorizaciones','epp_historial',
      'cierres_mensuales','reportes_seguridad'
    ])
  loop
    execute format('alter table public.%I enable row level security;', t);
    execute format('drop policy if exists tmp_all on public.%I;', t);
    execute format(
      'create policy tmp_all on public.%I for all to anon, authenticated using (true) with check (true);', t
    );
  end loop;
end $$;

-- ✅ Listo. Si corrió sin errores, las 17 tablas están creadas.
