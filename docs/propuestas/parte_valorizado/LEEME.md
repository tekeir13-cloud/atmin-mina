# Parte valorizado de guardia — PROPUESTA (pendiente de implementar)

Estado: **guardada a pedido del usuario el 27/11/2026. No implementar hasta que lo pida.**

Archivos:
- `Propuesta_Parte_Valorizado_Guardia.pdf` / `.html` — versión 2, con secciones confirmadas y recálculo del ciclo 26/10–25/11.
- `Formato_Parte_Valorizado.html` — maqueta interactiva del parte (formato claro).
- `Modelo_Valorizacion.xlsx` — modelo original del usuario (tarifas).

Modelo (cuadra al centavo con el Excel): meta S/ 20,095.34 por guardia =
2 disparos galería (3 m) + 2 rampa (3 m) + 1 chimenea (1.5 m) + sostenimiento.
- Avance S/ por metro: galería 1,650 · rampa 2,150 · chimenea 1,350.
- Toneladas = m × ancho × alto × 2.7; carguío y acarreo S/ 27.80 por t (3.30 + 14.50 + 3.50 + 6.50).
- Sostenimiento: PH7 + malla galería 60, rampa 75; puntal chimenea 310.

Secciones confirmadas por el usuario:
- RA Brenda = rampa 3.5×3.5 · GL SE 4, GLNW 4, GL NW-5 = galería 2.7×2.7 · CH 6905 = chimenea 1.5×2.4.
- ESCM 4410 y ESCM 4675 = 3.5×3.5 (se aplicó tarifa de rampa: supuesto, por confirmar).
- ES CM 6905-2 = subnivel 1.20×1.80; el usuario pidió "sacarle un promedio": se usó S/ 1,500/m
  (promedio galería y chimenea). Pernos del subnivel sin precio.

Pendiente de confirmar: sección de CRNE; si ESCM/subnivel tienen precio propio; si la meta exige
exactamente 2·2·1 disparos; si cada guardia acarrea lo que dispara; si TJ 5100 se valoriza.

Diseño propuesto: el parte del jefe de guardia ya guarda metros, pernos y malla por disparo; solo se
agregan "puntales instalados" (chimenea) y "¿se acarreó lo disparado?", la sección de cada labor como
configuración de Finanzas, y un panel con S/ producidos vs meta y disparos 2·2·1.

---

## Actualización 27/11/2026 — decisiones del usuario y corrida de ejemplo

Archivos nuevos:
- `Ejemplo_Eficiencia_Operativa.pdf` / `.html` — corrida del ciclo 26/10–25/11 con los 58 partes reales.
- `Ejemplo_Eficiencia_Fisica_por_Seccion.pdf` / `.html` — factor de carga por sección y distribución de disparos.

Confirmado:
- **Meta del gráfico económico: S/ 20,705.45**, banda naranja ±2,000 (abajo rojo, arriba verde).
- **CRNE: sección 3 × 3, S/ 1,710 por metro, perno de 6'.** El perno de 6' no tiene precio ni cantidad
  estándar todavía: se registra en el parte pero no suma soles.
- ESCM con tarifa de rampa y subnivel a S/ 1,500/m: confirmados.
- La meta en soles manda; si no se cumple el 2·2·1, la guardia se marca en rojo.
- Acarreo: se asume siempre (nada queda en la cámara). Se quita la pregunta del parte, pero el informe
  muestra el volumen acarreado total.
- TJ 5100: se registra, no se valoriza.
- Sostenimiento (foto del usuario): galería 2.7×2.7 → 7 PH7+M a S/ 60; rampa 3.5×3.5 → 11 PH7+M a S/ 75;
  chimenea → puntales (S/ 310 c/u).
- **Eficiencia global = física × económica.** Física = óptimo ÷ factor real (tope 100 %), pesada por metros
  en la guardia. Económica = S/ producidos ÷ 20,705.45. Global del mes = promedio de las globales de cada
  guardia. Rojo < 70 %, naranja 70–75 %, verde > 75 %.
- Pantalla pedida en Operaciones → Tablero, debajo del factor de carga: gráfico "Eficiencia operativa" (con una dona del día al costado del acumulado: qué parte del producido puso cada reporte)
  (S/ por reporte y acumulado por jefe), tabla de acumulado con 1.º/2.º/3.º, comparativo física/económica,
  panel del día (solo quien reportó) y eficiencia del mes por jefe.

Pendiente de confirmar antes de implementar:
- Óptimo de factor de carga (kg/m) para galería, chimenea y subnivel (hoy solo Rampa 27.5 y CRNE 23.6;
  en los ejemplos se usó la mediana real del ciclo como referencia provisional).
- Si ESCM usa el óptimo de rampa (27.5).
- Si la económica se topa en 100 % (en el ejemplo va sin tope).
- Promedio de la física pesado por metros (propuesto) o simple.

### 27/11/2026 — óptimos por sección (implementado, v401)
Rampa 27.5 y CRNE 23.6 kg/m son los fijados. ESCM usa 27.5 (misma sección que rampa). Galería 20.6,
chimenea 11.7 y subnivel 7.4 kg/m se calculan de esos dos según el área: kg/m³ lineal con el área entre
los dos puntos conocidos (2.24 a 12.25 m², 2.62 a 9 m²). Calzan con las medianas del ciclo 26/10–25/11
(20.0, 11.3 y 8.6). Una sola fuente: `EFOP.tipos` → `FC_OPTIMOS`.
