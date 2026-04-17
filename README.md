# OutilTech — Tienda E-Commerce de Tecnología (Colombia)

> Plataforma de e-commerce para venta de dispositivos electrónicos (Apple, Samsung, Android, Segway) con arquitectura de microservicios en .NET 8, frontend Angular 21 y despliegue en Microsoft Azure. Desarrollada para **OutilTech**, tienda ubicada en Cra 2A No 18A-52, Bogotá — Teléfonos: 304 592 8793 / 305 780 4236.

---

## Contexto para IA (DeepSeek / Claude / GPT)

Este documento describe el estado actual completo del proyecto para que cualquier IA pueda retomar el trabajo sin preguntas adicionales.

**El proyecto tiene DOS partes:**
1. **Frontend Angular 21** — Tienda e-commerce pública (OutilTech) con catálogo de 114 productos, carrito, detalle de producto, checkout y filtros por marca/categoría.
2. **Backend .NET 8** — Sistema de gestión interna (pedidos, pagos, usuarios) con 3 microservicios, API Gateway YARP, PostgreSQL y MongoDB.

**Todo el trabajo activo está en el FRONTEND.** El backend ya está funcional y desplegado en Azure.

---

## Estado Actual del Frontend (Abril 2026)

### Sección HOME — `HomeComponent`

**Archivo:** `frontend/src/app/components/home/home.component.ts/html/css`

El home tiene 4 secciones principales:

#### 1. Hero Slider (`#ot-hero`)
- 8 slides: video local (MacBook), MacBook M5, iPhone Air offer, Apple Watch Ultra 3, Análisis Forense Digital, Samsung Galaxy S25, ISO 27001, Ciberseguridad
- Autoplay cada 6 segundos con flechas `<` `>` y dots de navegación
- Video de fondo con `autoplay muted loop`

#### 2. "Explora nuestra línea" (`#categorias`) — RECIÉN MODIFICADO
Grid de 3 filas con 19 iconos de marcas/categorías:
- **Fila 1** (índices 0–7): Apple · Samsung · iPhone · Mac · iPad · Watch · AirPods · Redmi
- **Fila 2** (índices 8–15): Infinix · ZTE · Tecno · Oppo · Motorola · Huawei · Segway · Android
- **Fila 3** (índices 16–18): Accesorios · Exhibición · Patinetas

Cada tarjeta (`cat-pill`) es un `<button>` con:
- Imagen de producto como fondo visual (`object-fit: cover`, `height: 160px`)
- Nombre de marca como overlay (gradiente negro en la parte inferior)
- Al hacer clic → llama a `goToCategory(m.filtro)` que activa el filtro Y hace scroll a `#destacados`

El array `readonly marcas` en `home.component.ts` define los 19 iconos con `{label, img, filtro}`.

#### 3. "Productos Destacados" (`#destacados`) — RECIÉN MODIFICADO
- Barra de filtros con **carrusel horizontal** (flechas `<` `>` + scroll con `ViewChild`)
- **20 filtros** disponibles: Todos, Nuevo, Apple, iPhone, Mac, iPad, Watch, AirPods, Samsung, Android, Redmi, Infinix, ZTE, Tecno, Oppo, Motorola, Huawei, Exhibición, Accesorios, Patinetas
- Grid de productos: 4 columnas desktop → 3 en tablet → 2 en móvil
- Cada card muestra: imagen, badge, marca, nombre, precio, garantía, selector de cantidad +/-, botón "Agregar al carrito"
- Conteo de productos en tiempo real: `{{conteoFiltro}} productos`

Lógica de filtrado en `ProductosService.getPorCategoria(categoria)`:
```typescript
// 'Apple' → filtra por marca === 'Apple' (engloba iPhone, Mac, iPad, Watch, AirPods, Exhibición)
// 'Samsung' → filtra por marca === 'Samsung'
// 'Redmi','Infinix','ZTE','Tecno','Oppo','Motorola','Huawei','Segway' → filtra por marca
// 'iPhone','Mac','iPad','Watch','AirPods','Android','Exhibición','Accesorios','Patinetas' → filtra por categoria
// 'Nuevo' → productos con nuevo === true && !agotado
// 'Todos' → todos los 114 productos
```

