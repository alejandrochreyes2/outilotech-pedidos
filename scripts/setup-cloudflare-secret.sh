#!/bin/bash
# Este script configura el secret CLOUDFLARE_API_TOKEN en GitHub Actions
# usando la CLI de GitHub (gh). Requiere gh instalado y autenticado.

set -e

echo "🔧 Configurando secret CLOUDFLARE_API_TOKEN en GitHub..."

# Verificar si gh está instalado
if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI (gh) no está instalado. Instálalo desde https://cli.github.com/"
  exit 1
fi

# Verificar autenticación
if ! gh auth status &> /dev/null; then
  echo "❌ No estás autenticado en gh. Ejecuta 'gh auth login' primero."
  exit 1
fi

# Solicitar el token de Cloudflare
read -sp "Introduce tu CLOUDFLARE_API_TOKEN: " CF_TOKEN
echo

# Crear el secret en el repositorio actual
gh secret set CLOUDFLARE_API_TOKEN --body "$CF_TOKEN"

echo "✅ Secret CLOUDFLARE_API_TOKEN configurado correctamente."
