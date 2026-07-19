# Frentes de trabajo — configuración central

## Dónde se definen

Constante `FRENTES` en `index.html` (una sola lista para toda la app):

| id | key | Nombre | Color |
|---|---|---|---|
| 1 | `brenda` | RA Brenda | 🟦 azul |
| 2 | `crne` | CRNE (Cortada Noreste) | 🟩 verde |
| `GLSE2` | `glse2` | GLSE-2 | 🟧 naranja |
| `ESCM4430` | `escm4430` | ESCM 4430 | 🟪 morado |
| `ESCM4410` | `escm4410` | ESCM 4410 | 🟥 rojo |
| `SN5100NW` | `sn5100nw` | SN 5100 NW | 🟨 amarillo |

**Agregar un frente nuevo = agregar una línea a `FRENTES`.** Se activa solo en todos los módulos de abajo.

## Dónde impacta

- **Reporte de Jefe de Guardia**: sección por frente (metros, taladros, cimbras…).
- **Ingeniero Residente**: metas mensuales por frente (`metasFrentes`; los frentes 1 y 2 conservan campos legacy).
- **Dashboard KPI / Tablero de Operaciones**: avance, cumplimiento, cimbras y gasto de explosivo por frente.
- **Reporte de Compresorista**:
  - **⛏️ Consumo**: una sección por frente. Rampa Brenda y Cortada Noreste guardan en los campos históricos `consumoRampa`/`consumoGaleria`; los demás en `consumoFrentes[key]`. Todo consumo descuenta el subalmacén NV2820.
  - **💥 Explosivos por Frente**: una columna por frente. Campos legacy `rampa`/`galeria` para Brenda/CRNE; los demás por su `key` (helpers `compExpCampo`/`compExpVal`/`compExpTotal`).
- **Salidas de Almacén**: el destino puede ser un nivel/frente, entrega a operario o NV2820.

## Compatibilidad

Los frentes 1 y 2 mantienen ids numéricos y campos legacy por los datos ya guardados: **los reportes antiguos nunca cambian de valor**. Los helpers devuelven 0 para frentes que un reporte viejo no conoce (sin NaN ni doble conteo).
