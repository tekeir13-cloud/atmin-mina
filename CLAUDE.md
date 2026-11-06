# MUKICLOUD — notas para Claude

Sistema de **Temual**, contratista minera en Pataz. Dos unidades: **NV 2820** y **Monte Bravo**.
Todo se habla y se escribe en **español**.

La app es un **único archivo**, `index.html` (~39 000 líneas). Al subir una versión hay que mover
**cuatro cadenas a la vez**: las tres `v2026.XX.XX-NNN` de `index.html` y el `CACHE_V` de `sw.js`.

---

## LOS TRES INFORMES — NO SON EL MISMO DOCUMENTO

Esto se confunde fácil porque los tres dicen "Temual" y los tres llevan la misma portada.
**Antes de hacer nada, identificar cuál de los tres se está pidiendo.**

| # | Informe | De dónde sale | Estado |
|---|---|---|---|
| 1 | **Informe de Logística** | **Del sistema**, ya configurado | No tocar salvo que lo pidan |
| 2 | **Planilla NV 2820 Temual** | Generado | Hecho |
| 3 | **Planilla Monte Bravo Temual** | Generado aparte, a mano | Hecho — es **otro** documento |

### 1 · Informe de Logística — YA ESTÁ EN EL SISTEMA
Sale solo. Logística → pestaña **"Informe de Cierre de Mes"**. Lo arma `cieDatos(mes)` y se abre
en ventana nueva para imprimir. **Ya tiene portada Temual y sus cinco firmas.**
Si piden "el informe de logística", **no hay que construir nada**: se abre desde el sistema.

### 2 · Planilla NV 2820 Temual
La planilla de la unidad principal. En el sistema existe `exportarPlanillaIntegradaExcel()`
(RRHH → planilla integrada), que arma el Excel desde los tareos.

### 3 · Planilla Monte Bravo Temual — EL MÁS NUEVO
**Es un documento distinto del 2**, aunque se llamen parecido. Monte Bravo tiene su propia
planilla, su propia gente y su propia estructura de pago.

La pestaña **Monte Bravo → Planilla** del sistema **todavía NO paga**: solo asigna gente a la
unidad (`mbRenderPlanilla`). Los datos de pago llegan **de fuera, en un Excel** que el usuario
manda como imagen.

**Estructura del pago de Monte Bravo** (así vino en noviembre 2026):
- **Comedor** + **depósitos a cuenta** + **efectivo para los que no tienen cuenta** = total planilla.
- El **100 % sale por banco**, en dos grupos:
  - a cada trabajador con cuenta, directo;
  - a **dos intermediarios**, que cubren el comedor y el efectivo de los que no tienen cuenta.
- **El reparto entre los dos depósitos NO calza con el reparto entre los dos conceptos**, y eso
  **está bien**: quien recibe pidió partirlo así. Lo único que tiene que cuadrar es el total.
  **No levantarlo como descuadre.**

Plantilla reutilizable: `docs/plantilla_planilla_montebravo.html`.

---

## LA PORTADA TEMUAL — LA MISMA PARA LOS TRES

Está en `index.html` (busca `class="port"`, ~línea 14450). Un informe sale de la oficina y llega
a gerencia y al banco: **dice de quién es y de qué periodo antes de que nadie lo abra.**

Marco de 3 px · título en versales · el periodo en grande · regla de color · datos de emisión ·
el total en su recuadro · y al pie **MUKI**CLOUD / SMART INTERACTIONS.

**Ojo con el color:** los informes del sistema todavía llevan el dorado viejo `#b45309`. La app
se repintó al azul del logo (`#1668cf`) y **el usuario rechazó expresamente el dorado**. En
documentos nuevos va el azul. Las portadas del sistema siguen pendientes de repintar.

## LAS FIRMAS — NOMBRES Y CARGOS REALES

Copiarlos de aquí, **nunca de memoria** (están en `index.html` ~línea 14547):

| Nombre | Cargo |
|---|---|
| Ing. Cristian Luy Saavedra | Jefe de Operaciones |
| Ing. Percy Alcántara Rodríguez | Jefe de Finanzas |
| Ing. Francisco Ontaneda Maza | Ingeniero Residente |
| Jorge Rodríguez Sunción | Jefe de Logística |
| Sr. Alcides Terrones Mudarra | Gerente General |

En las planillas firman **los tres ingenieros**, en este orden: **Operaciones → Finanzas →
Residente** (quien dirigió el trabajo, quien paga, quien responde).

---

## CÓMO ENTREGAR UN INFORME HECHO A MANO

1. **HTML primero, PDF después.** Se escribe un `.html` y el PDF sale de Chromium:
   A4, `printBackground:true`, márgenes 12/14 mm, pie con "Pagina N de M".
2. **Mirar el PDF página por página antes de mandarlo.** Cuadros partidos entre dos hojas y
   páginas casi vacías son el defecto típico. `break-inside:avoid` en tablas resumen y bloques.
3. **Entregar los dos archivos**, HTML y PDF.
4. **Nunca publicar una planilla como artefacto con enlace.** Llevan nombres y cuentas
   bancarias: van como archivo y el usuario decide con quién los comparte.
5. **Recalcular todas las sumas desde cero** y decir si cuadran contra las del usuario. Es lo
   primero que mira.

---

## REGLAS DE FONDO

- **No inventar datos.** Si un dato no está (el periodo, el frente de una salida), se dice que
  falta. Repartir "proporcional a algo" para que quede bonito es mentir con buena letra.
- **El material NO se registra por labor.** Las salidas guardan el **nivel de destino**
  (NV 2820, Mantenimiento, Monte Bravo, operario). Solo el **explosivo** y el **avance** están
  por frente. Cualquier gráfico o informe "costo por labor" es falso mientras eso no cambie.
- **Mantenimiento: cuidado con el doble conteo.** Al costo entra `d.mantMO` (horas hombre), NO
  `d.mantS`. Las piezas del kit ya se contaron al comprarlas. El propio Informe de Cierre lo
  dice por escrito.
- **Una sola fuente por cifra.** Si un informe calcula por su cuenta, el mismo mes dirá dos
  cifras distintas en dos pantallas y nadie volverá a creerle a ninguna.
- **Sin librerías por CDN en la app.** Trabaja en interior mina, donde el CDN no responde.
