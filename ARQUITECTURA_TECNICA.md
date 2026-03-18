# Arquitectura Técnica — Toyota Pedidos Enterprise

**Versión:** 1.0
**Fecha:** Marzo 2026
**Equipo:** Alejandro Chaparro Reyes · Claude Code (Arquitecto Senior) · Daniel (Tech Lead)

---

## 1. Resumen Ejecutivo

Toyota Pedidos Enterprise es una plataforma digital de gestión de pedidos y pagos construida sobre una arquitectura de microservicios desplegada en Microsoft Azure. El sistema permite a organizaciones comerciales administrar en tiempo real el ciclo completo de una venta: desde la autenticación segura de usuarios con roles diferenciados, hasta la creación de pedidos, el registro de pagos y la consulta del catálogo de productos.

El valor de negocio es concreto: elimina los procesos manuales basados en hojas de cálculo o sistemas obsoletos, centraliza la información en la nube con alta disponibilidad, y provee una interfaz web moderna accesible desde cualquier dispositivo. La arquitectura de microservicios garantiza que cada componente del sistema pueda escalar, actualizarse o reemplazarse de forma independiente, reduciendo el riesgo operativo y el costo de mantenimiento a largo plazo.

---

## 2. Visión General de la Arquitectura

### 2.1 Arquitectura de Microservicios

El sistema está dividido en servicios pequeños, autónomos y especializados, cada uno con su propia base de datos y ciclo de vida de despliegue. Esta decisión arquitectónica se tomó por las siguientes razones:

| Característica | Monolítico | Microservicios (este proyecto) |
|---|---|---|
| Escalabilidad | Todo el sistema o nada | Escala solo el servicio que lo necesita |
| Despliegue | Un artefacto único | Despliegue independiente por servicio |
| Fallo en cascada | Un bug puede caer todo | Aislamiento de fallos por servicio |
| Equipo | Un solo equipo coordinado | Equipos paralelos por servicio |
| Base de datos | Una sola DB compartida | DB dedicada por servicio |
| Tiempo de build | Crece con el proyecto | Constante por servicio |

### 2.2 Patrón API Gateway

Un único punto de entrada (YARP Gateway) recibe todas las solicitudes del frontend y las enruta al microservicio correspondiente. Esto simplifica la configuración del cliente, centraliza la autenticación JWT y permite aplicar políticas de seguridad en un solo lugar.

---

## 3. Diagrama de Arquitectura (Draw.io XML)

