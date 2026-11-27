-- Tabla donde se guardan las solicitudes de demo del sitio.
-- Se ejecuta una sola vez en Supabase: SQL Editor → pegar → Run.

create table if not exists public.solicitudes (
  id bigint generated always as identity primary key,
  creada timestamptz not null default now(),
  nombre text not null check (char_length(nombre) between 1 and 80),
  empresa text not null check (char_length(empresa) between 1 and 100),
  correo text not null check (char_length(correo) between 3 and 120),
  origen text not null check (char_length(origen) between 1 and 60),
  destino text not null check (char_length(destino) between 1 and 60)
);

-- Seguridad: con RLS activado y sin políticas, nadie puede leer ni escribir con la clave pública.
-- Solo la función del servidor (con la clave secreta) puede insertar; tú las ves en el Table Editor.
alter table public.solicitudes enable row level security;

-- La API de datos no expone tablas nuevas automáticamente: solo la clave secreta (service_role) puede insertar.
grant select, insert on public.solicitudes to service_role;
