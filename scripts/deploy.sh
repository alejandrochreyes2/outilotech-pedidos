#!/bin/bash
# ============================================
# OUTILTECH — Script de Deploy con Rollback
# Uso: ./scripts/deploy.sh "descripción"
# Rollback: ./scripts/deploy.sh --rollback
# ============================================

set -e
DATE=$(date +"%Y%m%d_%H%M%S")
DEPLOY_LOG="scripts/deploy_history.log"
MAIN_BRANCH="main"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()   { echo -e "${GREEN}[DEPLOY $DATE]${NC} $1" | tee -a $DEPLOY_LOG; }
error() { echo -e "${RED}[ERROR]${NC} $1" | tee -a $DEPLOY_LOG; exit 1; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1" | tee -a $DEPLOY_LOG; }
info()  { echo -e "${BLUE}[INFO]${NC} $1" | tee -a $DEPLOY_LOG; }

# ============================================
# ROLLBACK
# ============================================
if [ "$1" == "--rollback" ]; then
  warn "=== INICIANDO ROLLBACK ==="
  git fetch --tags
  info "Tags disponibles:"
  git tag -l "deploy-*" | sort -r | head -10
  echo ""
  read -p "¿A qué tag quieres hacer rollback?: " TAG_NAME
  if [ -z "$TAG_NAME" ]; then
    error "Debes especificar un tag"
  fi
  if ! git tag -l | grep -q "^$TAG_NAME$"; then
    error "El tag '$TAG_NAME' no existe"
  fi
  warn "Haciendo rollback a: $TAG_NAME"
  git checkout $MAIN_BRANCH
  git reset --hard $TAG_NAME
  git push origin $MAIN_BRANCH --force
  log "✅ ROLLBACK EXITOSO a $TAG_NAME"
  log "🌐 outiltech.co se revertirá en 2-5 minutos"
  echo "ROLLBACK: $DATE → $TAG_NAME" | tee -a $DEPLOY_LOG
  exit 0
fi

# ============================================
# DEPLOY NORMAL
# ============================================
DESCRIPTION=$1
if [ -z "$DESCRIPTION" ]; then
  error "Uso: ./scripts/deploy.sh 'descripción del cambio'"
fi

BRANCH_NAME=$(echo "$DESCRIPTION" | tr '[:upper:]' '[:lower:]' | tr ' áéíóúñ' '-aeioun' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | cut -c1-50)
FEATURE_BRANCH="feature/$DATE-$BRANCH_NAME"
TAG_PRE="deploy-$DATE-pre"
TAG_POST="deploy-$DATE-post"

log "========================================"
log "OUTILTECH DEPLOY INICIADO"
log "Descripción: $DESCRIPTION"
log "Rama: $FEATURE_BRANCH"
log "Tag rollback: $TAG_PRE"
log "========================================"

# PASO 1 — Asegura estar en main actualizado
log "PASO 1: Actualizando main..."
git checkout $MAIN_BRANCH
git pull origin $MAIN_BRANCH 2>/dev/null || true

# PASO 2 — Tag de seguridad PRE-deploy (punto de rollback)
log "PASO 2: Creando tag de seguridad pre-deploy..."
git tag -a "$TAG_PRE" -m "Pre-deploy: $DESCRIPTION"
git push origin "$TAG_PRE"
log "✅ Tag rollback creado: $TAG_PRE"

# PASO 3 — Crea rama feature con los cambios
log "PASO 3: Creando rama feature..."
git checkout -b $FEATURE_BRANCH
git add .
git commit -m "$DESCRIPTION" --allow-empty
git push origin $FEATURE_BRANCH
log "✅ Rama subida: $FEATURE_BRANCH"

# PASO 4 — Merge a main para activar deploy en Azure
log "PASO 4: Merge a main..."
git checkout $MAIN_BRANCH
git merge $FEATURE_BRANCH --no-ff -m "deploy: $DESCRIPTION"
git push origin $MAIN_BRANCH
log "✅ Merge exitoso — GitHub Actions iniciará deploy automático"

# PASO 5 — Tag POST-deploy
log "PASO 5: Creando tag post-deploy..."
git tag -a "$TAG_POST" -m "Post-deploy: $DESCRIPTION"
git push origin "$TAG_POST"
log "✅ Tag post: $TAG_POST"

# PASO 6 — Guarda en historial
echo "" >> $DEPLOY_LOG
echo "================================================" >> $DEPLOY_LOG
echo "FECHA:    $DATE" >> $DEPLOY_LOG
echo "DESC:     $DESCRIPTION" >> $DEPLOY_LOG
echo "RAMA:     $FEATURE_BRANCH" >> $DEPLOY_LOG
echo "TAG PRE:  $TAG_PRE" >> $DEPLOY_LOG
echo "TAG POST: $TAG_POST" >> $DEPLOY_LOG
echo "ROLLBACK: ./scripts/deploy.sh --rollback → $TAG_PRE" >> $DEPLOY_LOG
echo "================================================" >> $DEPLOY_LOG

log ""
log "🚀 DEPLOY COMPLETADO"
log "🌐 outiltech.co se actualizará en 2-5 minutos"
log "📋 Historial: scripts/deploy_history.log"
log ""
log "⚠️  Si algo falla ejecuta:"
log "    ./scripts/deploy.sh --rollback"
log "    → Selecciona: $TAG_PRE"
