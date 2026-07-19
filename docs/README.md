# MukiCloud — Documentación

Sistema de gestión integral de la operación minera: logística/almacén, recursos humanos, operaciones, mantenimiento, finanzas y reportes de campo (Jefe de Guardia y Compresorista).

## Arquitectura

- **Una sola página**: toda la aplicación vive en `index.html` (HTML + CSS + JavaScript). No hay backend propio.
- **Datos**: Supabase (nube) + `localStorage` (copia local en cada equipo). La app funciona **offline** (interior mina) y sincroniza al recuperar señal.
- **Offline / PWA**: `sw.js` (Service Worker) guarda la última copia buena. Estrategia: red primero para navegar (recibe versiones nuevas al instante) y caché como respaldo sin señal.
- **Versionado**: la constante de versión (p.ej. `v2026.07.16-14`) aparece en `index.html` y `sw.js` (`CACHE_V`). **Al desplegar hay que subir ambas** — el cambio de `CACHE_V` hace que el SW viejo se limpie solo.

## Contenido de esta carpeta

| Archivo | Qué documenta |
|---|---|
| [almacen.md](almacen.md) | Reglas del stock del Almacén General, maestro de productos, NV2820 |
| [sincronizacion.md](sincronizacion.md) | Cómo viajan los datos entre dispositivos y cómo se resuelven conflictos |
| [frentes.md](frentes.md) | Configuración central de frentes y dónde impacta |
| [changelog.md](changelog.md) | Historial de cambios por versión |

## Roles principales

- **Logística**: maestro de productos, ingresos, salidas, stock vigente, explosivos, NV2820.
- **Jefe de Guardia**: reporte diario por frente (metros, taladros, cimbras…).
- **Compresorista**: reporte de guardia con confirmación de materiales, consumo por frente, explosivos por frente, combustible y horómetros.
- **Jefe de Finanzas**: único rol que puede eliminar reportes de compresorista; ve sueldos.
- **Ingeniero Residente**: asigna metas por frente.

## Despliegue

La rama de trabajo se fusiona a `main` mediante Pull Request. Los equipos reciben la versión nueva al reabrir o recargar la app (el número de versión visible en la app confirma qué versión corre cada equipo).
