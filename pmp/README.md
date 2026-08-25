# Agente PMP por WhatsApp

Te manda cada dia, a tu WhatsApp, el resumen del tema que toca para llegar al
examen del **17 de septiembre**. El temario ya esta escrito (23 dias + el dia del
examen); no depende de ninguna IA en vivo ni de que haya una sesion abierta.

- `temario/dia-01.md` ... `dia-24.md` — el contenido de cada dia, ya formateado
  para WhatsApp (tema, preguntas y respuestas van en mensajes separados).
- `enviar_whatsapp.py` — calcula que dia toca segun la fecha y lo envia.
- `../.github/workflows/pmp-whatsapp.yml` — lo dispara solo, todos los dias.

El plan arranca el **25 de agosto** (dia 1) y el dia 23 cae el **16 de
septiembre**. El dia 24 es el mensaje corto de la manana del examen.

## Plan de estudio

| Dias | Contenido |
|------|-----------|
| 1-2 | Formato del examen, "modo PMI", ciclos de vida y tailoring |
| 3-4 | Manifiesto Agil, Scrum, Kanban, XP, metricas agiles |
| 5-10 | **Personas (42%)**: equipo, liderazgo, Tuckman, conflictos, interesados, comunicaciones |
| 11-19 | **Procesos (50%)**: integracion y cambios, alcance predictivo y agil, cronograma, EVM, riesgos, calidad, contratos, valor |
| 20 | **Entorno de negocio (8%)**: gobernanza, PMO, cumplimiento, EEF/OPA |
| 21 | Codigo de Etica y preguntas de "que haces primero" |
| 22-23 | Hoja de formulas, simulacro cronometrado y repaso final |
| 24 | Dia del examen |

## Puesta en marcha (10 minutos, una sola vez)

### 1. Consigue tu clave de CallMeBot (gratis)

1. Guarda en tus contactos el numero **+34 644 51 95 23**.
2. Mandale por WhatsApp el mensaje exacto:
   `I allow callmebot to send me messages`
3. Te responde con tu **apikey** (unos digitos). Ese es el permiso: sin el, nadie
   te puede escribir por ahi.

### 2. Carga los datos en GitHub

En el repo: **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valor |
|--------|-------|
| `CALLMEBOT_PHONE` | Tu numero con codigo de pais, ej. `+51987654321` |
| `CALLMEBOT_APIKEY` | La clave que te respondio CallMeBot |

### 3. Deja el workflow en la rama principal

**Importante**: GitHub solo ejecuta tareas programadas desde la rama por defecto
(`main`). Mientras el workflow viva solo en la rama de trabajo, se puede lanzar a
mano pero **no se dispara solo**. Une la rama a `main` para que el cron funcione.

### 4. Pruebalo

**Actions → PMP diario por WhatsApp → Run workflow**
- `dia`: `1` (o el que quieras ver)
- `seco`: marcado ➜ solo lo imprime en el log, sin enviar. Desmarcado ➜ te llega
  al WhatsApp.

## Cambiar la hora

En `.github/workflows/pmp-whatsapp.yml`, la linea `cron: "0 11 * * *"` esta en
**UTC**. Peru es UTC-5, asi que hay que sumar 5 horas a la hora que quieras:

| Hora en Peru | cron |
|--------------|------|
| 5:00 a.m. | `0 10 * * *` |
| 6:00 a.m. | `0 11 * * *` (actual) |
| 12:00 m. | `0 17 * * *` |
| 7:00 p.m. | `0 0 * * *` |
| 9:00 p.m. | `0 2 * * *` |

GitHub puede atrasar unos minutos el disparo cuando hay mucha carga; es normal.

## Probarlo en tu computadora

```bash
python3 pmp/enviar_whatsapp.py --dia 1 --seco     # imprime, no envia
export CALLMEBOT_PHONE=+51987654321
export CALLMEBOT_APIKEY=123456
python3 pmp/enviar_whatsapp.py --dia 1            # envia de verdad
python3 pmp/enviar_whatsapp.py --fecha 2026-09-10 # simula otra fecha
```

## Si prefieres Twilio en lugar de CallMeBot

Crea la variable de repositorio `PMP_PROVIDER` con el valor `twilio` y agrega los
secrets `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` y `TWILIO_TO`.
Twilio es de pago y, fuera de la ventana de 24 horas desde tu ultimo mensaje,
exige plantillas aprobadas por Meta: para uso personal, CallMeBot es mas simple.

## Editar el contenido

Los archivos de `temario/` son texto plano. `*texto*` sale en negrita en WhatsApp
y `_texto_` en cursiva. La linea `---MSG---` separa un mensaje del siguiente; si
un bloque pasa de 1200 caracteres, el script lo parte solo por lineas.
