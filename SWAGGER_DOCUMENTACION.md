# Documentación Swagger — Toyota Pedidos Enterprise

**Versión:** 1.0
**Fecha:** Marzo 2026
**Proyecto:** Toyota Pedidos — Plataforma Enterprise de Microservicios

---

## ¿Qué es Swagger?

Swagger (también conocido como OpenAPI) es el estándar de la industria para documentar APIs REST. Es una interfaz web interactiva que permite a cualquier desarrollador o tester explorar, entender y probar los endpoints de una API directamente desde el navegador, sin necesidad de herramientas adicionales.

En este proyecto usamos Swagger porque:
- **Facilita las pruebas**: Puedes ejecutar cualquier endpoint directamente desde el navegador
- **Es la documentación viva**: Si el código cambia, Swagger se actualiza automáticamente
- **Estándar de la industria**: Cualquier desarrollador que se una al proyecto lo entiende de inmediato
- **Ahorra tiempo**: No necesitas configurar Postman ni recordar los parámetros de cada endpoint
- **Valida automáticamente**: Muestra los schemas de request y response para cada operación

Swagger UI está disponible en cada microservicio de este proyecto en la ruta `/swagger`.

---

## URLs de Swagger por Ambiente

### Ambiente Local (Docker)

> Requiere que el proyecto esté corriendo con `docker-compose up -d`

| Microservicio | URL Swagger | Puerto |
|--------------|------------|--------|
| Usuarios | http://localhost:3001/swagger | 3001 |
| Pedidos | http://localhost:3002/swagger | 3002 |
| Pagos | http://localhost:3003/swagger | 3003 |

### Ambiente Producción (Azure)

| Servicio | URL | Notas |
|---------|-----|-------|
| Gateway | https://toyota-gateway.wittystone-43cf97a7.eastus2.azurecontainerapps.io/health | Solo health check |
| Frontend | https://gentle-water-0ba98b90f.1.azurestaticapps.net | Aplicación completa |

> Nota: En producción, Swagger no está habilitado por seguridad. Usar Postman para pruebas en Azure.

---

## Cómo usar Swagger paso a paso

### Paso 1 — Abrir Swagger UI

1. Asegúrate de que Docker Desktop esté corriendo
2. En la terminal, ejecuta: `docker-compose up -d` desde la carpeta del proyecto
3. Espera 20 segundos a que todos los servicios inicien
4. Abre tu navegador y ve a: `http://localhost:3001/swagger`
5. Verás la interfaz de Swagger con todos los endpoints del microservicio de Usuarios
6. Para ver los otros microservicios, abre tabs adicionales:
   - Pedidos: `http://localhost:3002/swagger`
   - Pagos: `http://localhost:3003/swagger`

### Paso 2 — Autenticarse con JWT

Los endpoints protegidos requieren un token JWT. Sigue este proceso:

**2.1 Hacer Login primero:**
1. En Swagger de Usuarios (`localhost:3001/swagger`), busca el endpoint `POST /auth/login`
2. Haz clic en el endpoint para expandirlo
3. Haz clic en el botón **"Try it out"** (esquina superior derecha del endpoint)
4. En el campo `Request body`, ingresa:
   ```json
   {
     "email": "alejandrochreyes2@gmail.com",
     "password": "[contraseña-admin]"
   }
   ```
5. Haz clic en el botón azul **"Execute"**
6. En la sección `Response body`, copia el valor completo del campo `token`

**2.2 Pegar el token en Swagger:**
1. Sube al inicio de la página de Swagger
2. Haz clic en el botón verde **"Authorize"** (ícono de candado)
3. En el campo `Value`, escribe exactamente: `Bearer ` seguido del token copiado
   - Ejemplo: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Haz clic en el botón **"Authorize"**
5. Haz clic en **"Close"**
6. El ícono del candado ahora aparece cerrado — estás autenticado

**2.3 Verificar autenticación:**
- Todos los endpoints que tienen el ícono de candado ahora funcionarán con tu rol
- El token expira en 8 horas — si pasa ese tiempo, repite el proceso de login

### Paso 3 — Ejecutar un endpoint

1. Encuentra el endpoint que quieres probar (ej: `GET /api/pedidos`)
2. Haz clic para expandirlo
3. Haz clic en **"Try it out"**
4. Si el endpoint requiere parámetros o body, completa los campos
5. Haz clic en **"Execute"**
6. Revisa la sección **"Responses"**:
   - El `Code` debe ser 200 o 201 para operaciones exitosas
   - El `Response body` muestra los datos retornados
   - El `Response headers` muestra información adicional

---

## Documentación Completa de Endpoints

---

### MICROSERVICIO USUARIOS — localhost:3001/swagger

---

#### POST /auth/login

