# Manual Técnico de Pruebas — API Toyota Pedidos

---

## Arquitectura del sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENTE                                     │
│                   Angular 21 (puerto :80)                           │
│          Signals + Interceptor JWT + Guards por rol                 │
└──────────────────────────┬──────────────────────────────────────────┘
                           │  HTTP /api/**
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API GATEWAY — YARP                               │
│                       puerto :5000                                  │
│           CORS AllowAll + Health Check /health                      │
└──────┬─────────────────────┬──────────────────────┬────────────────┘
       │ /api/usuarios/**    │ /api/pedidos/**       │ /api/pagos/**
       ▼                     ▼                       ▼
┌────────────┐       ┌────────────┐         ┌────────────┐
│  USUARIOS  │       │  PEDIDOS   │         │   PAGOS    │
│  :3001     │       │  :3002     │         │  :3003     │
│ Identity   │       │ Repository │         │ Repository │
│ JWT + Seed │       │ DTOs       │         │ DTOs       │
└────────────┘       └────────────┘         └────────────┘

Red interna Docker: toyota-network
JWT compartido: Key + Issuer + Audience idénticos en los 3 microservicios
```

---

## Configuración de Postman

### Crear colección "Toyota Pedidos API"

1. Abrir Postman → clic en **"New"** → seleccionar **"Collection"**
2. Nombre: `Toyota Pedidos API`
3. Clic en **"Create"**
4. Dentro de la colección, crear carpetas: `Usuarios`, `Pedidos`, `Pagos`, `Gateway`

### Variables de entorno Postman

1. Clic en el ícono del engranaje (⚙️) en la esquina superior derecha → **"Manage Environments"**
2. Clic en **"Add"** → nombre: `Toyota Local`
3. Agregar las siguientes variables:

| Variable | Valor inicial | Descripción |
|----------|---------------|-------------|
| `base_url` | `http://localhost:5000` | URL base del Gateway |
| `token` | *(vacío — se llena automático)* | JWT del usuario actual |
| `admin_email` | `admin@toyota.com` | Email del admin Toyota |
| `admin_password` | `Admin123!` | Contraseña del admin Toyota |
| `vendedor_email` | `vendedor@toyota.com` | Email del vendedor |
| `vendedor_password` | `Vend123!` | Contraseña del vendedor |
| `user_email` | `user@user.com` | Email del usuario básico |
| `user_password` | `User@123` | Contraseña del usuario básico |

4. Clic en **"Save"** y seleccionar el entorno `Toyota Local` en el dropdown superior derecho

### Script automático de token (Test del login)

En el request de login (TEST 1), ir a la pestaña **"Tests"** y pegar:

```javascript
pm.test("Login exitoso", () => {
    pm.response.to.have.status(200);
    const json = pm.response.json();
    pm.environment.set("token", json.token);
    console.log("Token guardado:", json.token);
    console.log("Rol:", json.role);
});
```

---

## Pruebas por microservicio

---

### MICROSERVICIO USUARIOS
**Directo:** `http://localhost:3001`
**Via Gateway:** `http://localhost:5000/api/usuarios`
**Swagger:** `http://localhost:3001/swagger`

---

#### TEST 1 — Login Admin Toyota
```
Método:  POST
URL:     {{base_url}}/api/usuarios/auth/login
Headers: Content-Type: application/json
Body (raw JSON):
{
  "email": "admin@toyota.com",
  "password": "Admin123!"
}
```
**Resultado esperado:** `200 OK`
```json
{
  "email": "admin@toyota.com",
  "fullName": "Admin Toyota",
  "role": "Admin",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```
> El script de Tests guarda el token en `{{token}}` automáticamente.

---

#### TEST 2 — Login Vendedor
```
Método:  POST
URL:     {{base_url}}/api/usuarios/auth/login
Body:    { "email": "vendedor@toyota.com", "password": "Vend123!" }
```
**Resultado esperado:** `200 OK` con `"role": "Vendedor"`

---

#### TEST 3 — Login credenciales incorrectas
```
Método:  POST
URL:     {{base_url}}/api/usuarios/auth/login
Body:    { "email": "admin@toyota.com", "password": "wrongpassword" }
```
**Resultado esperado:** `401 Unauthorized`

---

#### TEST 4 — Registro nuevo usuario
```
Método:  POST
URL:     {{base_url}}/api/usuarios/auth/register
Headers: Content-Type: application/json
Body:
{
  "email": "nuevo@test.com",
  "password": "Test@123",
  "fullName": "Test User"
}
```
**Resultado esperado:** `200 OK`
```json
{ "message": "Usuario creado" }
```

---

#### TEST 5 — Health check Usuarios
```
Método:  GET
URL:     {{base_url}}/api/usuarios/health
```
**Resultado esperado:** `200 OK` — body: `Healthy`

---

### MICROSERVICIO PEDIDOS
**Directo:** `http://localhost:3002`
**Via Gateway:** `http://localhost:5000/api/pedidos`
**Swagger:** `http://localhost:3002/swagger`

---

#### TEST 6 — Ver pedidos SIN token
```
Método:  GET
URL:     {{base_url}}/api/pedidos
```
**Resultado esperado:** `401 Unauthorized`

---

#### TEST 7 — Ver pedidos CON token Admin
```
Método:  GET
URL:     {{base_url}}/api/pedidos
Headers: Authorization: Bearer {{token}}
```
**Resultado esperado:** `200 OK`
```json
[
  { "id": 1, "cliente": "Toyota Colombia", "total": 150000, "fecha": "..." }
]
```

---

#### TEST 8 — Crear pedido como Admin
```
Método:  POST
URL:     {{base_url}}/api/pedidos
Headers: Authorization: Bearer {{token}}
         Content-Type: application/json
Body:
{
  "cliente": "Toyota Colombia",
  "total": 150000
}
```
**Resultado esperado:** `201 Created`
```json
{ "id": 1, "cliente": "Toyota Colombia", "total": 150000, "fecha": "..." }
```

---

#### TEST 9 — Crear pedido como Vendedor
1. Primero ejecutar TEST 2 (login vendedor) para obtener token de vendedor
2. Copiar el token manualmente o crear variable `token_vendedor`
```
Método:  POST
URL:     {{base_url}}/api/pedidos
Headers: Authorization: Bearer <token_vendedor>
Body:    { "cliente": "Cliente Vendedor", "total": 50000 }
```
**Resultado esperado:** `201 Created` (Vendedor SÍ puede crear pedidos)

---

#### TEST 10 — Crear pedido como User (sin permiso)
1. Login como `user@user.com / User@123`
2. Usar ese token:
```
Método:  POST
URL:     {{base_url}}/api/pedidos
Headers: Authorization: Bearer <token_user>
Body:    { "cliente": "Test", "total": 1000 }
```
**Resultado esperado:** `403 Forbidden`

---

#### TEST 11 — Health check Pedidos
```
Método:  GET
URL:     {{base_url}}/api/pedidos/health
```
**Resultado esperado:** `200 OK` — body: `Healthy`

---

### MICROSERVICIO PAGOS
**Directo:** `http://localhost:3003`
**Via Gateway:** `http://localhost:5000/api/pagos`
**Swagger:** `http://localhost:3003/swagger`

---

#### TEST 12 — Ver pagos SIN token
```
Método:  GET
URL:     {{base_url}}/api/pagos
```
**Resultado esperado:** `401 Unauthorized`

---

#### TEST 13 — Ver pagos como Admin
```
Método:  GET
URL:     {{base_url}}/api/pagos
Headers: Authorization: Bearer {{token}}   ← token de Admin
```
**Resultado esperado:** `200 OK` + array de pagos

---

#### TEST 14 — Ver pagos como Vendedor (sin permiso)
```
Método:  GET
URL:     {{base_url}}/api/pagos
Headers: Authorization: Bearer <token_vendedor>
```
**Resultado esperado:** `403 Forbidden`

---

#### TEST 15 — Registrar pago como Admin
```
Método:  POST
URL:     {{base_url}}/api/pagos
Headers: Authorization: Bearer {{token}}
         Content-Type: application/json
Body:
{
  "pedidoId": 1,
  "monto": 150000
}
```
**Resultado esperado:** `201 Created`
```json
{ "id": 1, "pedidoId": 1, "monto": 150000, "estado": "Pendiente", "fecha": "..." }
```

---

#### TEST 16 — Registrar pago como Vendedor (sin permiso)
```
Método:  POST
URL:     {{base_url}}/api/pagos
Headers: Authorization: Bearer <token_vendedor>
Body:    { "pedidoId": 1, "monto": 50000 }
```
**Resultado esperado:** `403 Forbidden`

---

### API GATEWAY YARP

---

#### TEST 17 — Health check Gateway
```
Método:  GET
URL:     {{base_url}}/health
```
**Resultado esperado:** `200 OK` — body: `Healthy`

---

#### TEST 18 — Verificar enrutamiento completo
Si los TEST 6–16 pasaron a través de `{{base_url}}` (puerto 5000),
el enrutamiento YARP está funcionando correctamente.

Rutas configuradas en Gateway:
```
/api/usuarios/** → http://usuarios:3001
/api/pedidos/**  → http://pedidos:3002
/api/pagos/**    → http://pagos:3003
```

---

## Pruebas en Azure (producción)

### Prerequisitos
```bash
az --version        # Azure CLI instalado
docker --version    # Docker Desktop funcionando
git --version       # Git configurado
```

---

### Paso 1 — Login y crear recursos Azure
```bash
# Login
az login

# Grupo de recursos
az group create \
  --name toyota-pedidos-rg \
  --location eastus

# Azure Container Registry
az acr create \
  --name toyotapedidosacr \
  --resource-group toyota-pedidos-rg \
  --sku Basic \
  --admin-enabled true

# App Service Plan (Linux B1 — más económico con contenedores)
az appservice plan create \
  --name toyota-plan \
  --resource-group toyota-pedidos-rg \
  --sku B1 \
  --is-linux

# Web App con docker-compose.azure.yml
az webapp create \
  --name toyota-pedidos-app \
  --resource-group toyota-pedidos-rg \
  --plan toyota-plan \
  --multicontainer-config-type compose \
  --multicontainer-config-file docker-compose.azure.yml
```

---

### Paso 2 — Obtener credenciales ACR
```bash
# Login server (ej: toyotapedidosacr.azurecr.io)
az acr show \
  --name toyotapedidosacr \
  --query loginServer -o tsv

# Username
az acr credential show \
  --name toyotapedidosacr \
  --query username -o tsv

# Password
az acr credential show \
  --name toyotapedidosacr \
  --query "passwords[0].value" -o tsv
```

---

### Paso 3 — Configurar GitHub Secrets

**Ruta:** GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Nombre del Secret | Valor | Cómo obtenerlo |
|-------------------|-------|----------------|
| `ACR_LOGIN_SERVER` | `toyotapedidosacr.azurecr.io` | Paso 2, comando 1 |
| `ACR_USERNAME` | `toyotapedidosacr` | Paso 2, comando 2 |
| `ACR_PASSWORD` | `<password generado>` | Paso 2, comando 3 |
| `AZURE_APP_NAME` | `toyota-pedidos-app` | Nombre elegido en Paso 1 |
| `AZURE_PUBLISH_PROFILE` | `<contenido XML>` | Azure Portal → Web App → **Get publish profile** → copiar todo el contenido del archivo descargado |

---

### Paso 4 — Primer deploy
```bash
git add .
git commit -m "feat: deploy inicial Toyota pedidos"
git push origin main
```
Ir a **GitHub → Actions** → ver el workflow `Deploy Toyota Pedidos to Azure` ejecutándose.
El pipeline completo tarda aprox. 5–10 minutos.

---

### Paso 5 — Verificar en Azure
```bash
# Abrir la aplicación en el navegador
az webapp browse \
  --name toyota-pedidos-app \
  --resource-group toyota-pedidos-rg

# Ver estado de la web app
az webapp show \
  --name toyota-pedidos-app \
  --resource-group toyota-pedidos-rg \
  --query state -o tsv
```

---

### Paso 6 — Configurar variables de entorno JWT en Azure
```bash
az webapp config appsettings set \
  --name toyota-pedidos-app \
  --resource-group toyota-pedidos-rg \
  --settings \
    JWT_KEY="ToyotaSecretKey2026SuperSegura!MínimoCincuentaCaracteres!!" \
    JWT_ISSUER="toyota-pedidos-api" \
    JWT_AUDIENCE="toyota-pedidos-client"

# Verificar que se guardaron
az webapp config appsettings list \
  --name toyota-pedidos-app \
  --resource-group toyota-pedidos-rg \
  --query "[?name=='JWT_KEY' || name=='JWT_ISSUER']"
```

---

### Paso 7 — Repetir los 18 tests en producción

Cambiar la variable de entorno en Postman:
```
base_url = https://toyota-pedidos-app.azurewebsites.net
```
Ejecutar los TEST 1–18. Todos deben dar los mismos resultados que en local.

---

### Paso 8 — Ver logs en tiempo real
```bash
# Logs de todos los contenedores en tiempo real
az webapp log tail \
  --name toyota-pedidos-app \
  --resource-group toyota-pedidos-rg

# Descargar logs históricos
az webapp log download \
  --name toyota-pedidos-app \
  --resource-group toyota-pedidos-rg \
  --log-file logs_toyota.zip
```

---

## Solución de problemas comunes en Azure

### Error: `503 Service Unavailable`
**Causa:** Los contenedores aún están iniciando o hay un problema de memoria.
**Solución:**
```bash
# Ver estado del contenedor
az webapp log tail --name toyota-pedidos-app --resource-group toyota-pedidos-rg

# Reiniciar la web app
az webapp restart --name toyota-pedidos-app --resource-group toyota-pedidos-rg
```
Esperar 2-3 minutos y volver a intentar.

---

### Error: JWT inválido en producción (401 en todos los endpoints)
**Causa:** Las variables de entorno JWT no están configuradas en Azure.
**Diagnóstico:**
```bash
az webapp config appsettings list \
  --name toyota-pedidos-app \
  --resource-group toyota-pedidos-rg
```
**Solución:** Ejecutar el Paso 6 (configurar JWT vars) y reiniciar la app.

---

### Error: CORS bloqueado desde el frontend en producción
**Causa:** El dominio de Azure no está permitido en la política CORS.
**Diagnóstico:** En las DevTools del navegador (F12 → Console) verá:
`Access to fetch at '...' from origin 'https://...' has been blocked by CORS policy`
**Solución en `ApiGateway/Program.cs`:** Actualizar la política para producción:
```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});
```
La política actual ya usa `AllowAnyOrigin()`, por lo que no debería ocurrir.
Si persiste, verificar que `app.UseCors("AllowAll")` esté ANTES de `app.MapReverseProxy()`.

---

### Error: `Error al cargar pedidos` en el frontend
**Causa probable:** El YARP Gateway no puede resolver el nombre del microservicio.
**Verificar en `ApiGateway/appsettings.json`:**
```json
"Clusters": {
  "pedidos-cluster": {
    "Destinations": {
      "destination1": { "Address": "http://pedidos:3002" }
    }
  }
}
```
Los nombres (`usuarios`, `pedidos`, `pagos`) deben coincidir exactamente con los nombres de servicio en `docker-compose.yml`.

---

## Checklist final antes de mostrar a Toyota

```
AUTENTICACIÓN
[ ] Login funciona con admin@toyota.com / Admin123!     → role: Admin
[ ] Login funciona con vendedor@toyota.com / Vend123!   → role: Vendedor
[ ] Login funciona con admin@admin.com / Admin@123      → role: Admin
[ ] Login funciona con user@user.com / User@123         → role: User
[ ] JWT contiene claim de rol correcto (verificar en jwt.io)
[ ] Credenciales incorrectas devuelven 401

PEDIDOS
[ ] GET /api/pedidos sin token → 401
[ ] GET /api/pedidos con token Admin → 200
[ ] POST /api/pedidos con token Admin → 201
[ ] POST /api/pedidos con token Vendedor → 201
[ ] POST /api/pedidos con token User → 403

PAGOS
[ ] GET /api/pagos sin token → 401
[ ] GET /api/pagos con token Admin → 200
[ ] GET /api/pagos con token Vendedor → 403
[ ] POST /api/pagos con token Admin → 201
[ ] POST /api/pagos con token Vendedor → 403

GATEWAY
[ ] GET /health → 200
[ ] GET /api/usuarios/health → 200
[ ] GET /api/pedidos/health → 200
[ ] GET /api/pagos/health → 200
[ ] YARP enruta los 3 servicios correctamente

FRONTEND ANGULAR
[ ] http://localhost carga la app
[ ] Login Admin muestra menú completo (5 items)
[ ] Login Vendedor muestra menú reducido (3 items)
[ ] Login User muestra menú reducido (3 items)
[ ] Dashboard Admin muestra stats de pedidos y pagos
[ ] Dashboard User/Vendedor muestra info básica
[ ] /pagos con Vendedor redirige a /dashboard
[ ] Botón logout funciona correctamente
[ ] Interceptor adjunta token en cada request

DOCKER LOCAL
[ ] docker-compose up --build sin errores
[ ] Los 6 servicios levantan: frontend, apigateway, usuarios, pedidos, pagos, mongodb
[ ] Swagger disponible en :3001/swagger, :3002/swagger, :3003/swagger
[ ] Botón Authorize en Swagger funciona con Bearer token

AZURE (si aplica para el miércoles)
[ ] GitHub Actions pipeline verde en rama main
[ ] URL pública responde: https://toyota-pedidos-app.azurewebsites.net
[ ] Variables JWT configuradas en Azure App Settings
[ ] Los 18 tests de Postman pasan apuntando a la URL de Azure
[ ] az webapp log tail muestra logs sin errores críticos
```
