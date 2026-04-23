# Portafolio — Outiltech E-Commerce

**Desarrollado por:** Alejandro Chaparro Reyes  
**Bogotá, Colombia · Abril 2026**  
**Contacto:** alejandrochreyes2@gmail.com  
**GitHub:** https://github.com/alejandrochreyes2

---

## El Proyecto

> **Punto de partida:** Antes del 21 de marzo de 2026, **Outiltech no tenía ninguna presencia en internet**. Cero página web. Cero plataforma digital. Una empresa con servicios de alto valor — seguridad informática, auditoría ISO 27001, software a la medida — que era completamente invisible en Google.

**Outiltech** es una empresa de tecnología con sede en Cra 2A No 18A-52, Bogotá, que ofrece:
- Venta de dispositivos de alta gama (iPhones, Samsung, Mac, iPad, AirPods, Android, Segway)
- Servicios de Seguridad Informática y Análisis Forense Digital
- Auditoría Interna ISO 27001
- Software empresarial a la medida
- Integración SAP y ERP
- IA en plataformas empresariales
- Reparación técnica de dispositivos
- Soporte TI para empresas y leasing tecnológico

**Todo su core de negocio fue creado y llevado a internet por este proyecto.** Outiltech pasó de ser invisible a tener una plataforma digital completa en outiltech.co.

> *"Tecnología de calidad al alcance de todos los colombianos"*

---

## ¿Qué se entregó?

### 1. Presencia Corporativa Digital (outiltech.co)

Todo construido desde cero — Outiltech no tenía nada antes:

- **Página principal** con hero slider, catálogo y secciones corporativas
- **Misión y Visión** (`/mision-vision`) — identidad formal de la empresa en internet
- **Mega-menú de Servicios** con 4 categorías y 14 servicios:
  - *Sistemas y Tecnologías:* Seguridad Informática & Forense Digital · Auditoría ISO 27001
  - *Software a la Medida:* Software empresarial · Páginas web · IA en tu plataforma · Integración SAP y ERP · Apps para tu negocio
  - *Servicio Técnico:* Reparación · Diagnóstico gratuito · Garantía · Servicio a domicilio
  - *Empresas:* Ventas corporativas · Compras por volumen · Soporte TI · Leasing tecnológico
- **Página ISO 27001** (`/iso27001`) — servicio estrella con landing dedicada
- **Navegación completa** con Acerca de nosotros, Servicios, Equipos, Descubrir

### 2. Tienda E-Commerce (outiltech.co/#equipos)

Una tienda moderna y responsive que los clientes de Outiltech usan para:

- Explorar **114 productos** organizados por marca y categoría
- Filtrar por Apple, Samsung, Android, accesorios, patinetas…
- Agregar al carrito y comprar desde el celular o computador
- Pagar con **tarjeta de crédito o débito** (vía Wompi — Bancolombia)
- Pagar con **PSE** directamente desde su banco
- Pagar con **Nequi o Daviplata** escaneando un QR
- Recibir confirmación del pedido por **email automático**

### 3. Panel de Administración (outiltech.co/dashboard)

Un panel interno para que Jhonnathan Hernández y su equipo puedan:

- Ver todos los pedidos en tiempo real — dashboard con métricas (95+ compras, $121M+ en ventas)
- Confirmar manualmente los pagos Nequi/Daviplata
- Gestionar estados de pedidos con historial completo (FAC-1, FAC-2…)
- Administrar usuarios del sistema con roles de acceso
- Ver historial de pagos con datos de contacto y entrega

### 4. AppSheet — Gestión Visual del Inventario

Para que el administrador pueda **gestionar productos y precios sin tocar código**:

- AppSheet conectado directamente a la tabla `inventario_productos` en PostgreSQL/Supabase
- Interfaz visual para agregar, editar, desactivar productos
- Actualizar precios en tiempo real — los cambios se reflejan en la tienda inmediatamente
- Gestionar disponibilidad y unidades por producto
- Accesible desde cualquier dispositivo (celular, tablet, PC)
- **No requiere conocimientos técnicos** — cualquier empleado administrativo lo puede usar

---

## Arquitectura del Sistema

```
[Cliente en el navegador]
         │
         ▼
[Angular 21 — outiltech.co]
  Cloudflare CDN + HTTPS
         │
         ▼ HTTPS
[API Gateway YARP]
  Hetzner VPS · Coolify
    ┌────┴────┬──────────┐
    ▼         ▼          ▼
[Usuarios]  [Pedidos]  [Pagos]
 .NET 8      .NET 8     .NET 8
    │         │          │
    ▼         ▼          ▼
[PostgreSQL + Supabase + MongoDB]
```