| Campo | Detalle |
|-------|---------|
| **Descripción** | Autentica un usuario y retorna un token JWT con información del rol |
| **Autenticación requerida** | No (endpoint público) |
| **URL completa** | `http://localhost:3001/auth/login` o vía gateway `http://localhost:5000/api/usuarios/auth/login` |

**Request Body:**
```json
{
  "email": "alejandrochreyes2@gmail.com",
  "password": "[contraseña-admin]"
}
```

**Response 200 — Éxito:**
```json
{
  "email": "alejandrochreyes2@gmail.com",
  "fullName": "Admin Toyota",
  "role": "Admin",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54..."
}
```

**Respuestas de error:**
| Código | Causa |
|--------|-------|
| 401 | Credenciales incorrectas (email o contraseña inválidos) |
| 400 | Body inválido (campos faltantes o formato incorrecto) |

**Casos de prueba verificados:**
| Email | Contraseña | Resultado | Rol en token |
|-------|-----------|-----------|-------------|
| alejandrochreyes2@gmail.com | [contraseña-admin] | 200 ✅ | Admin |
| vendedor@toyota-pedidos.com | [contraseña-vendedor] | 200 ✅ | Vendedor |
| usuario@toyota-pedidos.com | [contraseña-user] | 200 ✅ | User |
| alejandrochreyes2@gmail.com | [contraseña-admin] | 200 ✅ | Admin |
| cualquier@email.com | wrongpass | 401 ✅ | — |

---

#### POST /auth/register

| Campo | Detalle |
|-------|---------|
| **Descripción** | Registra un nuevo usuario en el sistema |
| **Autenticación requerida** | No (endpoint público) |
| **Nota** | En producción se puede restringir solo a Admins |

**Request Body:**
```json
{
  "email": "nuevo@empresa.com",
  "password": "Nuevo@123",
  "fullName": "Nombre Completo"
}
```

**Respuestas:**
| Código | Causa |
|--------|-------|
| 200 | Usuario registrado exitosamente |
| 400 | Email ya existe o validación falló |

---

#### GET /health

| Campo | Detalle |
|-------|---------|
| **Descripción** | Verifica que el microservicio de usuarios está activo y respondiendo |
| **Autenticación requerida** | No |
| **URL** | `http://localhost:3001/health` |

**Response 200:**
```
Healthy
```

---

### MICROSERVICIO PEDIDOS — localhost:3002/swagger

---

#### GET /api/pedidos

| Campo | Detalle |
|-------|---------|
| **Descripción** | Retorna la lista completa de todos los pedidos registrados |
| **Autenticación requerida** | Sí — Bearer Token |
| **Roles permitidos** | Admin ✅ · Vendedor ✅ · User ✅ |
| **URL vía gateway** | `http://localhost:5000/api/pedidos` |

**Headers requeridos:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response 200:**
```json
[
  {
    "id": 1,
    "cliente": "Toyota Colombia",
    "total": 150000,
    "fecha": "2026-03-18T10:21:00Z"
  },
  {
    "id": 2,
    "cliente": "Distribuidora Norte",
    "total": 320000,
    "fecha": "2026-03-18T11:45:00Z"
  }
]
```

**Respuestas de error:**
| Código | Causa |
|--------|-------|
| 401 | Token no proporcionado o expirado |
| 403 | Token válido pero rol sin permiso (no aplica aquí — todos los roles tienen acceso) |

---

#### POST /api/pedidos

| Campo | Detalle |
|-------|---------|
| **Descripción** | Crea un nuevo pedido en el sistema |
| **Autenticación requerida** | Sí — Bearer Token |
| **Roles permitidos** | Admin ✅ · Vendedor ✅ · User ❌ (403) |

**Request Body:**
```json
{
  "cliente": "Nombre del cliente o empresa",
  "total": 500000
}
```

**Response 201 — Creado:**
```json
{
  "id": 3,
  "cliente": "Nombre del cliente o empresa",
  "total": 500000,
  "fecha": "2026-03-18T12:00:00Z"
}
```

**Respuestas de error:**
| Código | Causa |
|--------|-------|
| 401 | Sin token |
| 403 | Rol User no puede crear pedidos |
| 400 | Body inválido (total <= 0 o cliente vacío) |

---

#### GET /health

**Response 200:** `Healthy`

---

### MICROSERVICIO PAGOS — localhost:3003/swagger

---

#### GET /api/pagos

| Campo | Detalle |
|-------|---------|
| **Descripción** | Lista todos los pagos registrados en el sistema |
| **Autenticación requerida** | Sí — Bearer Token |
| **Roles permitidos** | Solo Admin ✅ |
| **URL vía gateway** | `http://localhost:5000/api/pagos` |

**Response 200:**
```json
[
  {
    "id": 1,
    "pedidoId": 1,
    "monto": 150000,
    "estado": "Pendiente",
    "fecha": "2026-03-18T10:25:00Z"
  }
]
```

