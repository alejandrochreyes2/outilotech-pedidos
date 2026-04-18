#!/bin/bash
# upload-ssh-key.sh
set -e
echo "🔐 Subiendo clave SSH privada a GitHub Secrets..."
read -p "Ruta a tu clave privada SSH (ej: ~/.ssh/id_rsa): " key_path
if [ ! -f "$key_path" ]; then
  echo "❌ Archivo no encontrado"
  exit 1
fi
gh secret set SSH_PRIVATE_KEY < "$key_path"
echo "✅ SSH_PRIVATE_KEY configurado"
