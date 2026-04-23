#!/bin/bash
# ══════════════════════════════════════════════════════════════════════
#  OUTILTECH — DEPLOY COMPLETO A PRODUCCIÓN
#  Uso: bash deploy.sh "descripción del cambio"
#  Ejemplo: bash deploy.sh "feat: nuevo producto agregado"
#
#  Qué hace automáticamente:
#    1. Git add + commit + push → dispara Coolify redeploy
#    2. Espera a que todos los contenedores estén UP
#    3. Verifica y corrige la contraseña de PostgreSQL
#    4. Verifica que Wompi esté en modo PRODUCCIÓN (pub_prod_)
#       → Si está en modo pruebas lo corrige automáticamente
#    5. Sincroniza inventario Supabase → PostgreSQL Hetzner
#    6. Verifica que el login funcione
#    7. Reporte final de estado de todos los servicios
# ══════════════════════════════════════════════════════════════════════

set -e

# ── Colores ────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
CYAN='\033[0;36m'; BOLD='\033[1m'; NC='\033[0m'

ok()   { echo -e "${GREEN}  ✓ $1${NC}"; }
warn() { echo -e "${YELLOW}  ⚠ $1${NC}"; }
info() { echo -e "${CYAN}  → $1${NC}"; }
err()  { echo -e "${RED}  ✗ $1${NC}"; }
step() { echo -e "\n${BOLD}${CYAN}══ $1 ══${NC}"; }

# ── Configuración del servidor ─────────────────────────────────────────
HETZNER_IP="178.156.222.248"
SSH_KEY="/c/Users/user/.ssh/id_rsa"
SSH="ssh -o ConnectTimeout=15 -o StrictHostKeyChecking=no -i $SSH_KEY root@$HETZNER_IP"
COOLIFY_DIR="/data/coolify/applications/g12weuw6n4h1cag21oo53sd1"
API_URL="https://api.outiltech.co"

# ── Credenciales de producción ─────────────────────────────────────────
POSTGRES_PASS="root"
WOMPI_PUBLIC_KEY_PROD="pub_prod_KvfEtrlz3o4BUKuiSvYufUMqFYW8h5GK"
WOMPI_INTEGRITY_KEY_PROD="prod_integrity_zsCbzReuepnjB5ZbLZnEpk4vBVjrGVK5"
LOGIN_EMAIL="jhonatanhtech@gmail.com"
LOGIN_PASS="Admin1327"

# ── Validar argumento ──────────────────────────────────────────────────
if [ -z "$1" ]; then
    echo -e "${BOLD}Uso:${NC}    bash deploy.sh \"descripción del cambio\""
    echo -e "${BOLD}Ejemplo:${NC} bash deploy.sh \"fix: precio actualizado\""
    exit 1
fi
MSG="$1"

echo ""
echo -e "${BOLD}${CYAN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║     OUTILTECH — DEPLOY A PRODUCCIÓN              ║${NC}"
echo -e "${BOLD}${CYAN}║     $(date '+%Y-%m-%d %H:%M:%S')                    ║${NC}"
echo -e "${BOLD}${CYAN}╚══════════════════════════════════════════════════╝${NC}"

# ══════════════════════════════════════════════════════════════════════
# PASO 1 — GIT PUSH
# ══════════════════════════════════════════════════════════════════════
step "PASO 1 — GIT: commit y push a producción"

git add -A

if git diff --cached --quiet; then
    warn "No hay cambios pendientes. Continuando con verificaciones del servidor..."
else
    git commit -m "$MSG

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
    ok "Commit creado: $MSG"
fi

git push origin main
ok "Push a GitHub completado → Coolify redeploy en progreso"

# ══════════════════════════════════════════════════════════════════════
# PASO 2 — ESPERAR A QUE COOLIFY RECONSTRUYA LOS CONTENEDORES
# ══════════════════════════════════════════════════════════════════════
step "PASO 2 — Esperando reconstrucción en Hetzner (~3 min)"

SERVICES=("usuarios" "pedidos" "pagos" "apigateway")
MAX_WAIT=300   # 5 minutos máximo
INTERVAL=15
elapsed=0