#### 4. Banner Orange Days + Footer

---

### Catálogo de Productos — `ProductosService`

**Archivo:** `frontend/src/app/services/productos.service.ts`

- **114 productos** definidos estáticamente (no viene de API, todo en frontend)
- Función auxiliar `p(id, nombre, marca, categoria, subcategoria, precio, imagen, garantia, badge, destacado, nuevo, oferta, slug)`
- Interfaz `Producto`: `{id, nombre, marca, categoria, subcategoria, precio, imagen, imagenes, garantia, badge, destacado, nuevo, oferta, agotado, slug, variantes?, specs?, descripcion?}`

**Fuentes de imágenes (por CDN que permite hotlinking):**
```typescript
const C  = 'https://www.celudmovil.com.co/cdn/shop/files/'  // Apple, Samsung → CDN colombiano
const G  = 'https://fdn2.gsmarena.com/vv/bigpic/'           // Android brands (Redmi, Infinix, etc.)
const UN = 'https://images.unsplash.com/photo-'             // Accesorios, Patinetas, Mac, iPad
```

**IMPORTANTE — CDNs que BLOQUEAN hotlinking (NO usar):**
- `store.storeimages.cdn-apple.com` — CORS bloqueado
- `images.samsung.com` — hotlink bloqueado
- `tienda.segway.center/wp-content/` — WordPress hotlink protection activo

**Categorías de productos:**
| Categoría | Marcas incluidas | # Aprox. productos |
|-----------|-----------------|-------------------|
| iPhone | Apple | ~20 |
| Mac | Apple | ~8 |
| iPad | Apple | ~4 |
| Watch | Apple | ~6 |
| AirPods | Apple | ~4 |
| Samsung | Samsung | ~12 |
| Android | Redmi, Infinix, ZTE, Tecno, Oppo, Motorola, Huawei | ~40 |
| Exhibición | Apple (iPhones exhibición) | ~6 |
| Accesorios | Apple | ~4 |
| Patinetas | Segway | 4 |

**Imágenes múltiples para detalle de producto:**
```typescript
private readonly imgExtras: Record<string, string[]> = {
  iPhone: [...],   Samsung: [...],  Mac: [...],
  iPad: [...],     Watch: [...],    AirPods: [...],
  Android: [...],  Exhibición: [...], Accesorios: [...],
  Patinetas: [...],
}
```
`getProductoBySlug(slug)` inyecta automáticamente el array de `imagenes` desde `imgExtras`.

**Variantes de precio:**
Algunos productos tienen `variantes: [{storage, color, precio}]` — el usuario puede seleccionar y el precio cambia.

---

### Detalle de Producto — `ProductoDetalleComponent`

**Archivos:** `frontend/src/app/components/producto-detalle/producto-detalle.component.*`

**Ruta:** `/productos/:slug`

Diseño inspirado en tiendasishop.com:
- **Galería izquierda** (sticky): imagen principal grande (aspect-ratio 1:1) + thumbnails horizontales debajo
- **Info derecha**: marca, nombre, garantía, precio, selector de variantes, cantidad, total, botones
- Botones: "Agregar al carrito" (negro) + "Comprar ahora" (azul → `/checkout`)
- Métodos de pago: VISA, MC, PSE, Nequi, Efecty
- Especificaciones técnicas (tabla)
- Descripción
- Info adicional: dirección tienda, teléfonos, envío domicilio

---

### Carrito de Compras — `CartService`

**Archivo:** `frontend/src/app/services/cart.service.ts`

- Estado del carrito con Angular Signals (`signal<CartItem[]>`)
- `agregarItem(producto, variante?, cantidad)` — agrega o suma cantidad si ya existe
- `CartDropdownComponent` — dropdown del carrito visible en navbar/detalle
- **Ruta carrito completo:** `/carrito` → `CarritoComponent`
- **Checkout:** `/checkout` → `CheckoutComponent` (lazy loaded)

---

### Navegación — Rutas

