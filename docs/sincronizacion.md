# Sincronización entre dispositivos

## Las tres vías

1. **Al guardar**: cada módulo guarda en `localStorage` y sube a Supabase (`sbSyncModulo`). Sin señal, queda en cola (`_sbPend`) y sube al reconectar.
2. **Al abrir la app**: se descarga la nube y se **fusiona** con la copia local (nunca se pisa a ciegas).
3. **En tiempo real**: cambios de otros equipos llegan por Supabase Realtime (`_rtAplicarModulo`) y se fusionan igual; la vista activa se re-renderiza sola. Si el modal de Salida o Ingreso está abierto, su selector/lista se refresca al instante conservando la selección.

## Reglas de fusión (quién gana en conflicto)

| Datos | Regla |
|---|---|
| Ingresos de almacén | Unión por `id` (nada se pierde) |
| Salidas de almacén | Por `id`, gana `_ts` más reciente (así la confirmación del Compresorista y las ediciones son permanentes) |
| Maestro de productos | Gana `productosTs` más nuevo; bajas con lápida `prod:id` |
| Reportes de Compresorista | Por `fecha|turno`, gana `_ts` más reciente; borrado con lápida `comp:fecha|turno` (solo Jefe de Finanzas) |
| Apertura NV2820 | Fusión por `id` con `_ts`; bajas con lápida |
| Banderas de migración (`almExcelV`, `aguaFixV`, `stockCorteTs`, …) | Se propaga el **máximo**: la migración corre una sola vez en total |

## Lápidas (tombstones)

Un borrado deja **lápida** (id marcado). La fusión nunca resucita un elemento con lápida, sin importar relojes distintos o copias viejas. Se usan para: productos eliminados, reportes eliminados, ingresos reemplazados por migraciones y aperturas dadas de baja.

## Ediciones que deben imponerse

Para que una edición gane en todos los equipos, la app:
- marca `_ts = Date.now()` en el elemento editado (colecciones que fusionan por `_ts`), o
- **reemplaza** el registro con id nuevo + lápida al viejo (colecciones que fusionan por unión, como los ingresos), para que la copia vieja no pueda revivir.

## Migraciones versionadas

Limpiezas de datos que corren **una sola vez en total** (no una vez por equipo): se guardan con una bandera numérica (`aguaFixV=1`, `almExcelV=1`…) que viaja por la sincronización con regla de máximo. El primer equipo que abre la app la ejecuta y el resultado se propaga.