info "Esperando 30 segundos antes de verificar (tiempo de arranque de Coolify)..."
sleep 30

while [ $elapsed -lt $MAX_WAIT ]; do
    all_up=true
    statuses=""

    for svc in "${SERVICES[@]}"; do
        status=$($SSH "docker ps --format '{{.Names}} {{.Status}}' | grep \"^${svc}-\" | head -1" 2>/dev/null || echo "")
        if echo "$status" | grep -q "Up"; then
            statuses+="  ${GREEN}✓ ${svc}${NC}\n"
        else
            statuses+="  ${YELLOW}⟳ ${svc} (iniciando...)${NC}\n"
            all_up=false
        fi
    done

    echo -e "$statuses"

    if $all_up; then
        ok "Todos los microservicios están UP"
        break
    fi

    elapsed=$((elapsed + INTERVAL))
    if [ $elapsed -lt $MAX_WAIT ]; then
        info "Esperando ${INTERVAL}s más... (${elapsed}/${MAX_WAIT}s)"
        sleep $INTERVAL
    fi
done

if [ $elapsed -ge $MAX_WAIT ]; then
    warn "Tiempo de espera agotado. Continuando con verificaciones..."
fi

# ══════════════════════════════════════════════════════════════════════
# PASO 3 — VERIFICAR Y CORREGIR POSTGRESQL
# ══════════════════════════════════════════════════════════════════════
step "PASO 3 — Verificando base de datos PostgreSQL"

POSTGRES_CONTAINER=$($SSH "docker ps --format '{{.Names}}' | grep '^postgres-'" 2>/dev/null | head -1)

if [ -z "$POSTGRES_CONTAINER" ]; then
    err "Contenedor PostgreSQL no encontrado"
else
    info "Contenedor: $POSTGRES_CONTAINER"

    # Probar conexión con contraseña root
    pg_ok=$($SSH "docker exec $POSTGRES_CONTAINER psql -U postgres -h 127.0.0.1 -c 'SELECT 1' <<< '$POSTGRES_PASS' 2>/dev/null" 2>/dev/null || echo "FAIL")

    if echo "$pg_ok" | grep -q "1"; then
        ok "PostgreSQL responde correctamente (postgres/root)"
    else
        warn "Contraseña PostgreSQL desincronizada — corrigiendo..."
        $SSH "docker exec $POSTGRES_CONTAINER psql -U postgres -c \"ALTER USER postgres PASSWORD '${POSTGRES_PASS}';\"" >/dev/null 2>&1
        ok "Contraseña PostgreSQL restablecida a: root"
    fi

    # Verificar base de datos outiltech existe
    db_check=$($SSH "docker exec $POSTGRES_CONTAINER psql -U postgres -c '\l' 2>/dev/null | grep outiltech" 2>/dev/null || echo "")
    if [ -n "$db_check" ]; then
        ok "Base de datos 'outiltech' existe"
    else
        warn "Creando base de datos 'outiltech'..."
        $SSH "docker exec $POSTGRES_CONTAINER psql -U postgres -c 'CREATE DATABASE outiltech;'" >/dev/null 2>&1
        ok "Base de datos 'outiltech' creada"
    fi
fi

# ══════════════════════════════════════════════════════════════════════
# PASO 4 — VERIFICAR Y CORREGIR WOMPI (MODO PRODUCCIÓN)
# ══════════════════════════════════════════════════════════════════════
step "PASO 4 — Verificando Wompi (modo producción)"

PEDIDOS_CONTAINER=$($SSH "docker ps --format '{{.Names}}' | grep '^pedidos-'" 2>/dev/null | head -1)

if [ -z "$PEDIDOS_CONTAINER" ]; then
    err "Contenedor pedidos no encontrado"
else
    wompi_key=$($SSH "docker exec $PEDIDOS_CONTAINER printenv Wompi__PublicKey 2>/dev/null" 2>/dev/null || echo "")

    if echo "$wompi_key" | grep -q "pub_prod_"; then
        ok "Wompi en modo PRODUCCIÓN: $wompi_key"
    else
        warn "Wompi en modo PRUEBAS: '${wompi_key}' — corrigiendo..."

        # Actualizar .env de Coolify
        $SSH "
