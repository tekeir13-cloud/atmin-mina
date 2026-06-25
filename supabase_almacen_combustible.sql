-- ════════════════════════════════════════════════════════════════
-- ATMIN MINA — Migración Almacén + Combustible a Supabase
-- Ejecutar UNA VEZ en: Supabase → SQL Editor → New query → Run
-- ════════════════════════════════════════════════════════════════

-- Tabla de snapshots por módulo (almacén, combustible).
-- Cada módulo se guarda como un documento JSON. Estrategia: last-write-wins.
create table if not exists app_modulos (
  modulo      text primary key,
  data        jsonb,
  updated_at  timestamptz default now()
);

-- Habilitar Row Level Security
alter table app_modulos enable row level security;

-- Política: permitir lectura/escritura a usuarios autenticados y anónimos
-- (proyecto privado del equipo de mina, acceso con anon key + login).
drop policy if exists "app_modulos_all" on app_modulos;
create policy "app_modulos_all"
  on app_modulos
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Listo. Al recargar la app desde cualquier dispositivo, el almacén y el
-- combustible se cargarán/guardarán automáticamente desde esta tabla.
