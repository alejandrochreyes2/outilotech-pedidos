# Manual Técnico de Pruebas — Outiltech E-Commerce

**Versión:** 2.0  
**Fecha:** Abril 2026  
**Proyecto:** Outiltech — Plataforma E-Commerce de Tecnología  
**URL Producción:** https://outiltech.co  
**Servidor:** Hetzner Cloud + Coolify

---

## 1. Resumen de la Arquitectura

```
[Navegador / PWA]
        │
        ▼
[Angular 21 — outiltech.co]  ← Cloudflare CDN
        │
        ▼ HTTP/HTTPS
[API Gateway YARP — puerto 5000]
        │
   ┌────┴────┬────────────┐
   ▼         ▼            ▼
[Usuarios] [Pedidos]   [Pagos]
 :3001      :3002       :3003
   │         │            │
   ▼         ▼            ▼
[PostgreSQL] [PostgreSQL + Supabase] [PostgreSQL + MongoDB]
```

**Stack completo:**

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 21 standalone, TypeScript, Signals API |
| Backend | .NET 8 ASP.NET Core — 3 microservicios |
| Gateway | YARP Reverse Proxy |
| Base de datos relacional | PostgreSQL 15 |
| Base de datos realtime | Supabase (PostgreSQL cloud) |
| Base de datos documental | MongoDB 6 |
| Pagos | Wompi (tarjeta/PSE) + Nequi QR manual |
| Email | EmailJS (cliente) + System.Net.Mail SMTP (backend) |
| Infraestructura | Hetzner VPS, Coolify, Docker, Cloudflare |
| Dominio | outiltech.co (Namecheap) |
| CDN video | Cloudflare R2 |

---

## 2. Entornos de Trabajo

### 2.1 Desarrollo Local

```bash
# Levantar todos los servicios
docker-compose up --build -d

# Verificar que todos están corriendo
docker ps

# Servicios disponibles:
# http://localhost:4200   → Frontend Angular
# http://localhost:5000   → API Gateway
# http://localhost:3001   → Microservicio Usuarios
# http://localhost:3002   → Microservicio Pedidos
# http://localhost:3003   → Microservicio Pagos
# localhost:5432          → PostgreSQL
# localhost:27017         → MongoDB
```

### 2.2 Producción (Hetzner + Coolify)

| Servicio | URL |
|---------|-----|
| Tienda pública | https://outiltech.co |
| API Gateway | https://api.outiltech.co o subdominio Coolify |
| Panel Coolify | https://[IP_HETZNER]:8000 |
| Supabase dashboard | https://supabase.com → proyecto outiltech |

---

## 3. Configuración de Postman

### 3.1 Variables de Entorno

Crear un environment "Outiltech Local" con:

| Variable | Valor |
|----------|-------|
| `base_url` | `http://localhost:5000` |
| `token_admin` | *(se llena automáticamente al hacer login)* |
| `pedido_id` | *(se llena automáticamente)* |

### 3.2 Script de Captura de Token

En la pestaña **Tests** del request de login:
```javascript
if (pm.response.code === 200) {
    const data = pm.response.json();
    pm.collectionVariables.set("token_admin", data.token);
    console.log("Token capturado:", data.token.substring(0, 30) + "...");
}
```

---

## 4. Pruebas Funcionales (18 Escenarios)

### BLOQUE 1 — Autenticación (Usuarios — puerto 3001)

| # | Prueba | Método | Endpoint | Body | Resultado esperado |
|---|--------|--------|----------|------|--------------------|
| 1 | Login admin | POST | `/api/usuarios/auth/login` | `{"email":"admin@outiltech.co","password":"Admin123!"}` | 200 + JWT token |
| 2 | Login usuario normal | POST | `/api/usuarios/auth/login` | `{"email":"vendedor@outiltech.co","password":"Vendedor1!"}` | 200 + JWT token |
| 3 | Login credenciales inválidas | POST | `/api/usuarios/auth/login` | `{"email":"x@x.com","password":"wrong"}` | 401 Unauthorized |
| 4 | Registro nuevo usuario | POST | `/api/usuarios/auth/register` | `{"email":"test@test.com","password":"Test123!","nombre":"Test","rol":"Vendedor"}` | 201 Created |

### BLOQUE 2 — Pedidos (puerto 3002)