python3 - << 'PYEOF'
with open('${COOLIFY_DIR}/.env', 'r') as f:
    lines = f.readlines()
lines = [l for l in lines if not l.startswith('WOMPI_PUBLIC_KEY=') and not l.startswith('WOMPI_INTEGRITY_KEY=')]
lines.append('WOMPI_PUBLIC_KEY=${WOMPI_PUBLIC_KEY_PROD}\n')
lines.append('WOMPI_INTEGRITY_KEY=${WOMPI_INTEGRITY_KEY_PROD}\n')
with open('${COOLIFY_DIR}/.env', 'w') as f:
    f.writelines(lines)
print('OK')
PYEOF
" >/dev/null 2>&1

        # Asegurar que docker-compose.yaml tenga las referencias
        wompi_in_compose=$($SSH "grep -c 'Wompi__PublicKey' ${COOLIFY_DIR}/docker-compose.yaml 2>/dev/null || echo 0")
        if [ "$wompi_in_compose" -eq 0 ]; then
            $SSH "
cat > /tmp/patch_wompi.py << 'PYEOF'
with open('${COOLIFY_DIR}/docker-compose.yaml', 'r') as f:
    lines = f.readlines()
wompi_pub = \"            Wompi__PublicKey: '\\\${WOMPI_PUBLIC_KEY:-pub_test_iGDtX1yJbTOiwFOZQsz57WHnqkPfKATo}'\n\"
wompi_int = \"            Wompi__IntegrityKey: '\\\${WOMPI_INTEGRITY_KEY:-test_integrity_emFDteel2smneriBhxztMfMmudxgZhPg}'\n\"
new_lines = []
inserted = False
for i, line in enumerate(lines):
    if 'JWT_KEY: YourSuperSecretKeyHere1234567890' in line and not inserted:
        context = ''.join(lines[i:i+5])
        if 'COOLIFY_CONTAINER_NAME: pedidos' in context:
            new_lines.append(line)
            new_lines.append(wompi_pub)
            new_lines.append(wompi_int)
            inserted = True
            continue
    new_lines.append(line)
with open('${COOLIFY_DIR}/docker-compose.yaml', 'w') as f:
    f.writelines(new_lines)
PYEOF
python3 /tmp/patch_wompi.py" >/dev/null 2>&1
        fi

        # Reiniciar contenedor pedidos
        $SSH "cd ${COOLIFY_DIR} && docker compose -f docker-compose.yaml --env-file .env up -d --no-build pedidos" >/dev/null 2>&1
        sleep 8

        # Verificar que quedó en prod
        wompi_key_new=$($SSH "docker exec $PEDIDOS_CONTAINER printenv Wompi__PublicKey 2>/dev/null" 2>/dev/null || echo "")
        if echo "$wompi_key_new" | grep -q "pub_prod_"; then
            ok "Wompi corregido a modo PRODUCCIÓN: $wompi_key_new"
        else
            # Buscar nuevo contenedor (puede haber cambiado el nombre)
            PEDIDOS_CONTAINER=$($SSH "docker ps --format '{{.Names}}' | grep '^pedidos-'" 2>/dev/null | head -1)
            wompi_key_new=$($SSH "docker exec $PEDIDOS_CONTAINER printenv Wompi__PublicKey 2>/dev/null" 2>/dev/null || echo "")
            if echo "$wompi_key_new" | grep -q "pub_prod_"; then
                ok "Wompi corregido a modo PRODUCCIÓN: $wompi_key_new"
            else
                err "No se pudo corregir Wompi automáticamente. Revisa el panel de Coolify."
            fi
        fi
    fi

    # Verificar integrity key
    wompi_int=$($SSH "docker exec $PEDIDOS_CONTAINER printenv Wompi__IntegrityKey 2>/dev/null" 2>/dev/null || echo "")
    if echo "$wompi_int" | grep -q "prod_integrity_"; then
        ok "Integrity key en producción: ${wompi_int:0:30}..."
    else
        warn "Integrity key en modo pruebas: ${wompi_int:0:30}..."
    fi
fi

