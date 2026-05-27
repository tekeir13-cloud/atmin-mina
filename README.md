# ATMIN — Instrucciones de despliegue en Vercel

## ¿Qué hay en esta carpeta?
- `index.html` — La aplicación completa ATMIN
- `vercel.json` — Configuración para Vercel
- `README.md` — Este archivo

---

## PASO 1 — Sube esta carpeta a GitHub

1. Ve a https://github.com y crea una cuenta si no tienes
2. Clic en **"New repository"**
3. Nombre: `atmin-mina` (o el que quieras)
4. Deja todo por defecto → clic **"Create repository"**
5. En la página del repo vacío, verás opciones. Elige **"uploading an existing file"**
6. Arrastra los 3 archivos: `index.html`, `vercel.json`, `README.md`
7. Clic **"Commit changes"**

---

## PASO 2 — Conecta GitHub con Vercel

1. Ve a https://vercel.com
2. Clic **"Add New Project"**
3. Conecta tu cuenta de GitHub
4. Selecciona el repositorio `atmin-mina`
5. Vercel detectará automáticamente la configuración
6. Clic **"Deploy"**

⏱ En menos de 1 minuto tendrás una URL tipo:
`https://atmin-mina.vercel.app`

---

## PASO 3 — Dominio personalizado (opcional)

En el dashboard de Vercel → Settings → Domains
Puedes agregar tu propio dominio como `atmin.tuempresa.com`

---

## PRÓXIMO PASO — Conectar Supabase

Una vez publicado en Vercel, el siguiente paso es conectar
Supabase para que los datos se guarden en la nube y no se
pierdan al recargar la página.

Para eso necesitarás:
1. Tu **Project URL** de Supabase (Settings → API)
2. Tu **anon/public key** de Supabase (Settings → API)

Con esos dos datos se actualiza el index.html y listo.