| # | Prueba | Método | Endpoint | Auth | Resultado esperado |
|---|--------|--------|----------|------|--------------------|
| 5 | Listar pedidos (admin) | GET | `/api/pedidos` | Bearer token admin | 200 + array de pedidos |
| 6 | Crear pedido (checkout) | POST | `/api/pedidos/checkout` | Sin auth (público) | 201 + `{id, estado: "Pendiente"}` |
| 7 | Obtener pedido por ID | GET | `/api/pedidos/{id}` | Bearer token admin | 200 + objeto pedido |
| 8 | Actualizar estado pedido | PATCH | `/api/pedidos/{id}/estado` | Bearer token admin | 200 + estado actualizado |
| 9 | Comprobante Nequi | PATCH | `/api/pedidos/nequi-comprobante/{id}` | Sin auth (público) | 200 + comprobante guardado |
| 10 | Crear transacción Wompi | POST | `/api/pedidos/create-wompi-transaction` | Sin auth | 200 + `{checkoutUrl}` |
| 11 | Acceso sin token | GET | `/api/pedidos` | Sin token | 401 Unauthorized |

### BLOQUE 3 — Pagos (puerto 3003)

| # | Prueba | Método | Endpoint | Auth | Resultado esperado |
|---|--------|--------|----------|------|--------------------|
| 12 | Listar pagos | GET | `/api/pagos` | Bearer token admin | 200 + array |
| 13 | Registrar pago | POST | `/api/pagos` | Bearer token admin | 201 Created |
| 14 | Acceso sin token | GET | `/api/pagos` | Sin token | 401 Unauthorized |

### BLOQUE 4 — Gateway y Salud

| # | Prueba | Método | Endpoint | Resultado esperado |
|---|--------|--------|----------|--------------------|
| 15 | Health gateway | GET | `/health` | 200 OK |
| 16 | Health usuarios | GET | `/api/usuarios/health` | 200 OK |
| 17 | Health pedidos | GET | `/api/pedidos/health` | 200 OK |
| 18 | Health pagos | GET | `/api/pagos/health` | 200 OK |

---

## 5. Pruebas del Flujo de Pago (E2E)

### 5.1 Flujo Wompi (Tarjeta/PSE)

```
1. Seleccionar producto → Agregar al carrito
2. Ir a /checkout → Llenar datos del formulario
3. Seleccionar "Tarjetas de Crédito y Débito"
4. Clic "Completar pago"
5. Sistema llama a POST /api/pedidos/checkout → guarda pedido
6. Sistema llama a POST /api/pedidos/create-wompi-transaction
7. Redirige a checkout.wompi.co
8. Completar pago de prueba en sandbox Wompi
9. Wompi redirige a /payment-result?id=...
10. Verificar: GET /api/pedidos/wompi-result?id=...
```

**Tarjeta de prueba Wompi:**
- Número: `4242 4242 4242 4242`
- Vencimiento: cualquier fecha futura
- CVV: cualquier 3 dígitos

### 5.2 Flujo Nequi (QR Manual)

```
1. Seleccionar producto → carrito → checkout
2. Seleccionar "Nequi / Daviplata"
3. Clic "Completar pago" → QR estático aparece INMEDIATAMENTE
4. Escanear QR con app Nequi (o transferir al 3045928793)
5. Clic "Ya realicé el pago"
6. Llenar formulario comprobante (número pagador + código comprobante)
7. Sistema llama a PATCH /api/pedidos/nequi-comprobante/{id}
8. Estado cambia a "PendienteVerificacion"
9. Administrador verifica manualmente en dashboard
```

---

## 6. Pruebas de Email

### 6.1 EmailJS (cliente final)

Verificar que el cliente recibe email al:
- Completar compra con tarjeta/PSE → email "Pedido confirmado"
- Enviar comprobante Nequi → email "Comprobante recibido"
- El administrador (contactanos@outiltech.co) recibe copia de cada pedido

**Template usado:** `template_zbn2qhv` en servicio `service_outiltech`

### 6.2 Backend SMTP (notificaciones internas)

Configurado en `appsettings.json`:
```json
"Email": {
  "User": "alejandrochreyes2@gmail.com",
  "Password": "[APP_PASSWORD_GMAIL]",
  "AdminEmail": "contactanos@outiltech.co"
}
```

---

## 7. Solución de Problemas Comunes