---

## Tecnologías Utilizadas

### Frontend
| Tecnología | Uso |
|-----------|-----|
| Angular 21 | Framework principal — componentes standalone, Signals |
| TypeScript 5 | Tipado estático del código |
| Angular Router | Navegación entre páginas |
| HttpClient + JWT | Comunicación con el backend |
| EmailJS | Envío de emails de confirmación sin backend |
| Supabase JS | Sincronización en tiempo real del dashboard |

### Backend
| Tecnología | Uso |
|-----------|-----|
| .NET 8 ASP.NET Core | Framework para los 3 microservicios |
| YARP | API Gateway — enrutamiento centralizado |
| JWT Bearer | Autenticación y autorización por roles |
| Entity Framework Core | ORM para PostgreSQL |
| PostgreSQL 15 | Base de datos principal |
| MongoDB 6 | Catálogo de productos |
| Supabase | Base de datos en tiempo real |
| Wompi SDK | Integración pasarela de pagos (Bancolombia) |

### Infraestructura
| Tecnología | Uso |
|-----------|-----|
| Hetzner Cloud | Servidor VPS en la nube |
| Coolify | Panel de despliegue y gestión de contenedores |
| Docker + Docker Compose | Contenedores para desarrollo local y producción |
| Cloudflare | CDN, DNS, HTTPS automático |
| Cloudflare R2 | Almacenamiento de videos |
| Namecheap | Dominio outiltech.co |

---

## Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| Duración del proyecto | 36 días (21 Mar – 26 Abr 2026) |
| Productos en catálogo | 114 |
| Microservicios backend | 3 |
| Endpoints API documentados | 18+ |
| Pruebas Postman | 24 requests, 18 escenarios |
| Documentos entregados | 13 |
| Horas de soporte incluidas | 30 |
| Inversión total | $20.000.000 COP |

---

## Valor Generado para el Cliente

**Antes de Outiltech.co:** Jhonnathan atendía pedidos por WhatsApp, anotaba en cuadernos, verificaba pagos Nequi manualmente sin ningún registro digital.

**Después de Outiltech.co:**
- Los clientes compran 24/7 desde cualquier dispositivo
- Cada pedido queda registrado automáticamente en la base de datos
- El pago con tarjeta se procesa en segundos (Wompi)
- El cliente recibe email de confirmación al instante
- El admin ve todos los pedidos en tiempo real desde el celular
- El inventario se controla digitalmente

**ROI estimado:** Con un ticket promedio de $500.000 COP y solo 3 ventas adicionales por semana gracias a la tienda online, la inversión se recupera en menos de **14 semanas**.

---

## Propuesta de Valor

✅ **Tienda profesional** — Diseño moderno que genera confianza en el cliente  
✅ **Pagos seguros** — Wompi (Bancolombia) + Nequi sin comisiones de pasarela  
✅ **Sin apps que instalar** — PWA instalable en Android e iOS desde el navegador  
✅ **Panel de gestión** — Control total del negocio desde cualquier dispositivo  
✅ **Emails automáticos** — El cliente siempre sabe el estado de su pedido  
✅ **Infraestructura robusta** — Hetzner + Cloudflare garantiza disponibilidad 99.9%  
✅ **Código propio** — 100% del código fuente es propiedad de Outiltech  

---

## Paquete Comercial — $20.000.000 COP

Lo que incluye este precio:

| Entregable | ✓ |
|-----------|---|
| Tienda e-commerce completa en outiltech.co | ✅ |
| Panel de administración con dashboard | ✅ |
| 3 microservicios backend (.NET 8) | ✅ |
| Integración Wompi (tarjeta + PSE) | ✅ |
| Integración Nequi/Daviplata (QR manual) | ✅ |
| Servidor Hetzner configurado (1 mes) | ✅ |
| Dominio outiltech.co (1 año) | ✅ |
| Cloudflare CDN + HTTPS | ✅ |
| 13 documentos técnicos y comerciales | ✅ |
| 30 horas de capacitación y soporte | ✅ |
| 15 días de garantía post-entrega | ✅ |
| Código fuente 100% propiedad del cliente | ✅ |

---

## Contacto

**Alejandro Chaparro Reyes**  
Desarrollador Full-Stack Senior  
Bogotá, Colombia

📧 alejandrochreyes2@gmail.com  
📱 WhatsApp: 3133082905  
🐙 https://github.com/alejandrochreyes2  
💼 Portafolio: https://github.com/alejandrochreyes2/outiltech-portafolio

> Disponible para nuevos proyectos. Respuesta garantizada en 24 horas.

---

*Outiltech — Portafolio del Desarrollador — Abril 2026*
