#!/usr/bin/env bash
# setup-cloudflare-account-id.sh
# Este script configura automáticamente el secret CLOUDFLARE_ACCOUNT_ID en GitHub Actions

set -e

echo "🔧 Configurando CLOUDFLARE_ACCOUNT_ID en GitHub..."

# Verificar gh
if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI (gh) no está instalado. Instálalo desde https://cli.github.com/"
  exit 1
fi

# Verificar autenticación
if ! gh auth status &> /dev/null; then
  echo "❌ No autenticado en GitHub CLI. Ejecuta: gh auth login"
  exit 1
fi

# Intentar obtener el token de Cloudflare desde los secrets de GitHub
CF_TOKEN=$(gh secret list --json name,value | jq -r '.[] | select(.name == "CLOUDFLARE_API_TOKEN") | .value' 2>/dev/null || echo "")

if [ -z "$CF_TOKEN" ]; then
  echo "⚠️ No se encontró CLOUDFLARE_API_TOKEN en los secrets de GitHub."
  read -sp "Introduce tu CLOUDFLARE_API_TOKEN manualmente: " CF_TOKEN
  echo
fi

if [ -z "$CF_TOKEN" ]; then
  echo "❌ No se proporcionó token. Abortando."
  exit 1
fi

# Obtener Account ID desde Cloudflare API
echo "📡 Obteniendo Account ID desde Cloudflare..."
ACCOUNT_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/accounts" \
  -H "Authorization: Bearer $CF_TOKEN" \
  -H "Content-Type: application/json" | jq -r '.result[0].id')

if [ -z "$ACCOUNT_ID" ] || [ "$ACCOUNT_ID" = "null" ]; then
  echo "❌ No se pudo obtener el Account ID. Verifica que el token tenga permisos para leer cuentas."
  exit 1
fi

echo "✅ Account ID obtenido: $ACCOUNT_ID"

# Configurar el secret en GitHub
echo "$ACCOUNT_ID" | gh secret set CLOUDFLARE_ACCOUNT_ID

echo "✅ Secret CLOUDFLARE_ACCOUNT_ID configurado correctamente en GitHub."
