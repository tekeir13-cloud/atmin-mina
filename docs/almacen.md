# Almacén General — Reglas de stock

## La regla de oro: EL MAESTRO MANDA

**Todo lo que tiene stock debe tener su código en el maestro de productos. No existen huérfanos.**

1. **Ingreso** → aparece de inmediato en el stock y en el selector de Salida.
2. **Salida** → descuenta de inmediato en ambos.
3. Un movimiento cuyo código **no existe** en el maestro queda **fuera del stock**.
4. Un movimiento **sin código** se une automáticamente al producto del maestro cuyo nombre calce (ignorando mayúsculas, acentos y espacios extra — `_normNom`). Si no calza con nada, queda fuera.
5. El **Ingreso exige** elegir un producto del maestro: si lo escrito no corresponde a ninguno, se bloquea con aviso. Así no se generan huérfanos nuevos.
6. El **maestro bloquea duplicados** por código **y por nombre** (normalizado): no pueden existir "Caja de agua" y "CAJA DE AGUA" a la vez.
7. Si dos productos duplicados llegan a existir (datos antiguos), al cargar la app se **unifican solos**: gana el de código oficial (no autogenerado `ART-`), sus movimientos pasan al oficial y el duplicado se elimina con lápida.

## Estructura

- **Almacén General = Insumos (`General`) + Mantenimiento**: dos partes de un mismo almacén. El selector de Salida muestra **todos los almacenes juntos** por defecto (cada ítem conserva su almacén al guardarse).
- **Maestro de productos** (`state.almacen.productos`): código, nombre, unidad, precio. Fuente de verdad. `productosTs` marca la edición más reciente (gana en la sincronización).
- **Stock** = inventario inicial + ingresos − salidas (`calcStock()` filtrado por `filtrarPorMaestro()`).
- **Corte de stock** (`stockCorteTs`): las existencias del Excel oficial ya incluyen los movimientos previos al corte; esos movimientos no se doble-cuentan en el stock pero siguen en el historial y en el gasto.

## Subalmacén NV2820 (control del Compresorista)

- **Ingreso**: salidas de Logística con destino `2820`, que suman al stock **solo cuando el Compresorista confirma la recepción** desde su Reporte de Guardia (`confirmadoNV2820`).
- **Apertura propia** (`nv2820Apertura`): stock inicial cargado directo al subalmacén (no sale del Almacén General). Se fusiona por id con `_ts` y las bajas dejan lápida.
- **Egreso**: el consumo que el Compresorista reporta hacia **cualquier frente** (ver `frentes.md`).
- No entra en la fórmula del Almacén General: es un subalmacén de control.

## Módulos relacionados

- **Explosivos**: cardex propio (`state.almacen.explosivos`) con catálogo fijo; el gasto por frente sale de los reportes del Compresorista × precios vigentes.
- **Stock Remanente**: control aparte con ingreso manual (origen + varios explosivos).
