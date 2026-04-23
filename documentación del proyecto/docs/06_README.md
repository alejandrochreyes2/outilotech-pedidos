# Outiltech — Tienda E-Commerce de Tecnología

> Plataforma de e-commerce completa para venta de dispositivos electrónicos (Apple, Samsung, Android, Segway) con arquitectura de microservicios en .NET 8, frontend Angular 21 y despliegue en **Hetzner Cloud + Coolify** (producción) y Docker local (desarrollo).

**Cliente:** Outiltech · Jhonnathan Hernández Medina  
**URL Producción:** https://outiltech.co  
**Desarrollado por:** Alejandro Chaparro Reyes  
**Período:** 21 Marzo – 26 Abril 2026

---

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 21 standalone, TypeScript 5, Signals API |
| Backend | .NET 8 ASP.NET Core (3 microservicios) |
| API Gateway | YARP Reverse Proxy |
| Base de datos | PostgreSQL 15 + MongoDB 6 + Supabase (realtime) |
| Pagos | Wompi (tarjeta/PSE) + Nequi/Daviplata QR |
| Email | EmailJS + Gmail SMTP |
| Infraestructura | Hetzner VPS, Coolify, Docker, Cloudflare CDN |
| Dominio | outiltech.co (Namecheap) |

---

## Arquitectura

```
outiltech-entrega-portafolio/
│
├── docs/
│   ├── 01_MANUAL_TECNICO_PRUEBA.md      ← Pruebas técnicas + guía servidor
│   ├── 02_MANUAL_USUARIO.md             ← Manual no técnico para el cliente
│   ├── 03_PMO_PLAN_PROYECTO.md          ← Plan de proyecto + checklist entrega
│   ├── 04_POSTMAN_GUIA.md               ← Guía de pruebas con Postman
│   ├── 05_SWAGGER_DOCUMENTACION.md      ← Documentación completa de la API
│   ├── 06_README.md                     ← Este documento
│   ├── 07_PORTAFOLIO.md                 ← Portafolio del desarrollador
│   ├── 08_PROJECT_CHARTER.md            ← Carta del proyecto + capacitación
│   ├── 09_CONTRATO_DE_SERVICIOS_TECNOLOGICOS.md
│   └── 10_TERMINOS_DE_USO_Y_PRIVACIDAD.md
│
├── postman/
│   └── ProyectoPedidos.postman_collection.json
│
├── presentacion/
│   └── PRESENTACION_EJECUTIVA.md
│
└── contratos_firmados/
    └── 11_ACTA_DE_ENTREGA.md
```

---

## Instalación y Desarrollo Local

### Requisitos

- Docker Desktop
- Node.js 18+ y npm
- Git

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/alejandrochreyes2/proyecto-pedidos.git
cd proyecto-pedidos

# 2. Levantar el backend completo
docker-compose up --build -d

# 3. Levantar el frontend
cd frontend
npm install
npm start
# → Abre http://localhost:4200
```

### Servicios disponibles

| Servicio | URL |
|---------|-----|
| Tienda Frontend | http://localhost:4200 |
| API Gateway | http://localhost:5000 |
| Microservicio Usuarios | http://localhost:3001 |
| Microservicio Pedidos | http://localhost:3002 |
| Microservicio Pagos | http://localhost:3003 |
| Swagger Pedidos | http://localhost:3002/swagger |

---

## Variables de Entorno (docker-compose.yml)

```yaml
pedidos:
  environment:
    - Wompi__PublicKey=pub_test_xxx
    - Wompi__IntegrityKey=test_integrity_xxx
    - Email__User=correo@gmail.com
    - Email__Password=app_password_gmail
```

---

## Funcionalidades Principales

- ✅ **Catálogo:** 114 productos (iPhone, Samsung, Mac, Android, Segway…)
- ✅ **Carrito:** Persistencia en localStorage, variantes (storage/color)
- ✅ **Checkout:** Formulario completo con validación
- ✅ **Wompi:** Pago con tarjeta y PSE (sandbox → producción)
- ✅ **Nequi:** QR estático + formulario de comprobante
- ✅ **Emails:** Confirmación automática al cliente y admin (EmailJS)
- ✅ **Admin:** Dashboard con métricas en tiempo real (Supabase)
- ✅ **CRUD Pedidos:** Estados, filtros, comprobantes
- ✅ **JWT Auth:** Login con roles (Admin / Vendedor)

---

## Producción (Hetzner + Coolify)

1. Acceder a panel Coolify: `http://[IP_HETZNER]:8000`
2. Seleccionar servicio → **Deploy**
3. Logs en tiempo real en la pestaña **Logs**
4. Variables de entorno en pestaña **Environment**

---

## Documentación Completa

Ver carpeta `documentación del proyecto/docs/` para los 13 documentos del proyecto.

---

*Outiltech E-Commerce — Abril 2026*  
*Desarrollado por Alejandro Chaparro Reyes · alejandrochreyes2@gmail.com · WhatsApp 3133082905*  

---

> **Nota histórica:** Antes del 21 de marzo de 2026, Outiltech **no tenía ninguna presencia en internet** — cero página web, cero plataforma digital. Toda la infraestructura descrita en este documento fue creada desde cero en 36 días.
