# Video institucional MukiCloud

Pieza de motion graphics de 74 s, 1920×1080, renderizada cuadro por cuadro.
No se edita en un programa de video: **el video es código**. Se cambia el texto
o un dato en `muki.html` y se vuelve a renderizar.

## Cómo se rehace

```bash
node render.mjs salida.mp4          # 2,220 cuadros → MP4 (unos 10 min)
node shot.mjs 18 25 33              # solo esos segundos, como PNG, para revisar
```

Necesita Chromium (Playwright) y ffmpeg. Para montarle música:

```bash
ffmpeg -i salida.mp4 -i musica.mp3 -filter_complex \
  "[1:a]atrim=0:74,afade=t=in:st=0:d=2,afade=t=out:st=69.5:d=4.5,loudnorm=I=-14[a]" \
  -map 0:v -map "[a]" -c:v copy -c:a aac -b:a 192k FINAL.mp4
```

## Estructura

| Tiempo | Escena | Qué dice |
|---|---|---|
| 0:00–0:04 | Túnel | A 600 metros bajo tierra, algo acaba de pasar |
| 0:04–0:08 | Oficina a ciegas | Y arriba nadie lo sabe todavía |
| 0:08–0:16 | El caos | Seis áreas, seis islas de información |
| 0:16–0:20 | Marca | MukiCloud · Ten tu mina conectada al segundo |
| 0:20–0:30 | Arquitectura | Frentes → nube → gerencia, al segundo |
| 0:30–0:52 | Módulos | Dashboard, Almacén, RRHH, Compresorista, NIA |
| 0:52–0:58 | Sin señal | Sigue funcionando; al volver, sincroniza |
| 0:58–1:06 | Antes / ahora | Los 7 problemas que resuelve |
| 1:06–1:14 | Cierre | Tu mina, conectada al segundo |

El ritmo está clavado a 120 BPM (corte cada 2 s), para que cualquier pista a ese
tempo caiga en golpe.

## Datos en pantalla

El panel del Dashboard reproduce cifras reales del ciclo (259.4 / 248 m, el corte
de la mina por labor). Los otros cuatro paneles son **ilustrativos**: se
reemplazan por capturas reales del sistema cuando haya acceso. Ningún nombre ni
DNI de trabajador aparece en el video: el módulo de personal se muestra por cargo.
