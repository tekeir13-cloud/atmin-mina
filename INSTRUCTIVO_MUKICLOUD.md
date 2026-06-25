# MUKICLOUD — ATMIN MINA
## Sistema de Control Integral para Operaciones Mineras
### Instructivo Completo de Usuario · Versión 1.0

---

## ¿QUÉ ES MUKICLOUD?

**MUKICLOUD / ATMIN MINA** es un sistema web de gestión operativa diseñado específicamente para empresas mineras subterráneas. Centraliza en una sola plataforma todo el control diario: personal, logística, operaciones, mantenimiento, finanzas y seguridad — accesible desde cualquier dispositivo con internet, en tiempo real.

---

## PROBLEMAS QUE RESUELVE

Antes de este sistema, la operación minera dependía de:
- Cuadernos y hojas de cálculo desconectadas entre áreas
- Información que llegaba tarde (o nunca) a gerencia
- Pérdida de datos al cambiar de turno
- Cálculos manuales de costos y planillas propensos a error
- Sin trazabilidad: nadie sabía quién usó qué material o cuándo
- Reportes mensuales que tomaban días de recopilación

**Con MUKICLOUD esos problemas desaparecen:**

| Problema anterior | Solución con MUKICLOUD |
|---|---|
| El gerente no sabía cuánto costaba el día | Dashboard KPI en tiempo real |
| El tareo se hacía en papel y se perdía | Tareo digital con historial permanente |
| Los materiales "desaparecían" del almacén | Control de ingresos y salidas con trazabilidad |
| Nadie sabía cuánto combustible usó cada equipo | Registro por equipo, turno y galones |
| La planilla tardaba días en calcularse | Costo de planilla automático en segundos |
| Los accidentes no se documentaban bien | Fotos, turno y observaciones en seguridad |
| Los datos no llegaban de mina a oficina | Sincronización a la nube (Supabase) |
| El reporte mensual era un caos | Un clic genera informe con gráficos en Excel |

---

## ACCESO AL SISTEMA

**URL:** https://atmin-mina-4hvy.vercel.app

El sistema funciona en cualquier navegador moderno (Chrome, Edge, Safari, Firefox). Se recomienda Chrome para mejor rendimiento. También funciona en celular.

### Usuarios y Contraseñas

| Usuario | Contraseña | Rol |
|---|---|---|
| gerente@temual.pe | gerente2024 | Gerente General (acceso total) |
| finanzas@temual.pe | finanzas2024 | Jefe de Finanzas |
| operaciones@temual.pe | operaciones24 | Jefe de Operaciones |
| logistico@temual.pe | logistico24 | Logístico |
| admin@temual.pe | admin2024 | Administrador (RRHH) |
| guardia@temual.pe | guardia2024 | Jefe de Guardia |
| ingeniero@temual.pe | ingeniero24 | Ingeniero Residente |
| mantenimiento@temual.pe | mant2024 | Jefe de Mantenimiento |
| comp1@temual.pe | comp12024 | Compresorista |
| comp2@temual.pe | comp22024 | Compresorista |

> ⚠️ Cada usuario solo ve los módulos que le corresponden según su rol. El gerente ve todo.

---

## MÓDULOS DEL SISTEMA

---

### 1. DASHBOARD KPI
**¿Quién lo usa?** Gerente General, Jefe de Finanzas, Jefe de Operaciones

**¿Para qué sirve?**
El tablero ejecutivo muestra en tiempo real el estado de la operación del mes activo. Es la primera pantalla que aparece al iniciar sesión.

**¿Qué puedes ver?**
- **Costo del día:** cuánto ha costado la operación hoy (jornales + materiales + combustible)
- **Costo acumulado del mes:** total de costos desde el inicio del período
- **Personal activo / bajas / total:** distribución actual de la cuadrilla
- **Stock de explosivos:** lo que queda en almacén vs lo consumido
- **Avance lineal por frente:** metros perforados en Rampa Brenda y Cortada Noreste
- **Ingresos del período:** valorización importada o registrada
- **Margen:** diferencia entre ingresos y costos
- **Gráficos de costo por categoría:** distribución visual de dónde va el dinero

**Funcionalidad especial:** El dashboard tiene un **navegador de meses** (‹ ›) que permite revisar el historial financiero de cualquier mes anterior.

---

### 2. LOGÍSTICA
**¿Quién lo usa?** Logístico, Gerente, Jefe de Operaciones

