# Guía Postman — Outiltech API

**Versión:** 2.0  
**Fecha:** Abril 2026  
**Proyecto:** Outiltech E-Commerce  
**Gateway:** `http://localhost:5000` (local) | `https://api.outiltech.co` (producción)

---

## 1. Importar la Colección

1. Abrir Postman
2. Clic en **Import** (arriba a la izquierda)
3. Seleccionar el archivo `ProyectoPedidos.postman_collection.json`
   (está en `documentación del proyecto/postman/`)
4. La colección aparece como **"Outiltech — Colección Completa"**

---

## 2. Configurar el Entorno

### Crear entorno "Outiltech Local"

1. Clic en el ícono de engranaje (Environments) → **Add**
2. Nombre: `Outiltech Local`
3. Agregar estas variables:

| Variable | Valor inicial | Descripción |
|----------|--------------|------------|
| `base_url` | `http://localhost:5000` | URL del API Gateway |
| `token_admin` | *(vacío)* | Se llena al hacer login admin |
| `pedido_id` | `1` | ID de pedido para pruebas |

4. Guardar y seleccionar "Outiltech Local" como entorno activo

### Para producción (Hetzner)

Cambiar `base_url` a: `https://api.outiltech.co`

---

## 3. Estructura de la Colección (24 Requests)

```
📁 Outiltech — Colección Completa
├── 📁 Health Checks (4)
│   ├── GET  Health Gateway
│   ├── GET  Health Usuarios
│   ├── GET  Health Pedidos
│   └── GET  Health Pagos
├── 📁 Autenticación (4)
│   ├── POST Login Admin
│   ├── POST Login Vendedor
│   ├── POST Login Inválido (debe dar 401)
│   └── POST Registro Usuario
├── 📁 Pedidos (8)
│   ├── GET  Listar pedidos (admin)
│   ├── POST Checkout nuevo pedido
│   ├── GET  Obtener pedido por ID
│   ├── PATCH Actualizar estado pedido
│   ├── PATCH Comprobante Nequi
│   ├── POST Crear transacción Wompi
│   ├── GET  Resultado pago Wompi
│   └── GET  Sin token (debe dar 401)
├── 📁 Pagos (4)
│   ├── GET  Listar pagos (admin)
│   ├── POST Registrar pago
│   ├── GET  Pago por ID
│   └── GET  Sin token (debe dar 401)
└── 📁 Flujo E2E (4)
    ├── 1. Login → captura token
    ├── 2. Crear pedido (checkout)
    ├── 3. Verificar pedido creado
    └── 4. Actualizar estado a Confirmado
```

---

## 4. Requests Detallados

### 4.1 Health Checks

```
GET {{base_url}}/health
GET {{base_url}}/api/usuarios/health
GET {{base_url}}/api/pedidos/health
GET {{base_url}}/api/pagos/health
```

**Resultado esperado:** `200 OK` en todos.

---

### 4.2 Autenticación

**Login Admin:**
```
POST {{base_url}}/api/usuarios/auth/login
Content-Type: application/json

{
  "email": "admin@outiltech.co",
  "password": "Admin123!"
}
```

**Resultado esperado:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "rol": "Admin",
  "nombre": "Administrador Outiltech"
}
```

**Script automático (pestaña Tests):**
```javascript
if (pm.response.code === 200) {
    const data = pm.response.json();
    pm.collectionVariables.set("token_admin", data.token);
    console.log("Token admin capturado ✓");
}
```

---

### 4.3 Checkout (Nuevo Pedido)

```
POST {{base_url}}/api/pedidos/checkout
Content-Type: application/json