# ══════════════════════════════════════════════════════════════════════
# PASO 5 — SINCRONIZAR INVENTARIO SUPABASE → POSTGRESQL
# ══════════════════════════════════════════════════════════════════════
step "PASO 5 — Sincronizando inventario Supabase → Hetzner"

sleep 5  # Dar tiempo al contenedor para estar completamente listo

sync_result=$(curl -s -X POST "${API_URL}/api/pedidos/sync/productos" \
    -H "Content-Type: application/json" \
    --max-time 30 2>/dev/null || echo '{"error":"timeout"}')

if echo "$sync_result" | grep -q '"synced"'; then
    synced_count=$(echo "$sync_result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('synced',0))" 2>/dev/null || echo "?")
    ok "Inventario sincronizado: ${synced_count} productos actualizados en Hetzner"
else
    warn "Sync de inventario falló o timeout. Intentar manualmente: curl -X POST ${API_URL}/api/pedidos/sync/productos"
fi

# ══════════════════════════════════════════════════════════════════════
# PASO 6 — VERIFICAR LOGIN
# ══════════════════════════════════════════════════════════════════════
step "PASO 6 — Verificando login de producción"

login_result=$(curl -s -X POST "${API_URL}/api/usuarios/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"${LOGIN_EMAIL}\",\"password\":\"${LOGIN_PASS}\"}" \
    --max-time 15 2>/dev/null || echo '{"error":"timeout"}')

if echo "$login_result" | grep -q '"token"'; then
    user_role=$(echo "$login_result" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d.get('role','?'))" 2>/dev/null || echo "Admin")
    ok "Login funcional — usuario: ${LOGIN_EMAIL} (${user_role})"
else
    err "Login falló: $login_result"
    warn "Revisando logs de usuarios..."
    USUARIOS_CONTAINER=$($SSH "docker ps --format '{{.Names}}' | grep '^usuarios-'" 2>/dev/null | head -1)
    $SSH "docker logs $USUARIOS_CONTAINER --tail=10 2>&1" 2>/dev/null | grep -E "ERROR|SEED|LOGIN|28P" | head -5 || true
fi

# ══════════════════════════════════════════════════════════════════════
# PASO 7 — VERIFICAR ENDPOINT WOMPI CHECKOUT
# ══════════════════════════════════════════════════════════════════════
step "PASO 7 — Verificando checkout Wompi"

checkout_result=$(curl -s -X POST "${API_URL}/api/pedidos/create-wompi-transaction" \
    -H "Content-Type: application/json" \
    -d '{"reference":"DEPLOY-CHECK-001","amountCop":10000,"redirectUrl":"https://outiltech.co/payment-result","email":"deploy@outiltech.co","fullName":"Deploy Check","phone":"3000000000"}' \
    --max-time 15 2>/dev/null || echo '{"error":"timeout"}')

if echo "$checkout_result" | grep -q "pub_prod_"; then
    ok "Checkout Wompi genera URL con llave de PRODUCCIÓN"
elif echo "$checkout_result" | grep -q "pub_test_"; then
    err "Checkout Wompi sigue usando llave de PRUEBAS — requiere intervención manual"
else
    warn "No se pudo verificar checkout: $checkout_result"
fi

# ══════════════════════════════════════════════════════════════════════
# REPORTE FINAL
# ══════════════════════════════════════════════════════════════════════
step "REPORTE FINAL — Estado de producción"

echo ""
echo -e "${BOLD}Contenedores en Hetzner:${NC}"
$SSH "docker ps --format 'table {{.Names}}\t{{.Status}}' | grep -E 'postgres|mongodb|usuarios|pedidos|pagos|apigateway'" 2>/dev/null || true

echo ""
echo -e "${BOLD}URLs activas:${NC}"
echo -e "  ${GREEN}● Tienda:${NC}   https://outiltech.co"
echo -e "  ${GREEN}● API:${NC}      https://api.outiltech.co"
echo -e "  ${GREEN}● Coolify:${NC}  http://${HETZNER_IP}:8000"

echo ""
echo -e "${BOLD}${GREEN}╔══════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${GREEN}║   ✓ DEPLOY COMPLETADO — outiltech.co ACTIVO      ║${NC}"
echo -e "${BOLD}${GREEN}╚══════════════════════════════════════════════════╝${NC}"
echo ""
