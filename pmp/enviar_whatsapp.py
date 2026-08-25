#!/usr/bin/env python3
"""Envia por WhatsApp el resumen PMP que toca segun la fecha.

Uso:
    python3 pmp/enviar_whatsapp.py                 # el dia que corresponde a hoy
    python3 pmp/enviar_whatsapp.py --dia 5         # forzar un dia concreto
    python3 pmp/enviar_whatsapp.py --dia 5 --seco  # imprimir sin enviar

Proveedores (variable PMP_PROVIDER):
    callmebot -> CALLMEBOT_PHONE, CALLMEBOT_APIKEY
    twilio    -> TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM, TWILIO_TO
"""

import argparse
import base64
import datetime as dt
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

RAIZ = os.path.dirname(os.path.abspath(__file__))
TEMARIO = os.path.join(RAIZ, "temario")

# Dia 1 del plan. El dia 24 es el dia del examen.
INICIO = dt.date(2026, 8, 25)
EXAMEN = dt.date(2026, 9, 17)

SEPARADOR = "---MSG---"
MAX_CHARS = 1200          # por mensaje de WhatsApp
PAUSA_ENTRE_MENSAJES = 6  # segundos


def dia_de_hoy(hoy):
    return (hoy - INICIO).days + 1


def leer_dia(numero):
    ruta = os.path.join(TEMARIO, "dia-%02d.md" % numero)
    if not os.path.exists(ruta):
        return None
    with open(ruta, encoding="utf-8") as f:
        return f.read().strip()


def partir(texto):
    """Trocea el texto en mensajes: primero por el separador, luego por tamano."""
    mensajes = []
    for bloque in texto.split(SEPARADOR):
        bloque = bloque.strip()
        if not bloque:
            continue
        if len(bloque) <= MAX_CHARS:
            mensajes.append(bloque)
            continue
        actual = ""
        for linea in bloque.split("\n"):
            if len(actual) + len(linea) + 1 > MAX_CHARS and actual:
                mensajes.append(actual.strip())
                actual = ""
            actual += linea + "\n"
        if actual.strip():
            mensajes.append(actual.strip())
    return mensajes


def _peticion(req, intentos=4):
    espera = 2
    ultimo = None
    for intento in range(1, intentos + 1):
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.status, r.read().decode("utf-8", "replace")[:300]
        except urllib.error.HTTPError as e:
            cuerpo = e.read().decode("utf-8", "replace")[:300]
            ultimo = "HTTP %s: %s" % (e.code, cuerpo)
            if e.code < 500 and e.code != 429:
                raise RuntimeError(ultimo)
        except Exception as e:  # red, timeout, DNS
            ultimo = str(e)
        if intento < intentos:
            print("  reintento %d tras %ds (%s)" % (intento, espera, ultimo))
            time.sleep(espera)
            espera *= 2
    raise RuntimeError("fallo tras %d intentos: %s" % (intentos, ultimo))


def enviar_callmebot(texto):
    telefono = os.environ["CALLMEBOT_PHONE"]
    apikey = os.environ["CALLMEBOT_APIKEY"]
    url = "https://api.callmebot.com/whatsapp.php?" + urllib.parse.urlencode(
        {"phone": telefono, "text": texto, "apikey": apikey}
    )
    req = urllib.request.Request(url, headers={"User-Agent": "pmp-agente/1.0"})
    return _peticion(req)


def enviar_twilio(texto):
    sid = os.environ["TWILIO_ACCOUNT_SID"]
    token = os.environ["TWILIO_AUTH_TOKEN"]
    datos = urllib.parse.urlencode(
        {
            "From": "whatsapp:" + os.environ["TWILIO_FROM"].replace("whatsapp:", ""),
            "To": "whatsapp:" + os.environ["TWILIO_TO"].replace("whatsapp:", ""),
            "Body": texto,
        }
    ).encode()
    auth = base64.b64encode(("%s:%s" % (sid, token)).encode()).decode()
    req = urllib.request.Request(
        "https://api.twilio.com/2010-04-01/Accounts/%s/Messages.json" % sid,
        data=datos,
        headers={"Authorization": "Basic " + auth,
                 "Content-Type": "application/x-www-form-urlencoded"},
    )
    return _peticion(req)


PROVEEDORES = {"callmebot": enviar_callmebot, "twilio": enviar_twilio}


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--dia", type=int, help="numero de dia del plan (1-24)")
    p.add_argument("--fecha", help="calcular el dia a partir de esta fecha (YYYY-MM-DD)")
    p.add_argument("--seco", action="store_true", help="imprimir sin enviar")
    args = p.parse_args()

    if args.dia:
        numero = args.dia
    else:
        hoy = dt.date.fromisoformat(args.fecha) if args.fecha else dt.date.today()
        numero = dia_de_hoy(hoy)

    if numero < 1:
        print("El plan arranca el %s. Nada que enviar todavia." % INICIO)
        return 0

    texto = leer_dia(numero)
    if texto is None:
        print("Dia %d fuera del plan (el examen fue el %s). Nada que enviar." % (numero, EXAMEN))
        return 0

    mensajes = partir(texto)
    proveedor = os.environ.get("PMP_PROVIDER", "callmebot").strip().lower()

    if args.seco or proveedor in ("seco", "dry-run", ""):
        for i, m in enumerate(mensajes, 1):
            print("----- mensaje %d/%d (%d caracteres) -----" % (i, len(mensajes), len(m)))
            print(m)
        return 0

    if proveedor not in PROVEEDORES:
        print("PMP_PROVIDER desconocido: %r" % proveedor, file=sys.stderr)
        return 1

    envia = PROVEEDORES[proveedor]
    for i, m in enumerate(mensajes, 1):
        estado, cuerpo = envia(m)
        print("mensaje %d/%d enviado (%d caracteres, HTTP %s)" % (i, len(mensajes), len(m), estado))
        if i < len(mensajes):
            time.sleep(PAUSA_ENTRE_MENSAJES)
    print("Dia %d enviado: %d mensajes." % (numero, len(mensajes)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
