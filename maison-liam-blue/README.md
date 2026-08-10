# Maison Liam Blue · Sitio web

Landing page y sitio de la Maison, construidos sobre el **Manual de Marca
v1.0 (Agosto 2026)**.

Sin frameworks ni dependencias: solo HTML, CSS y un archivo de JavaScript.
Se puede abrir con doble clic, editar desde cualquier computadora y
publicar gratis. No hay nada que se rompa dentro de seis meses porque una
librería cambió de versión.

---

## Lo primero que tienes que cambiar

Abre **`js/app.js`** y edita las cuatro líneas del bloque `CONFIG`:

```js
var CONFIG = {
  whatsapp: '51999999999',                          // ← número real, solo dígitos
  instagram: 'https://instagram.com/maisonliamblue',
  tiktok: 'https://tiktok.com/@maisonliamblue',
  saludo: 'Hola Liam Blue, vengo desde la web y quiero consultar por'
};
```

El número va en formato internacional sin `+`, sin espacios y sin guiones.
Para Perú: `51` + los nueve dígitos. Ejemplo: `51987654321`.

Con eso quedan configurados de una sola vez **todos** los botones de
WhatsApp del sitio, el formulario de contacto y los enlaces a redes.

---

## Las páginas

| Archivo | Qué es |
|---|---|
| `index.html` | Landing page |
| `coleccion.html` | Catálogo con filtros por línea |
| `maison.html` | Historia, propósito, valores y packaging |
| `contacto.html` | Canales, formulario y preguntas frecuentes |

La landing sigue exactamente la estructura que el manual define en la
página 15: hero visual, propuesta de valor, colecciones, looks completos,
beneficios, testimonios, Instagram y CTA de compra.

---

## Estructura

```
maison-liam-blue/
├── index.html
├── coleccion.html
├── maison.html
├── contacto.html
├── css/estilo.css      ← todo el diseño, en un solo archivo
├── js/app.js           ← configuración y comportamiento
├── img/
│   ├── favicon.svg     ← monograma LB
│   └── LEEME.txt       ← cómo poner las fotos reales
└── vercel.json
```

---

## Cómo verlo en tu computadora

Doble clic en `index.html` y listo.

Para verlo como lo verá el público, con un servidor local:

```bash
cd maison-liam-blue
python3 -m http.server 8000
```

Y abre `http://localhost:8000`.

---

## Cómo publicarlo

El sitio vive en una subcarpeta de este repositorio, así que hay que
decirle a Vercel dónde mirar:

1. Entra a [vercel.com](https://vercel.com) → **Add New Project**
2. Elige este repositorio
3. En **Root Directory**, pulsa *Edit* y selecciona **`maison-liam-blue`**
4. Framework Preset: **Other**
5. **Deploy**

En menos de un minuto tendrás una URL. Después, en *Settings → Domains*,
puedes conectar el dominio propio (por ejemplo `maisonliamblue.com`).

Cada vez que se suba un cambio a la rama, Vercel vuelve a publicar solo.

---

## Cómo agregar un producto

Copia un bloque completo dentro de `coleccion.html` y cambia los datos:

```html
<article class="producto revelar" data-linea="woman">
  <div class="producto__media">
    <div class="foto foto--vertical" data-foto="Descripción de la foto"></div>
    <a class="producto__accion" data-wasap="el Nombre de la Pieza">Consultar</a>
  </div>
  <p class="producto__linea">Woman</p>
  <h2 class="producto__nombre">Nombre de la Pieza</h2>
  <p class="producto__precio">S/ 000</p>
</article>
```

Tres detalles que importan:

- **`data-linea`** decide en qué filtro aparece: `woman`, `accessories`,
  `beauty` o `parfums`. Si no coincide con ninguno, la pieza no se ve al
  filtrar.
- **`data-wasap`** es lo que se escribe solo en el mensaje de WhatsApp.
  Redáctalo como continuación de la frase: *"…quiero consultar por **el
  Blazer Ivory**."*
- Para marcar una pieza, agrega una cinta antes de la foto:
  `<span class="producto__cinta producto__cinta--oro">Nuevo</span>`

Para poner precio rebajado: `<del>S/ 329</del> S/ 259`.

---

## Las fotos

Hoy el sitio muestra marcadores en tono de marca que dicen qué foto va en
cada hueco. Están pensados para que la maqueta se lea completa mientras
llega la sesión de fotos.

**`img/LEEME.txt`** explica cómo reemplazarlos, con las proporciones y
tamaños exactos que usa cada sección, más el resumen de la dirección
fotográfica del manual.

---

## Decisiones de diseño

**Paleta.** Los cinco colores oficiales del manual (pág. 8) están al inicio
de `css/estilo.css` como variables. Cambiar uno ahí lo cambia en todo el
sitio.

```css
--midnight:  #0D182A;
--champagne: #C8B49A;
--ivory:     #F7F5F0;
--onyx:      #111111;
--gold:      #B89055;
```

El dorado se usa solo en líneas, monograma y acentos, nunca como fondo
extenso: es la regla que el manual repite en las páginas 8 y 12.

**Tipografía.** El manual nombra *DejaVu Serif* y *DejaVu Sans*, que es la
tipografía por defecto con la que se generó el PDF, no una elección
editorial — DejaVu es una fuente de sistema y ninguna casa de moda la usa
en piezas de campaña. El sitio usa **Cormorant Garamond** (editorial) y
**Jost** (apoyo), que cumplen lo que el manual pide de cada familia:
"moda, sofisticación y permanencia" para los titulares, "claridad y
equilibrio" para el resto.

Si prefieres el literal del manual, cambia solo estas dos líneas en
`css/estilo.css`:

```css
--serif: 'Cormorant Garamond', ...;
--sans:  'Jost', ...;
```

**Logotipo.** Está construido con tipografía viva, no como imagen: se ve
nítido en cualquier pantalla, pesa cero y respeta las proporciones del
manual en todos los tamaños.

---

## Qué se puede añadir después

El sitio está armado para crecer sin rehacerlo:

- **Carrito y pago en línea.** Hoy el pedido se cierra por WhatsApp, que es
  el canal de conversión que define el manual (pág. 15) y lo que funciona
  al empezar. Cuando el volumen lo pida, se puede conectar Shopify Lite o
  Stripe sin tocar el diseño.
- **Formulario por correo.** El formulario de contacto abre WhatsApp con el
  mensaje escrito. Para recibirlo también por email, servicios como Formspree
  o Web3Forms funcionan cambiando el `<form>` sin tocar nada más.
- **Instagram real.** La cuadrícula es estática. Con Behold o EmbedSocial se
  conecta al feed real.
- **Blog editorial.** El manual define seis pilares de contenido (pág. 16);
  una sección de notas les daría casa propia y ayudaría al posicionamiento
  en Google.

---

## Accesibilidad y rendimiento

- Navegación completa por teclado, con salto al contenido y foco visible.
- Contraste verificado sobre los fondos Midnight e Ivory.
- Se respeta `prefers-reduced-motion`: quien pidió menos animación en su
  sistema no recibe ninguna.
- Etiquetas Open Graph en las cuatro páginas, para que los enlaces
  compartidos en Instagram y WhatsApp se vean cuidados.
- Sin librerías externas. Lo único que se descarga de fuera son las dos
  tipografías.
