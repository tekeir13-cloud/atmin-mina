# Pronóstico Tenis — modelo de criterios

App: `tenis.html` (ruta `/tenis`). Página suelta, no toca nada de MukiCloud.
Los datos viven en el navegador (localStorage, clave `tenis_pronostico_v1`);
la copia de respaldo se exporta a `.json` desde la pestaña **Datos**.

## Cómo puntúa

Cada criterio se califica de 0 a 10 por jugador (5 = neutral) y encima se marcan
los *ajustes rápidos* (suman o restan décimas al puntaje). El total de cada
jugador es el promedio ponderado por el peso de cada criterio llevado a 100, y
la diferencia entre totales se convierte en probabilidad con una curva logística
(k = 0.05): 10 puntos de diferencia ≈ 62 %, 20 ≈ 73 %, 40 ≈ 88 %. La
probabilidad nunca pasa de 93 %.

Los pesos **no tienen que sumar 100**: el modelo normaliza. Eso permite agregar
criterios nuevos sin rehacer los que ya están.

Confianza:

| Nivel | Condición |
|---|---|
| Alta | diferencia ≥ 20 puntos y al menos 3 criterios con brecha real (≥ 1) |
| Media | diferencia ≥ 10 puntos y al menos 2 criterios con brecha real |
| Baja | el resto |

Recomendación de apuesta (necesita la cuota):

1. Diferencia < 8 puntos → **PASAR**, partido parejo.
2. Confianza baja → **PASAR**, falta información.
3. Valor esperado `p × cuota − 1` ≤ 0 → **NO APOSTAR**, la cuota no paga el riesgo.
4. Valor esperado entre 0 y 5 % → **valor justo**, apostar poco o pasar.
5. Valor esperado > 5 % → **APOSTAR**; el monto sugerido es Kelly a un cuarto,
   con tope del 3 % de la banca.

## Los 4 criterios (directriz del 14/09/2026)

| # | Criterio | Peso | Qué mide |
|---|---|---|---|
| 1 | Solidez | 30 | Cómo creció el tenista en todo el campeonato y si esa forma de ganar le sirve contra **este** rival. El que avanzó por una sola arma vale menos ante quien tiene esa arma **y** respuesta (final del US Open: Shelton avanzaba por su saque; Zverev tenía saque y respuesta). |
| 2 | Nuevo nivel | 25 | Estrena puesto nuevo o lo alcanza ganando (Zverev estrenando N°1, Rybakina estrenando N°1): juega con la presión a favor. Aplica al top-5 que juega su segundo partido después de campeonar. |
| 3 | Localidad | 15 | Jugar en su propio país suma, y suma más si viene ascendiendo con buenas estadísticas. El público local también pesa en contra del rival. Si la nacionalidad coincide con el país sede, la app marca sola el ajuste. |
| 4 | Saque y terreno | 30 | Calidad de saque más nivel real en esa superficie. Buen sacador con experiencia en esa cancha manda el partido; si la superficie no lo acompaña, el saque solo no alcanza. |

## Observación estadística sobre el criterio 2

El "top-5 que juega después de campeonar" entra como impulso (+1.5), tal como
está la directriz. Queda anotado que en el circuito el partido inmediato tras
levantar un título suele rendir por debajo de lo esperado (resaca del campeón),
por eso existe además el ajuste "menos de 3 días desde la final que ganó" (−1).
Cuando el historial tenga suficientes partidos cerrados, la pestaña Historial
va a mostrar si ese criterio acierta y conviene moverle el peso.

## Criterios sugeridos (entran con peso 0)

Están listos para agregarse desde la pestaña **Criterios** y no afectan el
cálculo hasta que se les asigne peso:

5. **Head to head en esta superficie** — solo partidos en la misma cancha y de
   los últimos 2 años.
6. **Descanso y carga** — minutos jugados, maratones seguidos, días de descanso.
7. **Momentos clave** — break points salvados y convertidos, tie-breaks.
8. **Condiciones de juego** — altura, velocidad de cancha, indoor, calor.

## Retroalimentación

Al cerrar cada pronóstico con su ganador, la app calcula:

- aciertos totales y porcentaje;
- unidades ganadas o perdidas a plano (1u por apuesta recomendada con cuota);
- acierto **por criterio**, contando solo los partidos donde ese criterio marcó
  brecha (≥ 1 punto), con sugerencia de subir o bajar el peso a partir de 10
  casos.

## Directrices nuevas

Cada directriz que llegue se guarda con su fecha en la pestaña **Datos**
(bitácora) y, si cambia la forma de puntuar, se edita el criterio o se le agrega
un ajuste rápido. Este documento se actualiza junto con el cambio.