Este módulo es el corazón del control de materiales y suministros. Tiene 6 secciones:

#### 2.1 Almacén General
Registra todo movimiento de materiales en el almacén principal.

**Ingreso de materiales:**
- Seleccionar producto del catálogo (Plan Maestro)
- Ingresar cantidad y precio unitario
- El sistema calcula el subtotal automáticamente
- Se genera historial con fecha, responsable y monto

**Salida de materiales:**
- Seleccionar destino (mina, mantenimiento, guardianía, etc.)
- Elegir producto y cantidad disponible en stock
- El stock se descuenta automáticamente
- Trazabilidad completa: quién sacó, cuándo y para qué

**Vista de stock:**
- Inventario en tiempo real de todos los productos
- Alerta visual cuando el stock es bajo
- Valor total del inventario en soles

#### 2.2 Historial & Edición
- Revisar y corregir movimientos anteriores
- Filtrar por fecha, producto o responsable

#### 2.3 Costo de Inventario
- Valorización mensual del inventario
- Costo por categoría de materiales
- Comparativo entre meses

#### 2.4 Solicitud de Compra
- Crear órdenes de compra con proveedor, descripción y monto
- Seguimiento de estado (pendiente / aprobada / recibida)
- Exportar a Excel en formato de orden de compra oficial

#### 2.5 Plan Maestro de Productos
El catálogo oficial de todos los materiales de la empresa.

**Registro manual:**
- Código (definido por el usuario, no auto-generado)
- Nombre corto
- Descripción completa
- Unidad de medida (UND, KG, GLN, BOL, etc.)
- Precio unitario en S/

**Importación masiva desde Excel:**
El sistema acepta un archivo Excel con 5 columnas:

| Código | Nombre | Descripción | Unidad | Precio |
|---|---|---|---|---|
| MAT-001 | Aceite Air Tool | ACEITE AIR TOOL ISO VG 100 x 1 GAL | GAL | 45.00 |

Al importar, reemplaza todo el catálogo con los datos del Excel. Esto permite actualizar precios de todos los materiales en segundos.

> Los combustibles (Petróleo, Gasolina) y explosivos en el Excel también actualizan automáticamente sus precios en los módulos correspondientes.

#### 2.6 Explosivos NV3190
Control especializado de explosivos en el almacén de nivel 3190.

**Ingresos:**
- Número de vale, producto, cajas, unidades
- Origen del material
- Foto del documento (para trazabilidad)

**Salidas:**
- Destino (NV2820 u otro nivel)
- Cantidad distribuida
- Foto del despacho

**Stock en tiempo real:**
- Saldo = ingresos acumulados − salidas acumuladas
- Por tipo de explosivo: M-1000, M-3000, M-5000, CARMEX, etc.

---

### 3. RECURSOS HUMANOS
**¿Quién lo usa?** Administrador, Jefe de Operaciones, Gerente

#### 3.1 Tareo Diario
El reemplazo digital de la hoja de tareo en papel. Se registra una vez por turno.

**Paso 1 — Configuración del turno:**
- Fecha
- Turno (Día / Noche)
- Nivel (Nv 2820 por defecto)
- Jefe de turno

**Paso 2 — Hoja de tareo:**
- Lista completa de la cuadrilla (45 trabajadores)
- Se marca con checkbox quién asistió
- Se asigna la labor de cada trabajador
- Observaciones generales del turno
- Área de firma del jefe de turno

El sistema calcula automáticamente el costo del tareo del día (trabajadores presentes × jornal diario de cada uno).

#### 3.2 Historial & Edición
- Revisar todos los tareos registrados
- Editar tareos anteriores si hay correcciones
- Ver quién registró y cuándo

#### 3.3 Personal
El directorio completo de la cuadrilla.

**Datos por trabajador:**
- Nombre completo
- DNI
- Cargo / Rol
- Frente asignado (1, 2, o Administrativo)
- Jornal diario en S/
- Fecha de ingreso
- Estado (activo / baja)

**Acciones:**
- Editar cualquier dato (incluyendo el jornal)
- Dar de baja a un trabajador
- Agregar nuevos trabajadores

#### 3.4 Costo Planilla
- Costo de planilla del día actual
- Costo acumulado del mes
- Detalle por trabajador: días trabajados × jornal
- Exportar planilla a Excel con un clic

