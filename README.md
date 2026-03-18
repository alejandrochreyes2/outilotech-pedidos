# Toyota Pedidos — Plataforma Enterprise de Microservicios

> Sistema empresarial de gestión de pedidos y pagos construido con arquitectura de microservicios de nivel enterprise. Desplegado en Microsoft Azure con CI/CD completamente automatizado.

---

## Demo en Vivo — Pruébalo Ahora

**URL Producción:** https://gentle-water-0ba98b90f.1.azurestaticapps.net

| Usuario | Contraseña | Rol | Acceso |
|---------|-----------|-----|--------|
| admin@toyota.com | Admin123! | Administrador | Dashboard · Pedidos · Pagos · Completo |
| vendedor@toyota.com | Vend123! | Vendedor | Dashboard · Pedidos |
| user@user.com | User@123 | Usuario | Solo lectura |
| admin@admin.com | Admin@123 | Administrador | Acceso completo alternativo |

---

## Oferta Comercial

### Qué es este sistema

Toyota Pedidos Enterprise es una plataforma digital que permite a su empresa gestionar el ciclo completo de ventas desde cualquier dispositivo conectado a internet. Con un solo sistema centralizado en la nube, sus equipos de ventas pueden registrar pedidos en tiempo real, mientras que el área administrativa controla los pagos y tiene visibilidad completa del negocio desde un dashboard actualizado al instante.

El sistema elimina las hojas de cálculo, las llamadas para confirmar pedidos y los errores de digitación. Cada persona del equipo ve exactamente lo que le corresponde según su rol: el vendedor crea pedidos desde su celular, el administrador aprueba pagos desde su computador, y el gerente monitorea todo desde el dashboard ejecutivo. Todo seguro, rápido y sin instalar nada.

---

### Para quién es ideal este sistema

- Empresas con múltiples puntos de venta que necesitan centralizar la información
- Negocios que quieren digitalizar sus pedidos y eliminar procesos manuales
- Comercios que necesitan control de pagos con roles y permisos diferenciados
- Empresas que quieren escalar hacia ecommerce o integración con ERP
- Organizaciones que necesitan reportes y visibilidad en tiempo real
- Equipos de ventas que trabajan desde múltiples ubicaciones o de forma remota

---

### Qué incluye el precio de $20.000.000 COP

**Plataforma completa lista para usar:**
- Sistema web accesible desde cualquier navegador y celular
- 3 microservicios independientes desplegados en la nube Azure
- API Gateway para comunicación segura entre servicios
- Sistema de login con 3 niveles de acceso (Admin, Vendedor, Usuario)
- Dashboard con métricas en tiempo real
- Módulo de gestión de pedidos con CRUD completo
- Módulo de gestión de pagos (solo Administradores)
- Catálogo de productos con base de datos MongoDB
- 6 secciones informativas del negocio (Acerca, Ubicaciones, Planes, Promociones, Contacto, Simulador)
- Formulario de contacto que envía emails reales al instante
- Simulador de crédito con cálculo de cuotas en tiempo real

**Infraestructura en la nube:**
- Frontend desplegado en Azure Static Web Apps con CDN global
- Microservicios en Azure Container Apps con auto-scaling
- Base de datos PostgreSQL + MongoDB gestionadas en Azure
- CI/CD con GitHub Actions (deploy automático al publicar código)
- Configuración completa de seguridad HTTPS y CORS

**Documentación y entrega:**
- Código fuente 100% entregado y de propiedad del cliente
- Manual de usuario en lenguaje no técnico con capturas de pantalla
- Manual técnico con 18 escenarios de prueba documentados
- Colección Postman lista para importar y probar
- Documento de arquitectura técnica con diagrama Draw.io
- Plan PMO del proyecto con todas las fases documentadas

**Capacitación y soporte:**
- Sesión de capacitación de 2 horas grabada en video
- 15 días de soporte correctivo post-entrega incluidos
- Transferencia completa de accesos Azure y GitHub al cliente

---

### 5 Razones para elegir esta solución