```
/                → redirect a /home
/home            → HomeComponent (tienda principal)
/productos/:slug → ProductoDetalleComponent
/carrito         → CarritoComponent
/checkout        → CheckoutComponent (lazy load)
/login           → LoginComponent
/dashboard       → DashboardComponent (requiere auth)
/pedidos         → PedidosComponent (requiere auth)
/pagos           → PagosComponent (requiere auth + admin)
/nosotros        → NosotrosComponent (lazy load)
/servicios       → ServiciosComponent (lazy load)
/seguridad-forense → SeguridadForenseComponent (lazy load)
/iso27001        → Iso27001Component (lazy load)
/certificados    → CertificadosComponent (lazy load)
/software-medida → SoftwareMedidaComponent (lazy load)
/contacto        → ContactoComponent
/simulador       → SimuladorComponent
/acerca          → AcercaComponent
/mac, /iphone, /apple, /samsung → redirect a /home
```

---

## Arquitectura del Sistema

```
┌──────────────────────────────────────────────────────────────────────┐
│                      NAVEGADOR / USUARIO                             │
│           http://localhost:4200  (dev)  |  http://localhost (Docker) │
│           https://outiltech.co         (producción)                  │
└──────────────────────────┬───────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  FRONTEND — Angular 21                               │
│  Standalone Components · TypeScript 5.9 · Signals API               │
│                                                                      │
│  HomeComponent          → /home (tienda principal)                  │
│  ProductoDetalleComponent → /productos/:slug                        │
│  CarritoComponent       → /carrito                                   │
│  CheckoutComponent      → /checkout (lazy)                           │
│  LoginComponent         → /login                                     │
│  DashboardComponent     → /dashboard (auth)                          │
│  PedidosComponent       → /pedidos (auth)                            │
│  PagosComponent         → /pagos (auth + admin)                      │
│                                                                      │
│  Servicios:                                                          │
│  ProductosService  → catálogo estático 114 productos                │
│  CartService       → carrito con Signals                             │
│  AuthService       → JWT, login, roles                               │
│  ApiService        → HTTP cliente para backend                       │
└──────────────────────────┬───────────────────────────────────────────┘
                           │ REST/JSON + JWT Bearer
                           ▼
┌──────────────────────────────────────────────────────────────────────┐
│              API GATEWAY — YARP (.NET 8) · Puerto 5000              │
│   /api/usuarios/** → microservicio usuarios :3001                    │
│   /api/pedidos/**  → microservicio pedidos  :3002                    │
│   /api/pagos/**    → microservicio pagos    :3003                    │
└──────────┬──────────────────────┬──────────────────────┬────────────┘
           │                      │                      │
           ▼                      ▼                      ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  Usuarios :3001  │  │  Pedidos :3002   │  │   Pagos :3003    │
│  ASP.NET Core 8  │  │  ASP.NET Core 8  │  │  ASP.NET Core 8  │
│  Identity + JWT  │  │  EF Core         │  │  EF Core + RBAC  │
│  BCrypt          │  │                  │  │                  │
└────────┬─────────┘  └───────┬──────────┘  └──────────┬───────┘
         │                    │                         │
         ▼                    ▼                         ▼
┌──────────────────┐  ┌───────────────────────────────────────────┐
│  usuarios_db     │  │          PostgreSQL 15                    │
│  PostgreSQL      │  │   pedidos_db  ·  pagos_db                 │
└──────────────────┘  └────────────────────────────────────────────┘
                                    +
                      ┌────────────────────────────────────────────┐
                      │         MongoDB 6                          │
                      │         toyota_catalogo (legacy)           │
                      └────────────────────────────────────────────┘

CI/CD: GitHub push → GitHub Actions → Docker build → ACR → Azure Container Apps deploy
```

---