#### 3.5 Servicios Terceros
- Registrar pagos a contratistas y servicios externos
- Adjuntar foto del vale de pago
- Adjuntar foto del documento impreso
- Exportar liquidaciones a Excel

---

### 4. OPERACIONES
**¿Quién lo usa?** Jefe de Operaciones, Jefe de Guardia, Ingeniero Residente, Gerente

#### 4.1 Tablero de Operaciones
Vista consolidada del estado de la mina:
- Avance lineal acumulado por frente
- Personal distribuido por frente
- Estado de equipos
- Consumo de explosivos del período

#### 4.2 Reporte Jefe de Guardia
El jefe de guardia registra al inicio o fin de cada turno:
- Metros perforados por frente (Rampa Brenda, Cortada Noreste y frentes extra)
- Nombre del jefe de guardia
- Turno y fecha
- El avance lineal se actualiza automáticamente en el tablero

#### 4.3 Reporte Ingeniero Residente
- Distribución de personal por frente
- Asignación de metas diarias
- Afecta la pre-selección del tareo del día

#### 4.4 Valorizaciones
Control de las valorizaciones (facturación por avance).

**Registro:**
- Período (mes/año)
- Tipo de trabajo
- Concepto
- Metros lineales ejecutados
- Precio por metro
- Montos adicionales
- Total calculado automáticamente

**Importación desde Excel:**
- El sistema detecta el período del título del archivo
- Importa todas las partidas en segundos
- Actualiza automáticamente el ingreso en el Dashboard KPI del mes correspondiente

#### 4.5 Solicitudes
- Solicitudes de compra generadas desde operaciones
- Enlazadas con el módulo de logística

---

### 5. MANTENIMIENTO
**¿Quién lo usa?** Jefe de Mantenimiento, Gerente

#### 5.1 Solicitud de Kit de Mantenimiento
Cuando un equipo necesita mantenimiento, el técnico crea un kit:
- Seleccionar equipo (Compresora, Scoop, Dumper, Perforadora, etc.)
- Tipo de mantenimiento (Preventivo / Correctivo / Emergencia)
- Seleccionar las piezas necesarias del almacén de repuestos
- Cantidad de cada pieza
- Horas estimadas de trabajo
- Costo de mano de obra

Al completar el kit, las piezas se descuentan automáticamente del almacén de mantenimiento.

#### 5.2 Programa de Mantenimiento
- Cronograma de mantenimientos preventivos
- Seguimiento de ejecución
- Historial por equipo

#### 5.3 Costos por Máquina
- Costo de kits de mantenimiento del día
- Costo acumulado del mes por equipo
- Análisis de qué equipo genera más costos de mantenimiento
- Rentabilidad por equipo

---

### 6. FINANZAS
**¿Quién lo usa?** Jefe de Finanzas, Gerente General

El módulo financiero consolida todos los datos de la operación en reportes económicos.

#### 6.1 Dashboard Financiero
- **Ingresos:** valorizaciones del período
- **Costos desglosados:**
  - Jornales (planilla de personal)
  - Combustible (petróleo + gasolina)
  - Logística (materiales de almacén)
  - Mantenimiento (kits + repuestos)
  - Explosivos
  - Aceros y brocas
  - EPP (equipos de protección personal)
- **Margen operativo** = Ingresos − Costos totales
- **Costo por metro lineal** avanzado

#### 6.2 Proyección Mensual
- Proyección de ingresos y costos para el mes siguiente
- Planificación financiera
- Exportar a Excel

#### 6.3 Informe Mensual
- Estado de resultados completo del mes
- Desglose por centro de costo
- Exportar a Excel en formato informe oficial

#### 6.4 Costos por Centro de Costo
- Análisis de costos por categoría
- Comparativo entre períodos
- Gráficos de distribución

#### 6.5 Ingresos por Equipo
- Seguimiento de ingresos generados por cada máquina
- Rentabilidad individual de cada equipo
- Cruzado con costos de mantenimiento y combustible

#### Cierre Mensual
El Jefe de Finanzas o Gerente puede **cerrar el mes** cuando la operación del período ha concluido. Al cerrar:
- Los tareos del mes quedan bloqueados (no se pueden editar)
- Se preserva el historial íntegro
- El mes cerrado queda marcado en el sistema

---

### 7. SEGURIDAD
**¿Quién lo usa?** Jefe de Guardia, Ingeniero Residente, Gerente