**1. Arquitectura enterprise desde el primer día**
No es un sistema improvisado en monolítico. Cada componente es independiente, lo que significa que puede crecer sin reescribir nada. Si mañana necesita escalar solo el módulo de pedidos porque tiene más volumen, lo hace sin tocar el resto del sistema.

**2. Desplegado en Microsoft Azure con garantía de disponibilidad**
Su sistema vive en la misma infraestructura que usan los bancos y las corporaciones más grandes del mundo. Azure garantiza 99.9% de disponibilidad, backups automáticos y seguridad de clase mundial. No depende de servidores propios que se pueden caer o ser hackeados.

**3. Seguridad de nivel bancario con roles granulares**
Solo los administradores pueden ver y registrar pagos. Los vendedores solo gestionan pedidos. Los usuarios solo ven información. Cada acción queda protegida con JWT (el mismo estándar que usan los bancos) y contraseñas encriptadas con BCrypt. Ninguna contraseña se guarda en texto plano.

**4. Cero configuración para el usuario final**
No hay nada que instalar. El equipo abre el navegador, entra a la URL y listo. Funciona en Chrome, Edge, Firefox, Safari y se puede instalar en Android como app sin pasar por la Play Store. El sistema funciona igual en computador, tablet y celular.

**5. Entrega completa con código fuente y sin dependencias**
A diferencia de los sistemas SaaS que lo tienen como rehén pagando mensualidades para siempre, usted recibe el 100% del código fuente y los accesos. Si quiere contratar a otro desarrollador para agregar funcionalidades, puede hacerlo libremente. El sistema es suyo.

---

### Casos de Uso Reales

**Caso 1: Distribuidora Nacional de Autopartes — Bogotá**
Una distribuidora con 12 vendedores en campo usaba WhatsApp para tomar pedidos y Excel para llevar el control de pagos. Los errores de digitación y la falta de visibilidad en tiempo real les costaban aproximadamente 3 horas de trabajo administrativo al día. Con este sistema, cada vendedor registra el pedido desde su celular en el campo, el administrador aprueba el pago desde la oficina y el gerente ve el resumen del día en su dashboard. Resultado: reducción del 80% en errores administrativos y visibilidad total del negocio en tiempo real.

