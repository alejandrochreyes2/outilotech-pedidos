#!/bin/bash
# bootstrap-oracle.sh - Configura todos los secrets en GitHub y lanza el despliegue
set -e

echo "🔧 Bootstrap para Oracle Cloud Free Tier - OutilTech"
echo "====================================================="
echo "Este script configurará los secrets necesarios en GitHub"
echo "y lanzará el workflow de despliegue."
echo ""

# Verificar gh
if ! command -v gh &> /dev/null; then
  echo "❌ GitHub CLI (gh) no está instalado. Instálalo desde https://cli.github.com/"
  exit 1
fi

# Verificar autenticación en GitHub
if ! gh auth status &> /dev/null; then
  echo "❌ No autenticado en GitHub. Ejecuta 'gh auth login' primero."
  exit 1
fi

# Solicitar credenciales de Oracle Cloud
echo ""
echo "📡 Credenciales de Oracle Cloud (Always Free):"
read -p "Tenancy OCID: " OCI_TENANCY_OCID
read -p "Home Region (ej. us-ashburn-1): " OCI_HOME_REGION
read -p "API Key Fingerprint: " OCI_API_FINGERPRINT
echo "Pega el contenido de la API Private Key (termina con '-----END PRIVATE KEY-----'):"
OCI_API_PRIVATE_KEY=$(cat)
read -p "Ruta a tu clave pública SSH (ej. ~/.ssh/id_rsa.pub): " SSH_PUB_KEY_PATH
OCI_SSH_PUBLIC_KEY=$(cat "$SSH_PUB_KEY_PATH")
read -p "Correo para alertas de presupuesto: " OCI_ALERT_EMAIL

# Solicitar credenciales de bases de datos actuales
echo ""
echo "🗄️ Credenciales de bases de datos actuales (Supabase y MongoDB):"
read -p "Supabase URL (ej. https://tuproyecto.supabase.co): " SUPABASE_URL
read -p "Supabase Anon Key: " SUPABASE_ANON_KEY
read -p "MongoDB Atlas URI (mongodb+srv://...): " MONGODB_URI

# Crear secrets en GitHub
echo ""
echo "🔐 Creando secrets en GitHub..."
echo "$OCI_TENANCY_OCID" | gh secret set OCI_TENANCY_OCID
echo "$OCI_HOME_REGION" | gh secret set OCI_HOME_REGION
echo "$OCI_API_FINGERPRINT" | gh secret set OCI_API_FINGERPRINT
echo "$OCI_API_PRIVATE_KEY" | gh secret set OCI_API_PRIVATE_KEY
echo "$OCI_SSH_PUBLIC_KEY" | gh secret set OCI_SSH_PUBLIC_KEY
echo "$OCI_ALERT_EMAIL" | gh secret set OCI_ALERT_EMAIL
echo "$SUPABASE_URL" | gh secret set SUPABASE_URL
echo "$SUPABASE_ANON_KEY" | gh secret set SUPABASE_ANON_KEY
echo "$MONGODB_URI" | gh secret set MONGODB_URI

echo "✅ Secrets configurados correctamente."

# Lanzar el workflow
echo ""
echo "🚀 Lanzando workflow de despliegue..."
gh workflow run deploy-backend-oracle.yml

echo ""
echo "✅ Bootstrap completado. Puedes monitorear el progreso en:"
echo "   https://github.com/alejandrochreyes2/outilotech-pedidos/actions"