Módulo de documentación fotográfica de condiciones de seguridad en mina.

**Registro por turno:**
- Fecha y turno
- Frente inspeccionado
- Foto tomada desde el celular (cámara trasera) o subida desde galería
- Observaciones: estado del frente, condiciones, incidentes

**Galería:**
- Todas las fotos organizadas cronológicamente
- Click para ampliar
- Badge de notificación cuando hay reportes no vistos

---

### 8. ASISTENTE IA
**¿Quién lo usa?** Todos los roles

Un asistente de inteligencia artificial integrado al sistema que puede responder preguntas sobre la operación en lenguaje natural.

**Preguntas que puede responder:**
- "¿Cuál es el costo por metro este mes?"
- "¿Cuánto gastamos en petróleo?"
- "¿Quiénes están con baja este mes?"
- "¿Cómo va la producción?"
- "¿Cuánto ganó la compresora?"
- "¿Cuál es el margen de la operación?"

**Modos de uso:**
- **Escribir:** ingresar la pregunta en el campo de texto y presionar Enter
- **Voz:** tocar el ícono del micrófono 🎤, hablar en español, el sistema transcribe y responde también por voz

---

### 9. REPORTE MENSUAL
**¿Quién lo usa?** Gerente, Jefe de Finanzas, Jefe de Operaciones

Genera automáticamente el reporte consolidado del mes con gráficos listos para imprimir o compartir.

**Contenido del reporte:**
1. Carátula con período y datos de empresa
2. Gráfico de consumo de explosivos
3. Gráfico de consumo de combustible por equipo
4. Gráfico de uso de aceros por frente
5. Gráfico de horómetros (horas de equipos)
6. Tabla de explosivos (fecha, turno, código, cantidad)
7. Tabla de materiales usados
8. Tabla de petróleo/gasolina
9. Tabla de horómetros
10. Observaciones del período

**Exportación:**
- Botón "Exportar PDF" para imprimir o enviar
- Formato listo para presentar a la empresa contratante

---

### 10. COMPRESORISTA
**¿Quién lo usa?** Compresoristas (Turno Día / Noche)

Módulo especializado para el reporte de guardia del compresorista. Concentra en 5 pestañas todo lo que debe registrar en su turno:

1. **💥 Explosivos:** consumo por frente (Rampa Brenda / Cortada Noreste)
2. **📦 Materiales:** materiales utilizados en el turno
3. **⛽ Petróleo / Gasolina:** galones consumidos por equipo
4. **⏱ Horómetros:** lectura inicial y final de cada equipo
5. **📝 Observaciones:** novedades del turno, condiciones del equipo, alertas

Al finalizar el turno, el reporte queda guardado y el siguiente turno puede verlo como referencia.

---

## SINCRONIZACIÓN MULTI-DISPOSITIVO (NUBE)

El sistema guarda datos en la nube mediante **Supabase**, lo que permite:

- Lo que registra el logístico en su computadora **aparece al instante** en el celular del gerente
- Si se corta el internet, el sistema sigue funcionando y **sincroniza cuando vuelve la conexión**
- Cualquier dispositivo con el mismo usuario ve los mismos datos
- Los datos de **almacén y combustible** están sincronizados en tiempo real entre todos los dispositivos

---

## EXPORTACIONES A EXCEL DISPONIBLES

| Módulo | Reporte | Contenido |
|---|---|---|
| Logística | Inventario mensual | Stock valorizado por producto |
| Logística | Orden de compra | OC con datos del proveedor y totales |
| Logística | Vale de despacho | Materiales despachados a equipo |
| Logística | Explosivos NV3190 | Ingresos y salidas con fotos |
| RRHH | Planilla | Personal × días × jornal = costo |
| RRHH | Liquidación servicios terceros | Pagos a contratistas |
| RRHH | Reporte de terceros | Resumen mensual de servicios |
| Operaciones | Valorización | Partidas de avance y montos |
| Finanzas | Proyección | Estimado del mes siguiente |
| Finanzas | Informe mensual | Estado de resultados completo |
| Compresorista | Reporte de guardia | Turno consolidado en Excel |
| Sistema | Reporte mensual PDF | Informe gráfico para presentar |

---

## GUÍA RÁPIDA POR ROL