| Error | Causa probable | Solución |
|-------|---------------|---------|
| `ERR_CONNECTION_REFUSED :5000` | Gateway no está corriendo | `docker-compose up -d apigateway` |
| `401 Unauthorized` | Token expirado o ausente | Hacer login nuevamente |
| `CORS error` en browser | URL del gateway incorrecta en `environment.ts` | Verificar `apiUrl` en environments |
| QR Nequi no aparece | Imagen no encontrada | Verificar que `nequi-qr-static.png` está en `frontend/src/assets/` |
| Wompi redirige a error | Claves sandbox incorrectas | Verificar `Wompi__PublicKey` e `IntegrityKey` en docker-compose |
| Email no llega | Template EmailJS sin `{{to_email}}` dinámico | Revisar template en emailjs.com dashboard |
| Supabase sync falla | API key vencida o incorrecta | Actualizar `SUPABASE_KEY` en checkout.component.ts |
| PostgreSQL conexión falla | String de conexión incorrecto | Verificar `ConnectionStrings__PostgreSQL` en docker-compose |

---

## 8. Checklist de Validación Pre-Entrega

### Funcional
- [x] Login admin funciona con JWT
- [x] Checkout completo funciona (formulario → pedido → email)
- [x] Wompi sandbox procesa pago de prueba correctamente
- [x] QR Nequi aparece inmediatamente sin bloqueo
- [x] Comprobante Nequi se guarda en PostgreSQL
- [x] Email al cliente se envía vía EmailJS
- [x] Email copia admin se envía a contactanos@outiltech.co
- [x] Dashboard admin lista pedidos en tiempo real (Supabase)
- [x] Carrito persiste en localStorage
- [x] 114 productos cargados correctamente

### Técnico
- [x] CORS configurado para outiltech.co
- [x] JWT interceptor solo aplica al backend (no a Supabase)
- [x] Environments prod/dev configurados correctamente
- [x] Docker compose levanta todos los servicios
- [x] HTTPS en producción (Cloudflare)

### Rendimiento
- [x] Tiempo de carga home < 3 segundos en 4G
- [x] Bundle Angular < 800KB inicial
- [x] Imágenes desde CDN externo (no local)
- [x] Video hero desde Cloudflare R2

---

## 9. GUÍA DE ADMINISTRACIÓN DEL SERVIDOR

> Esta sección está dirigida al cliente (Jhonnathan Hernández / equipo Outiltech) para gestionar la infraestructura de forma autónoma.

### 9.1 Acceso al Panel Coolify (Hetzner)

**¿Qué es Coolify?**  
Coolify es el panel de control del servidor. Desde aquí se reinician servicios, se ven logs en tiempo real, se configuran variables de entorno y se hacen redespliegues.

**Cómo acceder:**
1. Abrir navegador → `http://[IP_DEL_SERVIDOR_HETZNER]:8000`
2. Usuario: *(entregado al firmar el acta)*
3. Contraseña: *(entregada al firmar el acta)*

**Acciones comunes en Coolify:**

| Acción | Cómo hacerlo |
|--------|-------------|
| Ver si el backend está corriendo | Panel → Applications → Ver estado verde/rojo |
| Reiniciar un microservicio | Clic en el servicio → botón "Restart" |
| Ver logs de errores | Clic en el servicio → pestaña "Logs" |
| Actualizar una variable de entorno | Clic en el servicio → "Environment" → editar → "Save & Restart" |
| Hacer un redespliegue | Clic en el servicio → botón "Deploy" |

### 9.2 Gestión del Servidor Hetzner

**¿Qué es Hetzner?**  
Hetzner es el proveedor de nube donde está alojado el servidor. Es como el "computador" en la nube que corre el backend.

**Acceso:**
1. Ir a https://console.hetzner.cloud
2. Iniciar sesión con el email del propietario
3. Seleccionar proyecto "outiltech"

**Acciones comunes:**

| Situación | Qué hacer |
|-----------|----------|
| El sitio está caído completamente | Hetzner Console → servidor → "Reiniciar" (Power Cycle) |
| Ver consumo del servidor | Pestaña "Gráficas" → CPU / RAM / Red |
| Renovar el servidor (facturación) | Pestaña "Invoices" → pagar mensualmente |
| Hacer snapshot (copia de seguridad) | Pestaña "Snapshots" → "Create snapshot" |

> **IMPORTANTE:** El servidor Hetzner se paga mensualmente (~€7-12/mes). Si no se paga, el servidor se suspende y el sitio cae.