## Stack Tecnológico

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Angular | 21.2 | Frontend SPA |
| TypeScript | 5.9 | Tipado frontend |
| .NET / ASP.NET Core | 8.0 LTS | Backend microservicios |
| YARP | 2.x | API Gateway reverse proxy |
| Entity Framework Core | 8.0 | ORM PostgreSQL |
| ASP.NET Identity | 8.0 | Auth + roles |
| JWT Bearer HS256 | — | Autenticación stateless |
| BCrypt | — | Hash de contraseñas |
| PostgreSQL | 15 | Base de datos relacional |
| MongoDB | 6.x | Catálogo de productos legacy |
| Docker / Docker Compose | 24.x | Contenedores |
| Azure Static Web Apps | Latest | Hosting frontend |
| Azure Container Apps | Latest | Hosting microservicios |
| Azure Container Registry | Latest | Registro Docker |
| GitHub Actions | Latest | CI/CD automatizado |

---

## Entorno Local de Desarrollo

### Servicios corriendo en este momento (Docker)

```
CONTAINER                         PUERTO    ESTADO
proyecto-pedidos-frontend-1       80        Up (Nginx sirviendo Angular build)
proyecto-pedidos-apigateway-1     5000      Up
proyecto-pedidos-pedidos-1        3002      Up
proyecto-pedidos-usuarios-1       3001      Up
proyecto-pedidos-pagos-1          3003      Up
proyecto-pedidos-mongodb-1        27017     Up
proyecto-pedidos-postgres-1       5432      Up (healthy)
```

**Frontend local (ng serve):** `http://localhost:4200` — para desarrollo activo con HMR
**Frontend Docker:** `http://localhost:80` — build de producción (necesita rebuild para ver cambios)

### Levantar entorno completo

```bash
# Clonar
git clone https://github.com/alejandrochreyes2/proyecto-pedidos.git
cd proyecto-pedidos

# Iniciar todos los servicios Docker
docker-compose up --build -d

# Verificar que todo esté corriendo
docker-compose ps

# Para desarrollar el frontend con hot-reload
cd frontend
npm install
ng serve
# → abre http://localhost:4200
```

### Detener servicios

```bash
docker-compose down
# IMPORTANTE: NO usar docker-compose down -v (borra datos)
```

---

## Estructura del Repositorio