### GERENTE GENERAL
1. Ingresar con `gerente@temual.pe` / `gerente2024`
2. El Dashboard KPI se carga automáticamente — revisa los costos del día y el margen del mes
3. Usa las flechas ‹ › en el dashboard para revisar meses anteriores
4. En **Finanzas → Dashboard** ve el estado de resultados completo
5. En **Reporte Mensual** genera el informe para entregar

### LOGÍSTICO
1. Ingresar con `logistico@temual.pe` / `logistico24`
2. Ir a **Logística → Almacén General**
3. Registrar todo ingreso de materiales cuando llegue
4. Registrar toda salida cuando se despacha a mina
5. Mantener actualizado el **Plan Maestro** con los precios vigentes
6. Gestionar las **Solicitudes de Compra**

### JEFE DE GUARDIA / COMPRESORISTA
1. Ingresar al inicio del turno
2. En **Compresorista** registrar:
   - Lectura inicial de horómetros
   - Consumo de explosivos por frente
   - Combustible por equipo
   - Materiales usados
   - Observaciones al final del turno
3. En **Operaciones → Reporte Jefe de Guardia**: registrar metros perforados por frente

### ADMINISTRADOR (RRHH)
1. Ingresar con `admin@temual.pe` / `admin2024`
2. Al inicio del día: **RRHH → Tareo Diario** — registrar el tareo del turno
3. Revisar que el personal activo esté correcto en **Personal**
4. Exportar la planilla a fin de mes en **Costo Planilla**

### JEFE DE MANTENIMIENTO
1. Ingresar con `mantenimiento@temual.pe` / `mant2024`
2. Cuando un equipo falle: **Mantenimiento → Solicitud de Kit**
3. Seleccionar el equipo, tipo de falla, piezas necesarias
4. Al terminar el trabajo, marcar el kit como completado (piezas se descuentan del almacén)
5. Revisar costos en **Costos por Máquina**

### JEFE DE FINANZAS
1. Ingresar con `finanzas@temual.pe` / `finanzas2024`
2. Revisar **Finanzas → Dashboard** para ver el estado del mes
3. A fin de mes: generar **Informe Mensual** y exportar a Excel
4. Ejecutar el **Cierre Mensual** cuando todo esté cuadrado

---

## IMPORTAR VALORIZACIÓN (INGRESOS)

Cuando recibes el Excel de valorización del mes:

1. Ir a **Operaciones → Valorizaciones**
2. Clic en **📥 Importar Excel**
3. Seleccionar el archivo `.xlsx` con la valorización del mes
4. El sistema detecta automáticamente el mes del título del archivo
5. Importa todas las partidas y **actualiza el ingreso en el Dashboard KPI** del mes correspondiente
6. Aparece notificación: *"Valorización de Mayo 2026 importada — ingreso S/ XXX actualizado"*

---

## IMPORTAR PLAN MAESTRO (MATERIALES)

Para actualizar todos los precios y materiales del catálogo:

1. Ir a **Logística → Productos (Plan Maestro)**
2. Clic en **📄 Plantilla** para descargar el formato correcto
3. Completar el Excel con todas las columnas: `Código | Nombre | Descripción | Unidad | Precio`
4. Ir a **📥 Importar Excel** y subir el archivo completado
5. El catálogo completo se reemplaza con los nuevos datos
6. Los precios de combustible y explosivos también se actualizan si están en el archivo

---

## RECOMENDACIONES DE USO

1. **Registrar en el turno, no al día siguiente.** La trazabilidad depende de que los datos se ingresen en el momento.

2. **Un usuario por rol.** No compartir credenciales entre personas de distintos cargos.

3. **El Plan Maestro debe mantenerse actualizado.** Los costos del dashboard dependen de precios correctos en el catálogo.

4. **Fotos en seguridad.** Cada turno debería tener al menos una foto del estado del frente — es el respaldo ante cualquier contingencia.

5. **Cierre mensual oportuno.** Ejecutar el cierre cuando se hayan registrado todos los movimientos del mes para que el historial quede cerrado e intacto.

6. **Usar Chrome** para el mejor rendimiento, especialmente en la captura de fotos y el asistente de voz.

---

## SOPORTE

Para reportar problemas o solicitar nuevas funcionalidades, contactar al administrador del sistema o escribir al equipo de desarrollo de MUKICLOUD.

---

*MUKICLOUD · ATMIN MINA · Sistema de Control Integral para Operaciones Mineras*
*Desarrollado para Temual — Operaciones Mineras Inteligentes*
