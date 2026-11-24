# Videos ALMATRIX · MukiCloud

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

---

# Maestro ALMATRIX · MukiCloud (90 s)

`almatrix.html` — la pieza para el Premio Eureka. Se renderiza igual:

```bash
node render-almatrix.mjs salida.mp4
```

## Por qué está armado así

Almatrix es la empresa y MukiCloud es su producto, pero no se juntan mitad y
mitad: en el propio método, **MukiCloud es la fase 4**. El libro lo dice en la
fase Automatizar — *"un ERP como MUKICLOUD"* — y NIA aparece en la fase 5. Así
que el método es la espina del relato y el producto es la prueba de que
funciona. Las nueve fases se agrupan en los tres módulos de la oferta
(Operación · Digital · Marca y Mercado), porque nueve bloques en 90 segundos no
se recuerdan y tres sí.

| Tiempo | Escena |
|---|---|
| 0:00–0:06 | "La tendencia es automatizarlo todo con IA. ¿Y si ese fuera el error?" |
| 0:06–0:11 | La premisa: automatizar un proceso inestable acelera sus defectos |
| 0:11–0:18 | Los dos eslabones se enganchan → ALMATRIX · Smart Interactions |
| 0:18–0:26 | El método: las nueve fases y los tres módulos |
| 0:26–0:37 | Fase 01 Analizar: la mina a oscuras, seis islas de información |
| 0:37–1:04 | Módulo Digital: MukiCloud, la arquitectura al segundo y los tableros |
| 1:04–1:11 | Evidencia en A&TM · Pataz: −9,5 % · −47 % · −96 % · −31 % |
| 1:11–1:18 | Mercado: 10 700 productores, 6 minas al mes 12 |
| 1:18–1:30 | Los fundadores y el enunciado de marca |

## La marca

`alma-marca.png` y `alma-lockup.png` son el logotipo oficial de ALMATRIX,
recortados del archivo original. En el video se dibujan en modo **screen**: el
negro del archivo desaparece sobre cualquier fondo oscuro y el blanco conserva
su antialias. No es una versión redibujada — es el logo exacto.

Si algún día hace falta sobre fondo claro, hay que exportar una versión en
negro desde el archivo de marca: el modo screen solo sirve sobre oscuro.

## Datos y personas

Las cifras de A&TM, el mercado y el método salen del pitch y del libro del
método. **Ningún nombre ni DNI de trabajador aparece en los videos.** Los
retratos de los fundadores (`percy.png`, `edison.png`) se extrajeron del propio
video institucional de ALMATRIX, del cuadro donde la foto está a plena luz y
antes de que entren los rótulos.