> **Para ver el diagrama:** Abre [app.diagrams.net](https://app.diagrams.net), ve a `Extras → Edit Diagram`, pega el XML completo y haz clic en OK.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<mxGraphModel dx="1422" dy="762" grid="1" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1654" pageHeight="1169" math="0" shadow="0">
  <root>
    <mxCell id="0" />
    <mxCell id="1" parent="0" />

    <!-- TÍTULO -->
    <mxCell id="2" value="Toyota Pedidos — Arquitectura de Microservicios en Azure" style="text;html=1;strokeColor=none;fillColor=none;align=center;verticalAlign=middle;whiteSpace=wrap;rounded=0;fontSize=18;fontStyle=1;fontColor=#1a1a2e;" vertex="1" parent="1">
      <mxGeometry x="200" y="20" width="1200" height="40" as="geometry" />
    </mxCell>

    <!-- ===== CAPA CLIENTE ===== -->
    <mxCell id="10" value="CAPA CLIENTE" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontStyle=1;fontSize=11;fontColor=#1565C0;" vertex="1" parent="1">
      <mxGeometry x="40" y="80" width="160" height="20" as="geometry" />
    </mxCell>
    <mxCell id="11" value="🌐 Navegador Web&#xa;Chrome / Edge / Firefox / Safari" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=11;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="60" y="110" width="200" height="60" as="geometry" />
    </mxCell>
    <mxCell id="12" value="📱 App Móvil&#xa;PWA instalable en Android/iOS" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#dae8fc;strokeColor=#6c8ebf;fontSize=11;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="290" y="110" width="200" height="60" as="geometry" />
    </mxCell>

    <!-- ===== CAPA FRONTEND ===== -->
    <mxCell id="20" value="CAPA FRONTEND — Azure" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontStyle=1;fontSize=11;fontColor=#1565C0;" vertex="1" parent="1">
      <mxGeometry x="40" y="220" width="220" height="20" as="geometry" />
    </mxCell>
    <mxCell id="21" value="☁️ Azure Static Web Apps&#xa;URL: gentle-water-0ba98b90f.1.azurestaticapps.net" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#1e88e5;strokeColor=#0d47a1;fontSize=11;fontColor=#ffffff;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="60" y="250" width="340" height="50" as="geometry" />
    </mxCell>
    <mxCell id="22" value="⚡ Angular 21 SPA&#xa;Signals · Guards · Interceptors · PWA&#xa;Módulos: Login · Dashboard · Pedidos · Pagos · Catálogo · Contacto · Simulador" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#42a5f5;strokeColor=#1565C0;fontSize=10;fontColor=#ffffff;" vertex="1" parent="1">
      <mxGeometry x="60" y="315" width="340" height="70" as="geometry" />
    </mxCell>

    <!-- ===== CAPA API GATEWAY ===== -->
    <mxCell id="30" value="CAPA API GATEWAY" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontStyle=1;fontSize=11;fontColor=#6a1b9a;" vertex="1" parent="1">
      <mxGeometry x="500" y="220" width="220" height="20" as="geometry" />
    </mxCell>
    <mxCell id="31" value="🔀 YARP API Gateway&#xa;Azure Container Apps · Puerto 5000&#xa;JWT Validation · CORS · Rate Limiting&#xa;/api/usuarios/** → Usuarios&#xa;/api/pedidos/**  → Pedidos&#xa;/api/pagos/**    → Pagos" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#7b1fa2;strokeColor=#4a148c;fontSize=10;fontColor=#ffffff;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="250" width="280" height="135" as="geometry" />
    </mxCell>

    <!-- ===== CAPA MICROSERVICIOS ===== -->
    <mxCell id="40" value="CAPA MICROSERVICIOS — Azure Container Apps" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontStyle=1;fontSize=11;fontColor=#2e7d32;" vertex="1" parent="1">
      <mxGeometry x="880" y="160" width="400" height="20" as="geometry" />
    </mxCell>

    <!-- Usuarios Service -->
    <mxCell id="41" value="👤 Usuarios Service&#xa;Puerto: 3001&#xa;ASP.NET Identity + JWT&#xa;Roles: Admin / Vendedor / User&#xa;Endpoints: POST /auth/login&#xa;            GET /usuarios&#xa;            POST /usuarios/register" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#388e3c;strokeColor=#1b5e20;fontSize=10;fontColor=#ffffff;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="880" y="190" width="240" height="130" as="geometry" />
    </mxCell>

    <!-- Pedidos Service -->
    <mxCell id="42" value="📦 Pedidos Service&#xa;Puerto: 3002&#xa;Entity Framework Core 8&#xa;Repository Pattern + DTOs&#xa;Endpoints: GET /pedidos&#xa;            POST /pedidos&#xa;            GET /pedidos/{id}&#xa;            DELETE /pedidos/{id}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#388e3c;strokeColor=#1b5e20;fontSize=10;fontColor=#ffffff;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="880" y="340" width="240" height="140" as="geometry" />
    </mxCell>

    <!-- Pagos Service -->
    <mxCell id="43" value="💳 Pagos Service&#xa;Puerto: 3003&#xa;Entity Framework Core 8&#xa;Solo Admin puede crear pagos&#xa;Endpoints: GET /pagos&#xa;            POST /pagos&#xa;            GET /pagos/{id}" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#388e3c;strokeColor=#1b5e20;fontSize=10;fontColor=#ffffff;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="880" y="500" width="240" height="130" as="geometry" />
    </mxCell>

    <!-- ===== CAPA DATOS ===== -->
    <mxCell id="50" value="CAPA DATOS — Azure PaaS" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontStyle=1;fontSize=11;fontColor=#e65100;" vertex="1" parent="1">
      <mxGeometry x="1200" y="160" width="280" height="20" as="geometry" />
    </mxCell>

    <!-- PostgreSQL -->
    <mxCell id="51" value="🐘 PostgreSQL 15&#xa;Azure Database for PostgreSQL&#xa;&#xa;├── usuarios_db&#xa;│   └── Usuarios + Credenciales&#xa;├── pedidos_db&#xa;│   └── Pedidos + Estados&#xa;└── pagos_db&#xa;    └── Pagos + Montos" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#e65100;strokeColor=#bf360c;fontSize=10;fontColor=#ffffff;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="1200" y="190" width="260" height="180" as="geometry" />
    </mxCell>

    <!-- MongoDB -->
    <mxCell id="52" value="🍃 MongoDB&#xa;Azure Cosmos DB for MongoDB&#xa;&#xa;└── toyota_catalogo&#xa;    └── productos&#xa;        (5 vehículos Toyota)" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#f57c00;strokeColor=#e65100;fontSize=10;fontColor=#ffffff;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="1200" y="390" width="260" height="130" as="geometry" />
    </mxCell>

    <!-- ===== CAPA DEVOPS ===== -->
    <mxCell id="60" value="CAPA DevOps" style="text;html=1;strokeColor=none;fillColor=none;align=left;verticalAlign=middle;fontStyle=1;fontSize=11;fontColor=#37474f;" vertex="1" parent="1">
      <mxGeometry x="500" y="440" width="200" height="20" as="geometry" />
    </mxCell>
    <mxCell id="61" value="🐙 GitHub Actions CI/CD&#xa;Trigger: Push a main&#xa;Build .NET → Docker → ACR → Deploy Azure" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#546e7a;strokeColor=#263238;fontSize=10;fontColor=#ffffff;fontStyle=1;" vertex="1" parent="1">
      <mxGeometry x="500" y="465" width="280" height="70" as="geometry" />
    </mxCell>
    <mxCell id="62" value="📦 Azure Container Registry&#xa;toyotapedidosacr.azurecr.io&#xa;gateway:latest · usuarios:latest&#xa;pedidos:latest · pagos:latest" style="rounded=1;whiteSpace=wrap;html=1;fillColor=#607d8b;strokeColor=#37474f;fontSize=10;fontColor=#ffffff;" vertex="1" parent="1">
      <mxGeometry x="500" y="555" width="280" height="80" as="geometry" />
    </mxCell>

    <!-- ===== FLECHAS ===== -->

    <!-- Navegador → Frontend -->
    <mxCell id="70" value="HTTPS" style="edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;exitX=1;exitY=0.5;entryX=0;entryY=0.5;strokeColor=#1565C0;strokeWidth=2;fontColor=#1565C0;fontStyle=1;" edge="1" source="11" target="21" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- App Móvil → Frontend -->
    <mxCell id="71" value="HTTPS" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#1565C0;strokeWidth=2;fontColor=#1565C0;fontStyle=1;" edge="1" source="12" target="21" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- Frontend → Gateway -->
    <mxCell id="72" value="REST/JSON&#xa;JWT Bearer" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#7b1fa2;strokeWidth=2;fontColor=#7b1fa2;fontStyle=1;" edge="1" source="22" target="31" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- Gateway → Usuarios -->
    <mxCell id="73" value="/api/usuarios/**" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#2e7d32;strokeWidth=2;fontColor=#2e7d32;fontStyle=1;" edge="1" source="31" target="41" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- Gateway → Pedidos -->
    <mxCell id="74" value="/api/pedidos/**" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#2e7d32;strokeWidth=2;fontColor=#2e7d32;fontStyle=1;" edge="1" source="31" target="42" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- Gateway → Pagos -->
    <mxCell id="75" value="/api/pagos/**" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#2e7d32;strokeWidth=2;fontColor=#2e7d32;fontStyle=1;" edge="1" source="31" target="43" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- Usuarios → PostgreSQL -->
    <mxCell id="76" value="EF Core&#xa;usuarios_db" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#e65100;strokeWidth=2;fontColor=#e65100;fontStyle=1;" edge="1" source="41" target="51" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- Pedidos → PostgreSQL -->
    <mxCell id="77" value="EF Core&#xa;pedidos_db" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#e65100;strokeWidth=2;fontColor=#e65100;fontStyle=1;" edge="1" source="42" target="51" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- Pagos → PostgreSQL -->
    <mxCell id="78" value="EF Core&#xa;pagos_db" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#e65100;strokeWidth=2;fontColor=#e65100;fontStyle=1;" edge="1" source="43" target="51" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- Pedidos → MongoDB -->
    <mxCell id="79" value="MongoDB Driver&#xa;toyota_catalogo" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#f57c00;strokeWidth=2;fontColor=#f57c00;fontStyle=1;" edge="1" source="42" target="52" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- GitHub Actions → ACR -->
    <mxCell id="80" value="docker push" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#546e7a;strokeWidth=2;fontColor=#546e7a;fontStyle=1;" edge="1" source="61" target="62" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

    <!-- ACR → Microservicios -->
    <mxCell id="81" value="az containerapp update" style="edgeStyle=orthogonalEdgeStyle;rounded=0;strokeColor=#607d8b;strokeWidth=2;fontColor=#607d8b;fontStyle=1;" edge="1" source="62" target="41" parent="1">
      <mxGeometry relative="1" as="geometry" />
    </mxCell>

  </root>
</mxGraphModel>
```

### 3.1 Cómo importar el diagrama en Draw.io

1. Abre [https://app.diagrams.net](https://app.diagrams.net) en tu navegador
2. Crea un nuevo diagrama en blanco
3. Ve al menú `Extras → Edit Diagram`
4. Borra todo el contenido del cuadro
5. Pega el XML completo del bloque de código anterior
6. Haz clic en **OK**
7. El diagrama completo aparecerá con todas las capas y conexiones
8. Usa `Ctrl+Shift+H` para centrar el diagrama en pantalla

---

## 4. Descripción de Cada Microservicio

### 4.1 Usuarios Service

| Campo | Detalle |
|---|---|
| **Responsabilidad** | Autenticación, registro y gestión de usuarios con roles |
| **Puerto interno** | 3001 |
| **Base de datos** | PostgreSQL · usuarios_db |
| **Tecnologías** | ASP.NET Core 8, EF Core 8, Npgsql, ASP.NET Identity, JWT Bearer HS256 |

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|--------------|-------------|
| POST | /api/usuarios/auth/login | Pública | Genera JWT con rol y expiración |
| POST | /api/usuarios/register | Admin | Crea nuevo usuario con rol |
| GET | /api/usuarios | Admin | Lista todos los usuarios |
| GET | /api/usuarios/{id} | Admin/Vendedor | Obtiene usuario por ID |
| DELETE | /api/usuarios/{id} | Admin | Elimina usuario |

**Usuarios sembrados (seed data):**
- `admin@toyota.com` / `Admin123!` → Rol: Admin
- `vendedor@toyota.com` / `Vend123!` → Rol: Vendedor
- `user@user.com` / `User@123` → Rol: User
- `admin@admin.com` / `Admin@123` → Rol: Admin

---

### 4.2 Pedidos Service

| Campo | Detalle |
|---|---|
| **Responsabilidad** | CRUD completo de órdenes de compra |
| **Puerto interno** | 3002 |
| **Base de datos** | PostgreSQL · pedidos_db + MongoDB · toyota_catalogo |
| **Tecnologías** | ASP.NET Core 8, EF Core 8, Npgsql, MongoDB Driver 2.x |

| Método | Endpoint | Rol mínimo | Descripción |
|--------|----------|-----------|-------------|
| GET | /api/pedidos | User | Lista todos los pedidos |
| GET | /api/pedidos/{id} | User | Obtiene pedido por ID |
| POST | /api/pedidos | Vendedor | Crea nuevo pedido |
| DELETE | /api/pedidos/{id} | Admin | Elimina pedido |

---

### 4.3 Pagos Service

| Campo | Detalle |
|---|---|
| **Responsabilidad** | Registro y consulta de pagos asociados a pedidos |
| **Puerto interno** | 3003 |
| **Base de datos** | PostgreSQL · pagos_db |
| **Tecnologías** | ASP.NET Core 8, EF Core 8, Npgsql |

| Método | Endpoint | Rol mínimo | Descripción |
|--------|----------|-----------|-------------|
| GET | /api/pagos | Admin | Lista todos los pagos (solo Admin) |
| GET | /api/pagos/{id} | Admin | Obtiene pago por ID |
| POST | /api/pagos | Admin | Registra nuevo pago |

---

### 4.4 API Gateway (YARP)

| Campo | Detalle |
|---|---|
| **Responsabilidad** | Punto de entrada único, enrutamiento, CORS, validación JWT |
| **Puerto externo** | 443 (Azure) / 5000 (local) |
| **Tecnologías** | ASP.NET Core 8, YARP Reverse Proxy, JWT Bearer |

---

## 5. Flujos de Datos Principales

### 5.1 Flujo de Autenticación

```
CLIENTE                    GATEWAY              USUARIOS SERVICE        BASE DE DATOS
   │                          │                        │                      │
   │── POST /api/usuarios ──►│                        │                      │
   │     auth/login           │                        │                      │
   │     {email, password}    │                        │                      │
   │                          │── Enruta a :3001 ────►│                      │
   │                          │                        │── SELECT user ──────►│
   │                          │                        │   WHERE email=?       │
   │                          │                        │◄── Usuario + hash ───│
   │                          │                        │                      │
   │                          │                        │── Verifica BCrypt ──►│ (local)
   │                          │                        │── Genera JWT HS256   │
   │                          │                        │   exp: 8h, role: ?   │
   │                          │◄── 200 {token, role} ─│                      │
   │◄── 200 {token, role} ───│                        │                      │
   │                          │                        │                      │
   │ [Guarda token en         │                        │                      │
   │  localStorage]           │                        │                      │
```

### 5.2 Flujo de Creación de Pedido

```
CLIENTE                    GATEWAY              PEDIDOS SERVICE         BASE DE DATOS
   │                          │                        │                      │
   │── POST /api/pedidos ────►│                        │                      │
   │   Header: Bearer <JWT>   │                        │                      │
   │   Body: {cliente, total} │                        │                      │
   │                          │── Valida JWT ─────────►│ (internamente)       │
   │                          │── Si válido: :3002 ───►│                      │
   │                          │                        │── INSERT INTO ──────►│
   │                          │                        │   pedidos(cliente,    │
   │                          │                        │   total, fecha)       │
   │                          │                        │◄── {id, fecha} ──────│
   │                          │◄── 201 Created ────────│                      │
   │◄── 201 Created ─────────│                        │                      │
   │    {id, cliente, total,  │                        │                      │
   │     fecha}               │                        │                      │
```

### 5.3 Flujo de Procesamiento de Pago

```
CLIENTE                    GATEWAY              PAGOS SERVICE           BASE DE DATOS
   │                          │                        │                      │
   │── POST /api/pagos ──────►│                        │                      │
   │   Header: Bearer <JWT>   │                        │                      │
   │   Rol requerido: Admin   │                        │                      │
   │   Body: {pedidoId, monto}│                        │                      │
   │                          │── Valida JWT + Rol ───►│ (internamente)       │
   │                          │   Si no Admin: 403      │                      │
   │                          │── Si Admin: :3003 ─────►│                      │
   │                          │                        │── INSERT INTO ──────►│
   │                          │                        │   pagos(pedidoId,     │
   │                          │                        │   monto, estado,fecha)│
   │                          │                        │◄── {id, estado} ─────│
   │                          │◄── 201 Created ────────│                      │
   │◄── 201 Created ─────────│                        │                      │
```

---

## 6. Seguridad Implementada

| Capa | Mecanismo | Detalle |
|---|---|---|
| **Transporte** | HTTPS/TLS 1.3 | Obligatorio en producción Azure |
| **Autenticación** | JWT Bearer HS256 | Token firmado con clave secreta de 256 bits |
| **Autorización** | RBAC (Role-Based) | 3 roles: Admin, Vendedor, User |
| **Expiración** | 8 horas | Token expira automáticamente |
| **CORS** | Whitelist por origen | Solo dominios autorizados pueden llamar la API |
| **Secrets** | GitHub Actions Secrets | Nunca en código fuente ni en repositorio |
| **Contraseñas** | BCrypt | Hash con salt, nunca en texto plano |
| **Headers** | Bearer Token en cada request | Interceptor Angular lo adjunta automáticamente |

### Matriz de Permisos por Rol

| Endpoint | Admin | Vendedor | User | Sin token |
|----------|-------|----------|------|-----------|
| POST /api/usuarios/auth/login | ✅ | ✅ | ✅ | ✅ |
| GET /api/pedidos | ✅ | ✅ | ✅ | ❌ 401 |
| POST /api/pedidos | ✅ | ✅ | ❌ 403 | ❌ 401 |
| DELETE /api/pedidos/{id} | ✅ | ❌ 403 | ❌ 403 | ❌ 401 |
| GET /api/pagos | ✅ | ❌ 403 | ❌ 403 | ❌ 401 |
| POST /api/pagos | ✅ | ❌ 403 | ❌ 403 | ❌ 401 |

---

## 7. Escalabilidad y Alta Disponibilidad

### 7.1 Azure Container Apps Auto-Scaling

```
                    ┌─────────────────────────────────────┐
                    │       Azure Container Apps           │
                    │                                      │
           Carga    │  Réplicas mínimas: 1                │
           alta ───►│  Réplicas máximas: 10               │
                    │  Trigger: CPU > 70% o >100 req/seg  │
                    │                                      │
                    │  Gateway:   1-10 réplicas            │
                    │  Usuarios:  1-5  réplicas            │
                    │  Pedidos:   1-10 réplicas            │
                    │  Pagos:     1-5  réplicas            │
                    └─────────────────────────────────────┘
```

### 7.2 Estrategia de Datos

- **PostgreSQL Managed**: Azure gestiona backups automáticos cada 24h con retención de 7 días
- **MongoDB Managed**: Cosmos DB con replicación geográfica disponible
- **Frontend CDN**: Azure Static Web Apps distribuye el contenido en los edge nodes de Azure
- **Base de datos separada por servicio**: Un fallo en pagos_db no afecta usuarios_db ni pedidos_db

---

## 8. Stack Tecnológico Completo

| Tecnología | Versión | Propósito | Justificación |
|---|---|---|---|
| Angular | 21.2 | Frontend SPA | Signals API nativo, mejor DX 2025-2026 |
| TypeScript | 5.9 | Tipado estático | Reduce bugs en 40%, mejor tooling |
| .NET | 8.0 LTS | Backend microservicios | LTS hasta Nov 2026, alto rendimiento |
| ASP.NET Core | 8.0 | HTTP Framework | Minimal API + Controllers |
| YARP | 2.x | API Gateway | Reverse Proxy nativo .NET, bajo latencia |
| Entity Framework | 8.0 | ORM | Code-first, migraciones automáticas |
| Npgsql | 8.x | Driver PostgreSQL | Oficial y más rápido para .NET |
| MongoDB Driver | 2.x | Driver MongoDB | Oficial MongoDB para .NET |
| PostgreSQL | 15 | Base de datos relacional | ACID, ideal para transacciones |
| MongoDB | 6.x | Base de datos documentos | Flexible para catálogos y productos |
| Docker | 24.x | Contenedores | Portabilidad y reproducibilidad |
| Docker Compose | 2.x | Orquestación local | Dev environment completo en 1 comando |
| Azure Container Apps | Latest | Hosting microservicios | Serverless, auto-scaling, sin k8s |
| Azure Static Web Apps | Latest | Hosting frontend | CDN global, CI/CD integrado |
| Azure Container Registry | Latest | Registro imágenes | Privado, integrado con Azure |
| GitHub Actions | Latest | CI/CD | Automatización de build y deploy |
| EmailJS | 4.x | Formulario contacto | Sin backend propio, gratuito hasta 200/mes |
| JWT Bearer | HS256 | Autenticación | Stateless, escalable horizontalmente |
| BCrypt | — | Hash contraseñas | Estándar de la industria |

---

## 9. Ambientes Configurados

| Ambiente | Frontend URL | Backend URL | Base de Datos | Cómo iniciar |
|---|---|---|---|---|
| **Desarrollo local** | http://localhost:80 | http://localhost:5000 | Docker (PostgreSQL + MongoDB) | `docker-compose up --build -d` |
| **Dev server Angular** | http://localhost:4200 | http://localhost:5000 (proxy) | Docker | `ng serve` + docker-compose |
| **Producción Azure** | https://gentle-water-0ba98b90f.1.azurestaticapps.net | https://toyota-gateway.wittystone-43cf97a7.eastus2.azurecontainerapps.io | InMemory (demo) / Azure PaaS | Automático con GitHub push |

### 9.1 Variables de Entorno por Microservicio

```bash
# Modo demo sin base de datos (nube)
USE_INMEMORY=true

# Modo producción con PostgreSQL real
ConnectionStrings__PostgreSQL=Host=...;Port=5432;Database=usuarios_db;Username=toyota_user;Password=Toyota2026!
JWT_SECRET=toyota-secret-key-2026-enterprise-platform
JWT_ISSUER=toyota-pedidos-api
JWT_AUDIENCE=toyota-pedidos-client
```

---

## 10. Instrucciones para Ver el Diagrama

**Opción 1 — Importar XML en app.diagrams.net (recomendado):**
1. Ve a [https://app.diagrams.net](https://app.diagrams.net)
2. Clic en `Create New Diagram`
3. En el menú superior: `Extras` → `Edit Diagram`
4. Selecciona todo el texto existente (Ctrl+A) y bórralo
5. Pega el XML del bloque de código de la sección 3
6. Clic en **OK**
7. El diagrama completo aparece con todas las capas en colores
8. Exportar como PNG: `File → Export As → PNG`

**Opción 2 — Archivo XML local:**
1. Crea un archivo `arquitectura.drawio` en tu máquina
2. Pega el XML completo dentro
3. Ábrelo con la aplicación Draw.io de escritorio
4. O arrástralo a [app.diagrams.net](https://app.diagrams.net)

**Leyenda de colores del diagrama:**
- 🔵 Azul oscuro: Azure Static Web Apps + Angular
- 🔵 Azul claro: Capa cliente (navegadores, móvil)
- 🟣 Morado: API Gateway YARP
- 🟢 Verde: Microservicios .NET
- 🟠 Naranja: Bases de datos (PostgreSQL y MongoDB)
- ⚫ Gris azulado: DevOps (GitHub Actions, ACR)
