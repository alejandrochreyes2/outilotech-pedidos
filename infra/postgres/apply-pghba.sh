#!/bin/bash
# Este script se ejecuta automaticamente cada vez que el contenedor postgres arranca.
# Copia el pg_hba.conf correcto sobre el que genera postgres por defecto,
# luego llama pg_reload_conf() para activarlo sin reiniciar.
#
# Para que funcione, montar este script en:
#   /docker-entrypoint-initdb.d/apply-pghba.sh
# PERO ese directorio solo se ejecuta en la PRIMERA inicializacion.
#
# La alternativa usada aqui es copiar via docker cp en cada deploy (ver deploy.yml).
# Este archivo existe como documentacion y referencia.

set -e
PGDATA=${PGDATA:-/var/lib/postgresql/data}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [ -f "$SCRIPT_DIR/pg_hba.conf" ]; then
  cp "$SCRIPT_DIR/pg_hba.conf" "$PGDATA/pg_hba.conf"
  echo "[pg_hba] Aplicado trust para redes Docker internas"
fi
