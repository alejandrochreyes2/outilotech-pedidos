# Documentación Swagger — Outiltech API

**Versión:** 2.0  
**Fecha:** Abril 2026  
**Proyecto:** Outiltech E-Commerce  
**Stack:** .NET 8 ASP.NET Core — 3 Microservicios

---

## 1. Acceder a Swagger (Entorno Local)

> **Importante:** Swagger solo está disponible en desarrollo local. En producción está deshabilitado por seguridad.

Levantar los servicios: `docker-compose up -d`

| Microservicio | URL Swagger |
|--------------|------------|
| Usuarios | http://localhost:3001/swagger |
| Pedidos | http://localhost:3002/swagger |
| Pagos | http://localhost:3003/swagger |

---

## 2. Autenticación en Swagger

### Paso 1 — Obtener token JWT

En **Usuarios → /api/usuarios/auth/login**:
```json
{
  "email": "admin@outiltech.co",
  "password": "Admin123!"
}
```
Copiar el valor de `token` de la respuesta.

### Paso 2 — Autorizar en Swagger

1. Clic en el botón **"Authorize"** (candado verde arriba a la derecha)
2. En el campo `Value` escribir: `Bearer eyJhbGciOi...` (pegar el token)
3. Clic **Authorize** → **Close**

Todos los endpoints protegidos ya aceptarán el token.

---

## 3. Microservicio Usuarios (puerto 3001)

### Endpoints disponibles

