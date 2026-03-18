# 🚗 Toyota Pedidos — Plataforma Enterprise

[![CI/CD](https://github.com/alejandrochreyes2/proyecto-pedidos/actions/workflows/main.yml/badge.svg)](https://github.com/alejandrochreyes2/proyecto-pedidos/actions)

Sistema enterprise de gestión de pedidos con arquitectura de microservicios, desarrollado con los más altos estándares de la industria como proyecto de portafolio fullstack.

## 🌐 Demo en vivo

**URL:** https://toyota-pedidos-app.azurewebsites.net

| Usuario | Contraseña | Rol |
|---------|-----------|-----|
| admin@toyota.com | Admin123! | Administrador |
| vendedor@toyota.com | Vend123! | Vendedor |
| user@user.com | User@123 | Usuario |

---

## 🏗️ Arquitectura de Microservicios

```
┌─────────────────────────────────────────────────────┐
│                   CLIENTE (Angular 21)               │
│              http://localhost  (:80)                 │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│              API GATEWAY — YARP                      │
│                 :5000                                │
│  /api/usuarios → :3001                              │
│  /api/pedidos  → :3002                              │
│  /api/pagos    → :3003                              │
└──────┬──────────────┬──────────────┬────────────────┘
       │              │              │
┌──────▼──────┐ ┌─────▼──────┐ ┌───▼────────┐
│  Usuarios   │ │  Pedidos   │ │   Pagos    │
│  .NET 8     │ │  .NET 8    │ │  .NET 8    │
│   :3001     │ │   :3002    │ │   :3003    │
└──────┬──────┘ └─────┬──────┘ └───┬────────┘
       └──────────────┴────────────┘
                      │
          ┌───────────▼───────────┐
          │      MongoDB 6        │
          │       :27017          │
          └───────────────────────┘
```

---

## ✅ Funcionalidades

### Backend
- ✅ JWT Bearer Authentication con ASP.NET Core Identity
- ✅ 3 microservicios .NET 8 independientes (Usuarios, Pedidos, Pagos)
- ✅ API Gateway YARP con routing centralizado
- ✅ Repository Pattern + DTOs + AutoMapper
- ✅ Middleware global de manejo de excepciones
- ✅ Roles de usuario (Administrador, Vendedor, Usuario)
- ✅ Swagger/OpenAPI en cada microservicio

### Frontend
- ✅ Angular 21 standalone components con Signals
- ✅ Interceptor HTTP automático con JWT token
- ✅ Guards por rol (authGuard, adminGuard)
- ✅ Diseño corporativo estilo Toyota (rojo #EB0A1E)
- ✅ Navbar corporativo con 8 secciones
- ✅ Home con hero fullscreen
- ✅ Login dos columnas (imagen + formulario)
- ✅ Dashboard con header rojo y stat cards
- ✅ Sidebar oscuro con active state
- ✅ Formulario de contacto con EmailJS (envío real a Gmail)
- ✅ Simulador de crédito funcional (fórmula PMT)
- ✅ Countdown timer en promociones
- ✅ Filtro reactivo en concesionarios
- ✅ `@for` / `@if` Angular 17+ control flow

### DevOps
- ✅ Docker multi-stage builds
- ✅ docker-compose con 6 servicios
- ✅ CI/CD GitHub Actions → Azure Container Registry (ACR)
- ✅ Azure App Service B1 (Linux containers)
- ✅ Service Principal con roles AcrPush/AcrPull

---

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| .NET | 8.0 | Backend microservicios |
| Angular | 21.2 | Frontend SPA |
| YARP | 2.x | API Gateway / Reverse Proxy |
| MongoDB | 6.0 | Base de datos NoSQL |
| Docker | Latest | Contenedores |
| Nginx | Alpine | Servidor frontend |
| Azure App Service | B1 | Hosting en nube |
| Azure Container Registry | Basic | Registro imágenes Docker |
| GitHub Actions | Latest | CI/CD Pipeline |
| EmailJS | 4.x | Formulario de contacto |

---

## 🧪 Pruebas API — Postman Collection

Importar: `ProyectoPedidos.postman_collection.json`

| # | Endpoint | Método | Auth | Descripción |
|---|----------|--------|------|-------------|
| 1 | /api/usuarios/auth/login | POST | ❌ | Login Admin |
| 2 | /api/usuarios/auth/login | POST | ❌ | Login Vendedor |
| 3 | /api/usuarios/auth/login | POST | ❌ | Login Usuario |
| 4 | /api/usuarios/auth/login | POST | ❌ | Login Inválido |
| 5 | /api/usuarios/auth/register | POST | ❌ | Registrar usuario |
| 6 | /api/usuarios | GET | ✅ Admin | Listar usuarios |
| 7 | /api/pedidos | GET | ✅ JWT | Listar pedidos |
| 8 | /api/pedidos | POST | ✅ JWT | Crear pedido |
| 9 | /api/pagos | GET | ✅ Admin | Listar pagos |
| 10 | /api/pagos | POST | ✅ Admin | Crear pago |
| 11 | Flujo Admin completo | - | Auto | Login → Pedido → Pago |

> El token JWT se guarda automáticamente en la variable `{{token}}` al hacer login.

---

## 🌐 Secciones del Frontend

| Ruta | Descripción |
|------|-------------|
| `/home` | Hero fullscreen + navbar corporativo |
| `/acerca` | Historia, valores, timeline, cifras |
| `/concesionarios` | 8 dealers con filtro por ciudad |
| `/planes` | 3 planes financiamiento + 4 seguros |
| `/promociones` | Ofertas vigentes + countdown |
| `/contacto` | Formulario PQR con EmailJS |
| `/simulador` | Calculadora de crédito en tiempo real |
| `/login` | Acceso al sistema (dos columnas) |
| `/dashboard` | Panel principal (auth requerida) |
| `/pedidos` | Gestión de pedidos (auth requerida) |
| `/pagos` | Gestión de pagos (solo Admin) |

---

## 🚀 Ejecutar Localmente

```bash
# Clonar repositorio
git clone https://github.com/alejandrochreyes2/proyecto-pedidos.git
cd proyecto-pedidos

# Levantar todos los servicios
docker-compose up --build

# Abrir en el navegador
http://localhost
```

**Swagger por microservicio:**
- Usuarios: http://localhost:3001/swagger
- Pedidos: http://localhost:3002/swagger
- Pagos: http://localhost:3003/swagger

---

## 📁 Estructura del Proyecto

```
proyecto-pedidos/
├── ApiGateway/                  # YARP Reverse Proxy
│   └── appsettings.json         # Configuración de rutas
├── MicroservicioUsuarios/       # Auth + JWT
├── MicroservicioPedidos/        # CRUD Pedidos
├── MicroservicioPagos/          # CRUD Pagos
├── frontend/                    # Angular 21
│   └── src/app/
│       ├── components/
│       │   ├── navbar/          # Navbar corporativo
│       │   ├── home/            # Hero + landing
│       │   ├── login/           # Auth two-column
│       │   ├── sidebar/         # Sidebar oscuro
│       │   ├── dashboard/       # Panel principal
│       │   ├── pedidos/         # Gestión pedidos
│       │   ├── pagos/           # Gestión pagos
│       │   ├── acerca/          # Quiénes somos
│       │   ├── concesionarios/  # Red dealers
│       │   ├── planes/          # Financiamiento
│       │   ├── promociones/     # Ofertas vigentes
│       │   ├── contacto/        # Formulario PQR
│       │   └── simulador/       # Calculadora crédito
│       ├── guards/              # authGuard, adminGuard
│       ├── interceptors/        # JWT interceptor
│       └── services/            # AuthService, etc.
├── .github/workflows/
│   └── deploy.yml               # CI/CD → Azure ACR
├── docker-compose.yml           # Orquestación local
└── ProyectoPedidos.postman_collection.json
```

---

## 👨‍💻 Autor

**Alejandro Reyes**
Desarrollador Fullstack — Portfolio 2026
📧 alejandrochreyes2@gmail.com

---

*Proyecto desarrollado como prueba técnica de nivel enterprise fullstack.*
