#!/bin/bash
# ─────────────────────────────────────────────
# DEPLOY FRONTEND → AZURE SWA + NETLIFY
# Uso: bash deploy.sh
# ─────────────────────────────────────────────

echo "▶ Compilando Angular..."
cd frontend
npm run build -- --configuration=production

# Asegurar _redirects para routing de Angular en Netlify
echo "/* /index.html 200" > dist/frontend/browser/_redirects

echo "▶ Subiendo a Azure Static Web Apps..."
DEPLOY_TOKEN=$(az staticwebapp secrets list \
  --name toyota-pedidos-frontend \
  --resource-group toyota-pedidos-rg \
  --query "properties.apiKey" -o tsv)

swa deploy ./dist/frontend/browser \
  --deployment-token "$DEPLOY_TOKEN" \
  --env production \
  --no-use-keychain

echo "▶ Subiendo a Netlify (yamarket)..."
NETLIFY_AUTH_TOKEN="nfp_ejwdCfNtmJLqtdKNyn63R5VXhnNEdxzveefc" \
  netlify deploy --prod \
  --dir=dist/frontend/browser \
  --site=3e88ab25-79a3-4a4d-bb9c-fb758e6d582b

cd ..
echo ""
echo "✅ Deploy completado:"
echo "   → https://yamarket.netlify.app/home"
echo "   → https://gentle-water-0ba98b90f.1.azurestaticapps.net/home"