### 9.3 Gestión de Cloudflare (DNS y CDN)

**¿Qué es Cloudflare?**  
Cloudflare protege el sitio web, hace que cargue rápido en todo el mundo y gestiona el dominio DNS.

**Acceso:**
1. Ir a https://dash.cloudflare.com
2. Iniciar sesión con email del propietario
3. Seleccionar dominio "outiltech.co"

**Acciones comunes:**

| Tarea | Pasos |
|-------|-------|
| Agregar un subdominio | DNS → "Add Record" → Tipo A o CNAME → nombre → IP |
| Activar/desactivar caché | Caching → "Purge Cache" para forzar actualización |
| Ver tráfico del sitio | Analytics → tráfico por día/semana |
| Renovar certificado SSL | Automático — Cloudflare lo maneja solo |
| Redirigir dominio | Rules → "Redirect Rules" |

### 9.4 Gestión de Supabase (Base de datos en tiempo real)

**Acceso:**
1. Ir a https://supabase.com
2. Iniciar sesión → proyecto "outiltech"
3. Seleccionar "Table Editor" para ver datos

**Acciones comunes:**

| Tarea | Pasos |
|-------|-------|
| Ver pedidos en tiempo real | Table Editor → tabla "pedidos" |
| Exportar datos | Table Editor → "Export" → CSV |
| Ver logs de errores | Logs Explorer |
| Generar nueva API Key | Settings → API → "Generate new key" |

> **Nota:** Actualizar la API key en `checkout.component.ts` si se regenera.

### 9.5 Gestión del Dominio en Namecheap

**Acceso:**
1. Ir a https://www.namecheap.com
2. Iniciar sesión → "Domain List"
3. Seleccionar "outiltech.co"

**Acciones importantes:**

| Tarea | Frecuencia | Pasos |
|-------|-----------|-------|
| Renovar dominio | Anual | Manage → Renew → Pagar |
| Ver configuración DNS | Cuando sea necesario | Advanced DNS |
| Transferir a otro proveedor | Si se desea | Transfer domain |

> **ALERTA:** El dominio **outiltech.co** vence anualmente. Si no se renueva, el sitio queda sin URL. Configurar auto-renovación recomendado.

### 9.6 Gestión de Wompi (Pasarela de Pagos)

**Acceso:**
1. Ir a https://wompi.com → Panel comercio
2. Iniciar sesión con credenciales del comercio Outiltech

**Acciones comunes:**

| Tarea | Pasos |
|-------|-------|
| Ver transacciones | Dashboard → Transacciones |
| Ver pagos pendientes | Dashboard → Pendientes |
| Obtener llaves de producción | Developers → API Keys |
| Hacer devolución | Transacciones → seleccionar → "Reversar" |
| Configurar webhook | Developers → Webhooks → URL del backend |

> **Importante:** Las llaves actuales son de **sandbox (pruebas)**. Para cobrar dinero real, solicitar activación del comercio en producción en Wompi.

### 9.7 Respaldo y Recuperación

**Frecuencia recomendada de backups:**
- PostgreSQL: semanal automático vía Coolify
- Código fuente: GitHub es el backup (nunca borrar el repositorio)
- Snapshot Hetzner: mensual manual

**Para restaurar la base de datos:**
```bash
# Conectarse al servidor via SSH
ssh root@[IP_HETZNER]

# Entrar al contenedor PostgreSQL
docker exec -it postgres psql -U postgres -d outiltech

# Restaurar desde backup
\i /backup/outiltech_FECHA.sql
```

### 9.8 Contacto de Soporte Técnico

| Situación | Contacto | Tiempo de respuesta |
|-----------|---------|-------------------|
| Bug crítico (sitio caído) | alejandrochreyes2@gmail.com / WhatsApp | < 4 horas hábiles |
| Duda de uso o configuración | alejandrochreyes2@gmail.com | < 24 horas hábiles |
| Nueva funcionalidad | alejandrochreyes2@gmail.com | Cotización en 48h |

> El período de soporte incluido es de **15 días** desde la fecha de entrega (26 de abril de 2026). Después de ese período, el soporte adicional tiene costo.

---

*Outiltech E-Commerce — Documentación Técnica v2.0 — Abril 2026*  
*Desarrollado por Alejandro Chaparro Reyes · alejandrochreyes2@gmail.com*