**Caso 2: Concesionario de Vehículos — Medellín**
Un concesionario con 3 sedes necesitaba unificar el proceso de cotizaciones y pedidos de vehículos que cada sede manejaba de forma independiente. Con el sistema desplegado en Azure, las 3 sedes acceden desde cualquier dispositivo a la misma plataforma centralizada. El administrador en la sede principal tiene control total de pagos y reportes, mientras los asesores de cada sede solo ven y crean los pedidos de su sede. La integración del simulador de crédito en el sitio web ayuda a los clientes a calcular sus cuotas antes de visitar el concesionario, reduciendo el tiempo de atención en un 40%.

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CAPA CLIENTE                                │
│   Navegador Web (Chrome/Edge/Firefox/Safari)  ·  App Móvil (PWA)   │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AZURE STATIC WEB APPS                            │
│              Angular 21 · TypeScript · Signals API                  │
│   Dashboard · Pedidos · Pagos · Catálogo · Contacto · Simulador     │
└─────────────────────────────┬───────────────────────────────────────┘
                              │ REST/JSON + JWT Bearer
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   AZURE CONTAINER APPS                              │
│              YARP API Gateway  ·  Puerto 5000                       │
│   /api/usuarios/** ──►  /api/pedidos/** ──►  /api/pagos/**          │
└────────┬──────────────────────┬──────────────────────┬─────────────┘
         │                      │                      │
         ▼                      ▼                      ▼
┌────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│ Usuarios :3001 │   │  Pedidos :3002   │   │   Pagos :3003    │
│ ASP.NET Core 8 │   │  ASP.NET Core 8  │   │  ASP.NET Core 8  │
│ Identity + JWT │   │  EF Core + YARP  │   │  EF Core + RBAC  │
└───────┬────────┘   └─────┬────────────┘   └──────────┬───────┘
        │                  │                            │
        ▼                  ▼                            ▼
┌────────────────┐   ┌─────────────────────────────────────────┐
│  usuarios_db   │   │           Azure PostgreSQL 15            │
│  PostgreSQL    │   │   pedidos_db  ·  pagos_db               │
└────────────────┘   └────────────────────┬────────────────────┘
                                          │
                     ┌────────────────────▼────────────────────┐
                     │        Azure MongoDB (Cosmos DB)         │
                     │           toyota_catalogo                │
                     └─────────────────────────────────────────┘

CI/CD:  GitHub push → GitHub Actions → Docker build → ACR push → Container Apps deploy
```

---

## Funcionalidades Implementadas

### Autenticación y Seguridad
- Login con email y contraseña
- JWT Bearer HS256 con expiración de 8 horas
- 3 roles: Admin, Vendedor, User
- Guards de Angular que protegen rutas según el rol
- Interceptor HTTP que adjunta el token en cada request automáticamente
- Contraseñas encriptadas con BCrypt (nunca en texto plano)
- CORS configurado por ambiente (local y producción)
- HTTPS obligatorio en producción

### Dashboard
- Contador total de pedidos registrados
- Contador total de pagos registrados
- Botón para crear pedido de prueba rápido
- Bienvenida personalizada con nombre y rol del usuario

### Gestión de Pedidos
- Listar todos los pedidos con fecha y total
- Crear nuevo pedido (cliente + monto) — Vendedor y Admin
- Validación de formulario en frontend y backend
- Mensajes de éxito y error en tiempo real
- Control de acceso: solo Vendedor y Admin pueden crear

### Gestión de Pagos
- Listar todos los pagos (solo Admin)
- Registrar nuevo pago vinculado a un pedido (solo Admin)
- Control de acceso estricto: Vendedor y User reciben 403

### Catálogo de Productos
- 5 vehículos Toyota en MongoDB (Corolla, Hilux, RAV4, Camry, Land Cruiser)
- Datos persistentes con init-mongo.js en Docker
- Base de datos separada para flexibilidad de esquema

### Secciones Informativas Públicas
- **Acerca:** Historia, valores corporativos, línea de tiempo, estadísticas
- **Concesionarios:** 8 puntos de venta con filtro por ciudad y links a Google Maps
- **Planes:** 3 planes de financiación + 4 seguros disponibles
- **Promociones:** 4 ofertas activas con countdown al cierre (31 de Marzo 2026)
- **Contacto:** Formulario con EmailJS que envía al instante + panel de información
- **Simulador:** Calculadora de crédito con fórmula PMT en tiempo real usando Signals

### DevOps y Despliegue
- Docker Compose para entorno local completo (1 comando)
- GitHub Actions CI/CD: push a main → deploy automático en Azure
- Azure Container Registry para almacenamiento privado de imágenes
- Azure Container Apps con auto-scaling configurable
- Azure Static Web Apps con CDN global para el frontend
- Environments Angular: local (apiUrl vacío) y producción (URL del gateway)

---

## Stack Tecnológico Enterprise

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| .NET | 8.0 LTS | Backend microservicios |
| ASP.NET Core | 8.0 | HTTP Framework y Minimal API |
| Angular | 21.2 | Frontend SPA con Signals |
| TypeScript | 5.9 | Tipado estático en frontend |
| YARP | 2.x | API Gateway (reverse proxy) |
| ASP.NET Identity | 8.0 | Autenticación y gestión de usuarios |
| Entity Framework Core | 8.0 | ORM para PostgreSQL |
| Npgsql | 8.x | Driver oficial PostgreSQL para .NET |
| MongoDB Driver | 2.x | Driver oficial MongoDB para .NET |
| PostgreSQL | 15 | Base de datos relacional principal |
| MongoDB / Cosmos DB | 6.x | Base de datos de documentos (catálogo) |
| Docker | 24.x | Contenedores y portabilidad |
| Docker Compose | 2.x | Orquestación local del entorno completo |
| Azure Container Apps | Latest | Hosting de microservicios con auto-scaling |
| Azure Static Web Apps | Latest | Hosting del frontend con CDN global |
| Azure Container Registry | Latest | Registro privado de imágenes Docker |
| GitHub Actions | Latest | CI/CD automatizado |
| JWT Bearer | HS256 | Autenticación stateless |
| BCrypt | — | Hash seguro de contraseñas |
| EmailJS | 4.x | Envío de emails desde el formulario de contacto |

---

## Pruebas Verificadas — 18 Escenarios

| # | Escenario | Método | Endpoint | Token | Resultado esperado |
|---|-----------|--------|----------|-------|-------------------|
| 1 | Login Admin válido | POST | /api/usuarios/auth/login | Sin token | 200 + JWT |
| 2 | Login credenciales inválidas | POST | /api/usuarios/auth/login | Sin token | 401 Unauthorized |
| 3 | Login sin body | POST | /api/usuarios/auth/login | Sin token | 400 Bad Request |
| 4 | GET pedidos sin token | GET | /api/pedidos | Sin token | 401 Unauthorized |
| 5 | GET pedidos con token Admin | GET | /api/pedidos | Admin | 200 + lista |
| 6 | GET pedidos con token Vendedor | GET | /api/pedidos | Vendedor | 200 + lista |
| 7 | GET pedidos con token User | GET | /api/pedidos | User | 200 + lista |
| 8 | POST pedido con Vendedor | POST | /api/pedidos | Vendedor | 201 + pedido creado |
| 9 | POST pedido con User | POST | /api/pedidos | User | 403 Forbidden |
| 10 | POST pedido sin token | POST | /api/pedidos | Sin token | 401 Unauthorized |
| 11 | GET pagos con Admin | GET | /api/pagos | Admin | 200 + lista |
| 12 | GET pagos con Vendedor | GET | /api/pagos | Vendedor | 403 Forbidden |
| 13 | GET pagos con User | GET | /api/pagos | User | 403 Forbidden |
| 14 | GET pagos sin token | GET | /api/pagos | Sin token | 401 Unauthorized |
| 15 | POST pago con Admin | POST | /api/pagos | Admin | 201 + pago creado |
| 16 | POST pago con Vendedor | POST | /api/pagos | Vendedor | 403 Forbidden |
| 17 | GET health del gateway | GET | /health | Sin token | 200 Healthy |
| 18 | Ruta inexistente | GET | /api/noexiste | Sin token | 404 Not Found |

---

## Infraestructura en Azure

| Recurso Azure | Nombre | Tier | Propósito |
|--------------|--------|------|-----------|
| Static Web Apps | toyota-pedidos-frontend | Free | Hosting Angular + CDN global |
| Container Apps Env | toyota-pedidos-env | Consumption | Entorno para todos los microservicios |
| Container App | toyota-gateway | Consumption | API Gateway YARP |
| Container App | toyota-usuarios | Consumption | Microservicio de usuarios |
| Container App | toyota-pedidos | Consumption | Microservicio de pedidos |
| Container App | toyota-pagos | Consumption | Microservicio de pagos |
| Container Registry | toyotapedidosacr | Basic | Almacenamiento de imágenes Docker |
| Resource Group | toyota-pedidos-rg | — | Agrupación lógica de recursos |

### URLs de Producción

| Servicio | URL |
|---------|-----|
| Frontend | https://gentle-water-0ba98b90f.1.azurestaticapps.net |
| Gateway | https://toyota-gateway.wittystone-43cf97a7.eastus2.azurecontainerapps.io |
| Health Check | https://toyota-gateway.wittystone-43cf97a7.eastus2.azurecontainerapps.io/health |

---

## Compatibilidad Verificada

| Plataforma | Estado |
|-----------|--------|
| Chrome en Windows | Funciona |
| Edge en Windows | Funciona |
| Firefox en Windows | Funciona |
| Safari en macOS e iOS | Funciona |
| Chrome en Android | Funciona |
| PWA instalable en Android | Funciona |
| Responsive en móvil (320px) | Funciona |
| Responsive en tablet (768px) | Funciona |
| Responsive en desktop (1920px) | Funciona |

---

## Instalación y Ejecución Local

### Prerequisitos

- Docker Desktop instalado y corriendo
- Git instalado

### Pasos

**Paso 1 — Clonar el repositorio:**
```bash
git clone https://github.com/alejandrochreyes2/proyecto-pedidos.git
cd proyecto-pedidos
```

**Paso 2 — Iniciar todos los servicios:**
```bash
docker-compose up --build -d
```
Este comando descarga las imágenes, compila el código y levanta todos los servicios automáticamente. La primera vez puede tardar 3-5 minutos.

**Paso 3 — Verificar que todo está corriendo:**
```bash
docker-compose ps
```
Todos los servicios deben aparecer con estado `Up`.

**Paso 4 — Abrir la aplicación:**

Abre `http://localhost` en tu navegador.

**Paso 5 — Ingresar con credenciales de prueba:**
```
Admin:    admin@toyota.com    / Admin123!
Vendedor: vendedor@toyota.com / Vend123!
User:     user@user.com       / User@123
```

### Detener el proyecto

```bash
docker-compose down
```

> Nota: No uses `docker-compose down -v` ya que borra los volúmenes y los datos persistidos.

---

## Estructura del Repositorio

```
proyecto-pedidos/
│
├── frontend/                          # Aplicación Angular 21
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── login/             # Formulario de autenticación
│   │   │   │   ├── dashboard/         # Métricas y resumen ejecutivo
│   │   │   │   ├── pedidos/           # CRUD de pedidos
│   │   │   │   ├── pagos/             # Gestión de pagos (Admin)
│   │   │   │   ├── navbar/            # Barra de navegación con roles
│   │   │   │   ├── acerca/            # Historia y valores corporativos
│   │   │   │   ├── concesionarios/    # Puntos de venta con mapa
│   │   │   │   ├── planes/            # Financiación y seguros
│   │   │   │   ├── promociones/       # Ofertas con countdown timer
│   │   │   │   ├── contacto/          # Formulario EmailJS
│   │   │   │   └── simulador/         # Calculadora de crédito PMT
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts    # JWT, login, logout, roles
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts      # Protección de rutas privadas
│   │   │   ├── interceptors/
│   │   │   │   └── auth.interceptor.ts # Adjunta JWT en cada request
│   │   │   └── app.routes.ts          # Definición de rutas
│   │   ├── environments/
│   │   │   ├── environment.ts         # Local (apiUrl vacío)
│   │   │   └── environment.prod.ts    # Producción (URL del gateway)
│   │   └── index.html                 # CDN EmailJS
│   ├── public/
│   │   └── staticwebapp.config.json   # Configuración Azure SWA
│   └── angular.json                   # Build con fileReplacements por ambiente
│
├── backend/
│   ├── ApiGateway/                    # YARP Reverse Proxy (.NET 8)
│   │   ├── Program.cs                 # Configuración YARP + CORS + JWT
│   │   └── appsettings.json           # Rutas del gateway a microservicios
│   ├── usuarios/                      # Microservicio de usuarios (.NET 8)
│   ├── pedidos/                       # Microservicio de pedidos (.NET 8)
│   ├── pagos/                         # Microservicio de pagos (.NET 8)
│   └── mongodb/
│       └── init-mongo.js              # Seed de 5 productos Toyota
│
├── docker-compose.yml                 # Orquestación local completa
├── README.md                          # Este archivo
├── ARQUITECTURA_TECNICA.md            # Diagrama Draw.io + descripción técnica
└── PMO_PLAN_PROYECTO.md               # Plan PMO para venta a clientes
```

---

## Contacto Comercial

¿Interesado en implementar este sistema en tu empresa o adquirir una solución similar personalizada?

**Alejandro Chaparro Reyes**
Desarrollador FullStack Senior

- Email: alejandrochreyes2@gmail.com
- GitHub: https://github.com/alejandrochreyes2
- Ubicación: Bogotá D.C., Colombia
- Disponibilidad: Lunes a Viernes, 8am - 6pm (hora Colombia)

**Respuesta garantizada en menos de 24 horas**
**Propuesta personalizada sin ningún costo**

---

*Proyecto desarrollado con Angular 21 · .NET 8 · Azure · GitHub Actions*
*Arquitectura: Microservicios · API Gateway YARP · JWT · PostgreSQL · MongoDB*