**Respuestas de error:**
| Código | Causa |
|--------|-------|
| 401 | Sin token |
| 403 | Rol Vendedor o User no puede ver pagos |

---

#### POST /api/pagos

| Campo | Detalle |
|-------|---------|
| **Descripción** | Registra un nuevo pago asociado a un pedido existente |
| **Autenticación requerida** | Sí — Bearer Token |
| **Roles permitidos** | Solo Admin ✅ |

**Request Body:**
```json
{
  "pedidoId": 1,
  "monto": 150000
}
```

**Response 201 — Creado:**
```json
{
  "id": 1,
  "pedidoId": 1,
  "monto": 150000,
  "estado": "Pendiente",
  "fecha": "2026-03-18T10:25:00Z"
}
```

**Respuestas de error:**
| Código | Causa |
|--------|-------|
| 401 | Sin token |
| 403 | Solo Admin puede registrar pagos |
| 400 | PedidoId inválido o monto <= 0 |

---

#### GET /health

**Response 200:** `Healthy`

---

## Tabla Resumen de Todos los Endpoints

| # | Método | Endpoint | Servicio | Puerto | Auth | Roles permitidos |
|---|--------|---------|---------|--------|------|-----------------|
| 1 | POST | /auth/login | Usuarios | 3001 | No | Todos |
| 2 | POST | /auth/register | Usuarios | 3001 | No | Todos |
| 3 | GET | /health | Usuarios | 3001 | No | Todos |
| 4 | GET | /api/pedidos | Pedidos | 3002 | Sí | Admin, Vendedor, User |
| 5 | POST | /api/pedidos | Pedidos | 3002 | Sí | Admin, Vendedor |
| 6 | GET | /health | Pedidos | 3002 | No | Todos |
| 7 | GET | /api/pagos | Pagos | 3003 | Sí | Admin |
| 8 | POST | /api/pagos | Pagos | 3003 | Sí | Admin |
| 9 | GET | /health | Pagos | 3003 | No | Todos |
| 10 | GET | /health | Gateway | 5000 | No | Todos |

---

## Códigos de Respuesta HTTP Utilizados

| Código | Nombre | Significado | Cuándo ocurre en este proyecto |
|--------|--------|-------------|-------------------------------|
| **200** | OK | Solicitud exitosa | Login, GET pedidos, GET pagos |
| **201** | Created | Recurso creado exitosamente | POST pedidos, POST pagos |
| **400** | Bad Request | Datos inválidos en el request | Body vacío, campos faltantes |
| **401** | Unauthorized | Token no proporcionado o expirado | Llamar endpoint sin token |
| **403** | Forbidden | Token válido pero rol sin permiso | Vendedor llama GET /pagos |
| **404** | Not Found | Recurso no encontrado | ID de pedido inexistente |
| **500** | Internal Server Error | Error del servidor | Base de datos no disponible |

---

## Configuración Swagger en el Código

Swagger está configurado en el archivo `Program.cs` de cada microservicio con soporte para autenticación JWT:

```csharp
// Agregar servicios de Swagger con soporte JWT
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Toyota Pedidos API",
        Version = "v1",
        Description = "API de microservicios Toyota Pedidos Enterprise"
    });

    // Definir el esquema de seguridad JWT
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Ingresa el token JWT. Ejemplo: Bearer eyJhbGci..."
    });

    // Requerir JWT para todos los endpoints por defecto
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Activar Swagger UI
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Toyota Pedidos v1");
    c.RoutePrefix = "swagger";
});
```

---

## Errores Comunes en Swagger y Soluciones

| Error que ves | Causa más probable | Solución |
|--------------|-------------------|---------|
| `401 Unauthorized` en endpoint protegido | No hiciste login o no pegaste el token | Ejecuta POST /auth/login, copia el token y pégalo en el candado "Authorize" |
| `Token expirado` o error 401 después de funcionar | El token JWT tiene 8 horas de vida | Vuelve a ejecutar POST /auth/login y actualiza el token |
| `CORS Error` o no carga la página | Docker no está corriendo o puerto incorrecto | Verifica con `docker-compose ps` que todos los contenedores están Up |
| `Connection refused` al abrir localhost:3001 | Servicio caído o no iniciado | Ejecuta `docker-compose restart usuarios` |
| `403 Forbidden` | Tu rol no tiene permiso para ese endpoint | Verifica la tabla de permisos — usa Admin para todo |
| Respuesta `"Undocumented"` | El status code no tiene schema definido | Normal — el endpoint funciona, solo falta el schema en el código |
| Schema no aparece en Swagger | Falta agregar el tipo de retorno al controller | Normal en este proyecto — los datos se retornan correctamente |
| Swagger no muestra el endpoint | El endpoint no tiene el atributo HTTP correcto | Verificar que el controller tiene [HttpGet], [HttpPost], etc. |
