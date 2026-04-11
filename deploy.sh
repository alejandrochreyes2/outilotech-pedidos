#!/bin/bash
# ─────────────────────────────────────────────
# DEPLOY → GITHUB + AZURE (via GitHub Actions)
# Uso: bash deploy.sh "descripción del cambio"
# Dominio: https://outiltech.co
# ─────────────────────────────────────────────

if [ -z "$1" ]; then
    echo "Uso: bash deploy.sh \"descripción del cambio\""
    echo "Ejemplo: bash deploy.sh \"fix: sync supabase automatico\""
    exit 1
fi

# Delega al script principal que crea la feature branch, hace merge a main
# y pushea → GitHub Actions despliega automáticamente a outiltech.co
bash scripts/deploy.sh "$1"