```
proyecto-pedidos/
│
├── frontend/                              # Angular 21 — Tienda OutilTech
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── home/                     # Página principal tienda
│   │   │   │   ├── home.component.ts     # Hero slider, filtros, marcas[], goToCategory()
│   │   │   │   ├── home.component.html   # Template: hero, cat-rows, feat-grid
│   │   │   │   └── home.component.css    # Estilos: cat-pill 3 filas, feat-card grid
│   │   │   ├── producto-detalle/         # Detalle producto + galería thumbnails
│   │   │   ├── carrito/                  # Vista completa carrito
│   │   │   ├── cart-dropdown/            # Dropdown carrito en navbar
│   │   │   ├── checkout/                 # Formulario de compra (lazy)
│   │   │   ├── navbar/                   # Navbar con carrito y auth
│   │   │   ├── login/                    # Autenticación JWT
│   │   │   ├── dashboard/               # Panel admin (auth)
│   │   │   ├── pedidos/                 # CRUD pedidos (auth)
│   │   │   ├── pagos/                   # Gestión pagos (auth + admin)
│   │   │   ├── nosotros/               # Quiénes somos (lazy)
│   │   │   ├── servicios/              # Servicios empresa (lazy)
│   │   │   ├── seguridad-forense/      # Servicio forense digital (lazy)
│   │   │   ├── iso27001/               # Certificación ISO 27001 (lazy)
│   │   │   ├── certificados/           # Certificados (lazy)
│   │   │   ├── software-medida/        # Dev a medida (lazy)
│   │   │   ├── contacto/               # Formulario EmailJS
│   │   │   ├── simulador/              # Calculadora crédito PMT
│   │   │   ├── acerca/                 # Historia corporativa
│   │   │   ├── concesionarios/         # Puntos de venta mapa
│   │   │   ├── planes/                 # Planes financiación
│   │   │   └── promociones/            # Ofertas countdown
│   │   ├── services/
│   │   │   ├── productos.service.ts    # ★ PRINCIPAL: 114 productos, filtros, imágenes
│   │   │   ├── cart.service.ts         # Carrito con Angular Signals
│   │   │   ├── auth.service.ts         # JWT, login, logout, roles
│   │   │   └── api.service.ts          # HTTP cliente backend
│   │   ├── guards/
│   │   │   ├── auth.guard.ts           # Protege rutas privadas
│   │   │   └── admin.guard.ts          # Solo rol Admin
│   │   ├── interceptors/
│   │   │   └── jwt.interceptor.ts      # Adjunta Bearer token automáticamente
│   │   ├── pipes/
│   │   │   └── safe-url.pipe.ts        # DomSanitizer para URLs dinámicas
│   │   └── app.routes.ts               # Definición de todas las rutas
│   ├── proxy.conf.json                 # Proxy dev: /api → localhost:5000
│   └── angular.json                    # Build config con fileReplacements
│
├── backend/
│   ├── ApiGateway/                     # YARP Reverse Proxy (.NET 8)
│   │   ├── Program.cs                  # YARP + CORS + JWT config
│   │   └── appsettings.json            # Rutas de proxy a microservicios
│   ├── usuarios/                       # Microservicio auth (.NET 8)
│   │   ├── Program.cs                  # Identity + JWT emisión
│   │   ├── AuthModels.cs               # DTOs login/register
│   │   └── UsuariosSeed.cs             # Seed de usuarios iniciales
│   ├── pedidos/                        # Microservicio pedidos (.NET 8)
│   │   └── Program.cs                  # CRUD Pedidos + EF Core
│   ├── pagos/                          # Microservicio pagos (.NET 8)
│   │   ├── Program.cs                  # CRUD Pagos + RBAC
│   │   ├── Pago.cs                     # Modelo de pago
│   │   ├── PagosController.cs          # Endpoints REST
│   │   └── PagosService.cs             # Lógica de negocio pagos
│   └── mongodb/
│       └── init-mongo.js               # Seed legacy catálogo Toyota
│
├── .github/workflows/
│   ├── azure-static-web-apps.yml       # CI/CD frontend → Azure SWA
│   ├── deploy.yml                      # CI/CD backend → Azure Container Apps
│   └── main.yml                        # Pipeline principal
│
├── docker-compose.yml                  # Orquestación local completa
├── docker-compose.azure.yml            # Config para Azure
├── deploy.sh                           # Script deploy manual
├── ProyectoPedidos.postman_collection.json  # Colección Postman 18 tests
└── README.md                           # Este archivo
```

---

## Información de Imágenes — Guía para IAs

### CDNs que SÍ permiten hotlinking (usar estos):

| CDN | Constante | Usado para |
|-----|-----------|-----------|
| `celudmovil.com.co/cdn/shop/files/` | `C` en service | Apple y Samsung — tienda colombiana Shopify |
| `fdn2.gsmarena.com/vv/bigpic/` | `G` en service | Android: Redmi, Infinix, ZTE, Tecno, Oppo, Motorola, Huawei |
| `images.unsplash.com/photo-` | `UN` en service | iPad, Mac M1, Accesorios, Patinetas |

### CDNs que BLOQUEAN hotlinking (NO usar):
- `store.storeimages.cdn-apple.com` → CORS error
- `images.samsung.com/is/image/samsung/` → 403 Forbidden
- `tienda.segway.center/wp-content/` → WordPress hotlink protection

### Patrón de imagen GSMarena:
```
https://fdn2.gsmarena.com/vv/bigpic/[marca]-[modelo].jpg
// Ejemplos correctos:
https://fdn2.gsmarena.com/vv/bigpic/xiaomi-redmi-note-14.jpg
https://fdn2.gsmarena.com/vv/bigpic/infinix-note-50-pro.jpg
https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s25-ultra5g.jpg
// NO usar: /pics/[marca]/... (ese formato da 404)
```

---

## Despliegue en Azure (Producción)

