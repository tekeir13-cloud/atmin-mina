/* ════════════════════════════════════════════════════════════════
   MAISON LIAM BLUE · Comportamiento del sitio
   Sin librerías externas: menos peso, menos que mantener y nada
   que se rompa cuando un CDN cambie de versión.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Configuración editable ───────────────────────────────────
     Cambiar aquí el número y los enlaces actualiza todo el sitio.
     El número va en formato internacional, solo dígitos.          */
  var CONFIG = {
    whatsapp: '51999999999',           // ← reemplazar por el real
    instagram: 'https://instagram.com/maisonliamblue',
    tiktok: 'https://tiktok.com/@maisonliamblue',
    saludo: 'Hola Liam Blue, vengo desde la web y quiero consultar por'
  };

  var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) {
    return Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  };

  /* ── 1. Enlaces de WhatsApp ───────────────────────────────────
     Cualquier elemento con data-wasap se convierte en un enlace
     con el mensaje ya escrito. Si trae texto, se añade al saludo. */
  function enlaceWasap(detalle) {
    var texto = CONFIG.saludo + ' ' + (detalle || 'sus colecciones') + '.';
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(texto);
  }

  function montarWasap() {
    $$('[data-wasap]').forEach(function (el) {
      el.setAttribute('href', enlaceWasap(el.getAttribute('data-wasap')));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });

    $$('[data-red="instagram"]').forEach(function (el) {
      el.setAttribute('href', CONFIG.instagram);
    });
    $$('[data-red="tiktok"]').forEach(function (el) {
      el.setAttribute('href', CONFIG.tiktok);
    });
  }

  /* ── 2. Barra de navegación ───────────────────────────────────
     Sobre el hero flota transparente; pasado el umbral toma fondo
     ivory. Solo aplica donde hay hero: las páginas interiores ya
     nacen con la barra sólida.                                    */
  function montarNav() {
    var nav = $('.nav');
    if (!nav) return;

    if (!nav.classList.contains('nav--solida')) {
      var alSCroll = function () {
        nav.classList.toggle('compacta', window.scrollY > window.innerHeight * 0.12);
      };
      window.addEventListener('scroll', alSCroll, { passive: true });
      alSCroll();
    }

    var boton = $('.nav__hamburguesa', nav);
    var menu  = $('.nav__menu', nav);
    if (!boton || !menu) return;

    var alternar = function (abrir) {
      boton.setAttribute('aria-expanded', String(abrir));
      menu.classList.toggle('abierto', abrir);
      document.body.classList.toggle('menu-abierto', abrir);
    };

    boton.addEventListener('click', function () {
      alternar(boton.getAttribute('aria-expanded') !== 'true');
    });

    // Al elegir una sección el menú debe desaparecer solo.
    $$('a', menu).forEach(function (a) {
      a.addEventListener('click', function () { alternar(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') alternar(false);
    });
  }

  /* ── 3. Aparición al hacer scroll ─────────────────────────────
     IntersectionObserver en vez de escuchar scroll: el navegador
     hace el cálculo fuera del hilo principal y no hay saltos.     */
  function montarRevelado() {
    var objetivos = $$('.revelar');
    if (!objetivos.length) return;

    // Sin soporte o con movimiento reducido, todo visible de una.
    var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducido || !('IntersectionObserver' in window)) {
      objetivos.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (!entrada.isIntersecting) return;
        entrada.target.classList.add('visible');
        observador.unobserve(entrada.target);   // una sola vez
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    objetivos.forEach(function (el) { observador.observe(el); });
  }

  /* ── 4. Filtros del catálogo ──────────────────────────────────
     Filtra por las líneas de la arquitectura de marca (pág. 19):
     Woman, Accessories, Beauty, Parfums.                          */
  function montarFiltros() {
    var barra = $('.filtros');
    if (!barra) return;

    var botones   = $$('.filtro', barra);
    var productos = $$('[data-linea]');
    var vacio     = $('.sin-resultados');

    botones.forEach(function (boton) {
      boton.addEventListener('click', function () {
        var linea = boton.dataset.filtro;

        botones.forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === boton));
        });

        var visibles = 0;
        productos.forEach(function (p) {
          var mostrar = linea === 'todo' || p.dataset.linea === linea;
          p.hidden = !mostrar;
          if (mostrar) visibles++;
        });

        if (vacio) vacio.hidden = visibles > 0;
      });
    });
  }

  /* ── 5. Año del pie ───────────────────────────────────────────
     Escrito por JS para que el aviso legal no envejezca solo.     */
  function montarAnio() {
    $$('[data-anio]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  /* ── 6. Formulario de contacto ────────────────────────────────
     El sitio es estático, así que no hay servidor que reciba el
     envío: se arma el mensaje y se abre WhatsApp, que es el canal
     de conversión que define el manual. Para recibirlo por correo
     en su lugar, ver el README.                                   */
  function montarFormulario() {
    var form = $('#form-contacto');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var datos = new FormData(form);
      var lineas = [
        'Hola Maison Liam Blue',
        '',
        'Nombre: ' + (datos.get('nombre') || ''),
        'Motivo: ' + (datos.get('motivo') || ''),
        '',
        datos.get('mensaje') || ''
      ];

      var correo = (datos.get('correo') || '').trim();
      if (correo) lineas.splice(3, 0, 'Correo: ' + correo);

      var url = 'https://wa.me/' + CONFIG.whatsapp +
                '?text=' + encodeURIComponent(lineas.join('\n'));

      window.open(url, '_blank', 'noopener');

      var aviso = $('#form-estado');
      if (aviso) {
        aviso.textContent = 'Abrimos WhatsApp con tu mensaje listo para enviar. ' +
                            'Si no se abrió, escríbenos directamente.';
        aviso.hidden = false;
      }
    });
  }

  /* ── Arranque ─────────────────────────────────────────────────── */
  function iniciar() {
    montarWasap();
    montarNav();
    montarRevelado();
    montarFiltros();
    montarAnio();
    montarFormulario();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
