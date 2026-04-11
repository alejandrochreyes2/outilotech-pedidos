#!/bin/bash

# Mostrar ayuda
if [ "$1" == "-h" ] || [ "$1" == "--help" ]; then
    echo "Uso: ./scripts/deploy.sh \"descripción de lo que hiciste\""
    echo "     ./scripts/deploy.sh --rollback"
    exit 0
fi

# Rollback
if [ "$1" == "--rollback" ]; then
    echo "⚠️ Iniciando rollback al estado anterior en main..."
    git checkout main
    
    # Busca el penúltimo commit de despliegue o simplemente da un paso atrás
    git reset --hard HEAD~1
    
    echo "Subiendo el rollback a producción con force (ten en cuenta el impacto)..."
    git push origin main --force
    echo "✅ Rollback completado."
    echo "GitHub Actions revertirá los cambios en outiltech.co."
    exit 0
fi

# Verificación de mensaje
MSG="$1"
if [ -z "$MSG" ]; then
    echo "❌ Error: Debes proporcionar una descripción de los cambios."
    echo "Ejemplo: ./scripts/deploy.sh \"feat: actualizacion de modulos\""
    exit 1
fi

# Variables
DATE=$(date +"%Y%m%d_%H%M%S")
FEATURE_BRANCH="feature/deploy-${DATE}"

echo "🚀 Iniciando proceso automático de despliegue para OutilTech..."

echo "1. Creando rama feature ($FEATURE_BRANCH) con los cambios..."
git checkout -b "$FEATURE_BRANCH"
git add .
git commit -m "$MSG"
git push origin "$FEATURE_BRANCH"

echo "2. Haciendo merge a la rama principal (main)..."
git checkout main
git pull origin main 2>/dev/null || true
git merge "$FEATURE_BRANCH" --no-ff -m "deploy: $MSG"

echo "3. Ejecutando Push para activar GitHub Actions..."
git push origin main

echo "🏷 Generando Tag de control..."
git tag -a "deploy-$DATE" -m "Despliegue automatico: $MSG"
git push origin "deploy-$DATE"

echo "======================================================="
echo "✅ Operaciones Git completadas con éxito."
echo "4. GitHub Actions detectará el push en la rama main."
echo "5. Construirá Angular en entorno de producción y desplegará."
echo "🌐 Revisa outiltech.co en 2-5 minutos."
echo "======================================================="