{
  "cliente": "Carlos Gómez",
  "email": "carlos@test.com",
  "telefono": "3001234567",
  "nombre": "Carlos",
  "apellido": "Gómez",
  "ciudad": "Bogotá",
  "direccion": "Calle 100 #15-20",
  "barrio": "Santa Bárbara",
  "tipoId": "CC",
  "numeroId": "1234567890",
  "metodoEnvio": "domicilio",
  "metodoPago": "tarjeta",
  "total": 1299000,
  "itemsJson": "[{\"id\":1,\"nombre\":\"iPhone 16\",\"marca\":\"Apple\",\"cantidad\":1,\"precioUnitario\":1299000,\"subtotal\":1299000}]"
}
```

**Resultado esperado:**
```json
{
  "id": 45,
  "estado": "Pendiente",
  "mensaje": "Pedido creado correctamente"
}
```

**Script post-request:**
```javascript
if (pm.response.code === 201 || pm.response.code === 200) {
    const data = pm.response.json();
    pm.collectionVariables.set("pedido_id", data.id);
    console.log("Pedido ID capturado:", data.id);
}
```

---

### 4.4 Crear Transacción Wompi

```
POST {{base_url}}/api/pedidos/create-wompi-transaction
Content-Type: application/json

{
  "reference": "OUTILTECH-45-1714000000000",
  "amountCop": 1299000,
  "redirectUrl": "https://outiltech.co/payment-result",
  "email": "carlos@test.com",
  "fullName": "Carlos Gómez",
  "phone": "3001234567"
}
```

**Resultado esperado:**
```json
{
  "checkoutUrl": "https://checkout.wompi.co/p/?public-key=..."
}
```

---

### 4.5 Comprobante Nequi

```
PATCH {{base_url}}/api/pedidos/nequi-comprobante/{{pedido_id}}
Content-Type: application/json

{
  "numeroPagador": "3009876543",
  "codigoComprobante": "20260426001234",
  "tipoPago": "Nequi"
}
```

**Resultado esperado:** `200 OK`

---

### 4.6 Actualizar Estado Pedido

```
PATCH {{base_url}}/api/pedidos/{{pedido_id}}/estado
Content-Type: application/json
Authorization: Bearer {{token_admin}}

{
  "estado": "Confirmado"
}
```

**Resultado esperado:** `200 OK`

---

### 4.7 Registrar Pago

```
POST {{base_url}}/api/pagos
Content-Type: application/json
Authorization: Bearer {{token_admin}}

{
  "pedidoId": {{pedido_id}},
  "monto": 1299000,
  "metodoPago": "tarjeta",
  "referencia": "OUTILTECH-45-1714000000000"
}
```

**Resultado esperado:** `201 Created`

---

## 5. Ejecutar el Flujo Completo (Collection Runner)

1. Clic en la colección → **Run collection**
2. Seleccionar carpeta **"Flujo E2E"**
3. Delay entre requests: **500ms**
4. Clic **Run Outiltech**
5. Verificar que todos los tests pasen ✅

**Resultado esperado:**
```
✓ Login Admin → 200 OK (token capturado)
✓ Checkout → 201 Created (pedido_id capturado)
✓ Verificar pedido → 200 OK
✓ Confirmar estado → 200 OK
```

---

## 6. Credenciales de Prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@outiltech.co | Admin123! |
| Vendedor | vendedor@outiltech.co | Vendedor1! |

> **Nota:** Cambiar estas credenciales en producción. No usar en ambientes reales.

---

## 7. Solución de Problemas

| Error | Causa | Solución |
|-------|-------|---------|
| `connection refused` | Backend no está corriendo | `docker-compose up -d` |
| `401 Unauthorized` en pedidos | Token expirado | Ejecutar "Login Admin" primero |
| `403 Forbidden` en pagos | Rol incorrecto | Usar token de Admin, no de Vendedor |
| `404 Not Found` en pedido | ID de pedido no existe | Crear un pedido primero (Checkout) |
| Wompi retorna error | Claves sandbox incorrectas | Verificar `Wompi__PublicKey` en docker-compose |

---

*Outiltech — Guía Postman v2.0 — Abril 2026*