| Recurso | Nombre | Propósito |
|---------|--------|-----------|
| Static Web Apps | outiltech-frontend | Hosting Angular + CDN global |
| Container Apps Env | toyota-pedidos-env | Entorno microservicios |
| Container App | toyota-gateway | API Gateway YARP |
| Container App | toyota-usuarios | Microservicio usuarios |
| Container App | toyota-pedidos | Microservicio pedidos |
| Container App | toyota-pagos | Microservicio pagos |
| Container Registry | toyotapedidosacr | Imágenes Docker privadas |

### URLs Producción

| Servicio | URL |
|---------|-----|
| Frontend | https://outiltech.co / https://gentle-water-0ba98b90f.1.azurestaticapps.net |
| Gateway | https://toyota-gateway.wittystone-43cf97a7.eastus2.azurecontainerapps.io |
| Health | https://toyota-gateway.wittystone-43cf97a7.eastus2.azurecontainerapps.io/health |

---

## Backend — Endpoints Disponibles

Todos los endpoints pasan por el Gateway en el puerto 5000 localmente.

### Autenticación — `/api/usuarios/auth/`
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/usuarios/auth/login` | No | Login → devuelve JWT |
| POST | `/api/usuarios/auth/register` | No | Registro nuevo usuario |

### Pedidos — `/api/pedidos/`
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/pedidos` | Cualquier rol | Listar todos los pedidos |
| POST | `/api/pedidos` | Admin/Vendedor | Crear nuevo pedido |

### Pagos — `/api/pagos/`
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/pagos` | Solo Admin | Listar todos los pagos |
| POST | `/api/pagos` | Solo Admin | Registrar nuevo pago |

### Roles disponibles
- `Admin` — acceso completo
- `Vendedor` — pedidos sí, pagos no
- `User` — solo lectura pedidos

---

## Compatibilidad Verificada

| Plataforma | Estado |
|-----------|--------|
| Chrome / Edge / Firefox Windows | ✅ Funciona |
| Safari macOS / iOS | ✅ Funciona |
| Chrome Android | ✅ Funciona |
| PWA instalable Android | ✅ Funciona |
| Responsive móvil (320px) | ✅ Funciona |
| Responsive tablet (768px) | ✅ Funciona |
| Responsive desktop (1920px) | ✅ Funciona |

---

## Convenciones de Código

### Angular (frontend)
- Todos los componentes son **standalone** (`standalone: true`)
- Se usa **Signals** para estado reactivo (`signal<T>`, `computed()`)
- Importaciones en cada componente (no hay NgModule global)
- CSS en archivo separado por componente (no global salvo `styles.css`)
- `CommonModule` importado para `*ngFor`, `*ngIf`, `SlicePipe`
- Formateo de precios: `Intl.NumberFormat('es-CO', {style:'currency', currency:'COP', maximumFractionDigits:0})`

### Imagen fallback en producto card
```html
(error)="onImgError($event, p.categoria)"
```
```typescript
onImgError(event: Event, categoria: string) {
  const img = event.target as HTMLImageElement;
  const fallback = this.fallbackImg[categoria] ?? 'https://images.unsplash.com/...';
  if (img.src !== fallback) img.src = fallback;  // evita loop infinito
}
```

### Colores de marca OutilTech
- Naranja principal: `#FF6B00`
- Negro fondo: `#000000` / `#111`
- Azul acción: `#0071e3`

---

## Configuración de Cloudflare Pages en GitHub Actions

Para que el despliegue automático hacia Cloudflare Pages funcione, es necesario configurar el token de la API de Cloudflare en los secretos de GitHub Actions.

Hemos simplificado este proceso con un script automatizado. Sólo necesitas hacer lo siguiente:

1. Instalar [GitHub CLI (gh)](https://cli.github.com/).
2. Autenticarse ejecutando en tu terminal: `gh auth login`.
3. Ejecutar el script (usando Git Bash, WSL o Linux/Mac): `bash scripts/setup-cloudflare-secret.sh`.
4. Pegar el token `CLOUDFLARE_API_TOKEN` cuando el script lo solicite.

---

## Contacto del Desarrollador

**Alejandro Chaparro Reyes**
- Email: alejandrochreyes2@gmail.com
- GitHub: https://github.com/alejandrochreyes2
- Rama principal: `main`
- Bogotá D.C., Colombia