#### POST `/api/usuarios/auth/login`
Autentica un usuario y devuelve JWT.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "rol": "Admin",
  "nombre": "Administrador Outiltech",
  "expiracion": "2026-04-27T14:30:00Z"
}
```

**Códigos de respuesta:**
| Código | Significado |
|--------|------------|
| 200 | Login exitoso, token devuelto |
| 401 | Credenciales inválidas |
| 400 | Datos incompletos |

---

#### POST `/api/usuarios/auth/register`
Registra un nuevo usuario (solo Admin).

**Request:**
```json
{
  "email": "nuevo@outiltech.co",
  "password": "Segura123!",
  "nombre": "Juan Pérez",
  "rol": "Vendedor"
}
```

**Response 201:**
```json
{
  "id": 5,
  "email": "nuevo@outiltech.co",
  "rol": "Vendedor",
  "mensaje": "Usuario creado correctamente"
}
```

---

#### GET `/api/usuarios`
Lista todos los usuarios (solo Admin).  
**Requiere:** `Bearer token` con rol Admin.

---

#### GET `/api/usuarios/health`
Verifica que el microservicio está activo.

**Response 200:**
```json
{ "status": "Healthy", "service": "Usuarios", "version": "1.0" }
```

---

## 4. Microservicio Pedidos (puerto 3002)

### Endpoints disponibles

#### POST `/api/pedidos/checkout` ⚡ PÚBLICO
Crea un nuevo pedido desde el checkout de la tienda.  
**No requiere autenticación.**

**Request:**
```json
{
  "cliente": "Carlos Gómez",
  "email": "carlos@gmail.com",
  "telefono": "3001234567",
  "nombre": "Carlos",
  "apellido": "Gómez",
  "empresa": "",
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

**Response 201:**
```json
{
  "id": 47,
  "estado": "Pendiente",
  "referencia": "OUTILTECH-47"
}
```

---

#### POST `/api/pedidos/create-wompi-transaction` ⚡ PÚBLICO
Crea una transacción en Wompi y devuelve la URL de pago.

**Request:**
```json
{
  "reference": "OUTILTECH-47-1714000000000",
  "amountCop": 1299000,
  "redirectUrl": "https://outiltech.co/payment-result",
  "email": "carlos@gmail.com",
  "fullName": "Carlos Gómez",
  "phone": "3001234567"
}
```

**Response 200:**
```json
{
  "checkoutUrl": "https://checkout.wompi.co/p/?public-key=pub_test_xxx&amount-in-cents=129900000&..."
}
```

---

#### PATCH `/api/pedidos/nequi-comprobante/{id}` ⚡ PÚBLICO
Guarda el comprobante de pago Nequi/Daviplata.

**Request:**
```json
{
  "numeroPagador": "3009876543",
  "codigoComprobante": "20260426001234",
  "tipoPago": "Nequi"
}
```

**Response 200:**
```json
{
  "mensaje": "Comprobante guardado. Pedido en verificación.",
  "estado": "PendienteVerificacion"
}
```

---

#### GET `/api/pedidos` 🔒 Admin/Vendedor
Lista todos los pedidos con paginación.

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
[
  {
    "id": 47,
    "cliente": "Carlos Gómez",
    "email": "carlos@gmail.com",
    "total": 1299000,
    "estado": "Pendiente",
    "metodoPago": "tarjeta",
    "fechaCreacion": "2026-04-26T14:30:00Z"
  }
]
```

---

#### GET `/api/pedidos/{id}` 🔒 Admin/Vendedor
Obtiene el detalle completo de un pedido.

**Response 200:**
```json
{
  "id": 47,
  "cliente": "Carlos Gómez",
  "email": "carlos@gmail.com",
  "telefono": "3001234567",
  "ciudad": "Bogotá",
  "direccion": "Calle 100 #15-20",
  "metodoPago": "tarjeta",
  "metodoEnvio": "domicilio",
  "total": 1299000,
  "estado": "Pendiente",
  "itemsJson": "[...]",
  "comprobanteNequi": "",
  "fechaCreacion": "2026-04-26T14:30:00Z"
}
```

---

#### PATCH `/api/pedidos/{id}/estado` 🔒 Admin
Actualiza el estado de un pedido.

**Request:**
```json
{ "estado": "Confirmado" }
```

**Estados válidos:** `Pendiente` · `PendienteVerificacion` · `Confirmado` · `Enviado` · `Entregado` · `Cancelado`

---

#### GET `/api/pedidos/wompi-result` ⚡ PÚBLICO
Verifica el resultado de una transacción Wompi.

**Query params:** `?id={wompi_transaction_id}`

**Response 200:**
```json
{
  "status": "APPROVED",
  "pedidoId": 47,
  "referencia": "OUTILTECH-47-1714000000000",
  "monto": 1299000
}
```

---

## 5. Microservicio Pagos (puerto 3003)

#### GET `/api/pagos` 🔒 Admin
Lista todos los pagos registrados.

**Response 200:**
```json
[
  {
    "id": 12,
    "pedidoId": 47,
    "monto": 1299000,
    "metodoPago": "tarjeta",
    "referencia": "OUTILTECH-47-xxx",
    "fecha": "2026-04-26T15:00:00Z"
  }
]
```

---

#### POST `/api/pagos` 🔒 Admin
Registra manualmente un pago.

**Request:**
```json
{
  "pedidoId": 47,
  "monto": 1299000,
  "metodoPago": "tarjeta",
  "referencia": "OUTILTECH-47-xxx"
}
```

**Response 201:** `{ "id": 12, "mensaje": "Pago registrado" }`

---

## 6. Control de Acceso por Rol

| Endpoint | Público | Vendedor | Admin |
|----------|---------|---------|-------|
| POST /checkout | ✅ | ✅ | ✅ |
| POST /create-wompi-transaction | ✅ | ✅ | ✅ |
| PATCH /nequi-comprobante | ✅ | ✅ | ✅ |
| GET /pedidos/wompi-result | ✅ | ✅ | ✅ |
| GET /pedidos | ❌ | ✅ | ✅ |
| PATCH /pedidos/{id}/estado | ❌ | ❌ | ✅ |
| GET /pagos | ❌ | ❌ | ✅ |
| POST /pagos | ❌ | ❌ | ✅ |
| GET /usuarios | ❌ | ❌ | ✅ |
| POST /usuarios/register | ❌ | ❌ | ✅ |

---

## 7. Códigos de Error HTTP

| Código | Significado en Outiltech |
|--------|-------------------------|
| 200 | OK — Operación exitosa |
| 201 | Created — Recurso creado (pedido, pago, usuario) |
| 400 | Bad Request — Datos del formulario inválidos |
| 401 | Unauthorized — Sin token o token inválido/expirado |
| 403 | Forbidden — Rol sin permisos para esta operación |
| 404 | Not Found — Pedido/pago/usuario no existe |
| 409 | Conflict — Referencia duplicada |
| 500 | Internal Server Error — Error del servidor |

---

## 8. Configuración Swagger en el Código

```csharp
// En Program.cs de cada microservicio:
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Outiltech API — [Nombre del microservicio]",
        Version = "v1",
        Description = "Microservicio de la plataforma e-commerce Outiltech"
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header. Ejemplo: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
        {
            new OpenApiSecurityScheme {
                Reference = new OpenApiReference {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Habilitar solo en desarrollo:
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Outiltech API v1"));
}
```

---

*Outiltech — Documentación Swagger v2.0 — Abril 2026*  
*Desarrollado por Alejandro Chaparro Reyes · alejandrochreyes2@gmail.com · WhatsApp 3133082905*  
*Nota: Outiltech no tenía ninguna API ni presencia digital antes del 21 de marzo de 2026. Toda la arquitectura fue diseñada e implementada desde cero.*
