# PMO — Plan de Proyecto Outiltech E-Commerce

**Versión:** 2.0  
**Fecha de elaboración:** Marzo 2026  
**Fecha de entrega:** 26 de Abril de 2026  
**Estado:** ENTREGADO ✅

---

## 1. Ficha del Proyecto

| Campo | Detalle |
|-------|---------|
| **Nombre del proyecto** | Outiltech — Plataforma E-Commerce de Tecnología |
| **Código del proyecto** | OTC-2026-001 |
| **Cliente** | Outiltech |
| **Representante del cliente** | Jhonnathan Hernández Medina — Gerente y propietario |
| **Presupuesto aprobado** | $20.000.000 COP |
| **Forma de pago** | 50% al firmar · 50% a la entrega |
| **Duración** | 36 días calendario (21 marzo – 26 abril 2026) |
| **Fecha de inicio** | 21 de marzo de 2026 |
| **Fecha de entrega** | 26 de abril de 2026 |
| **Inicio soporte** | 27 de abril de 2026 |
| **Fin soporte** | 11 de mayo de 2026 (15 días hábiles) |
| **Modalidad** | Remoto 100% |
| **Canal de comunicación** | WhatsApp · Email · Videollamada |
| **Repositorio** | https://github.com/alejandrochreyes2/proyecto-pedidos |
| **URL de producción** | https://outiltech.co |
| **Servidor** | Hetzner Cloud + Coolify |
| **Dominio** | Namecheap — outiltech.co |

### Equipo del Proyecto

| Rol | Nombre | Responsabilidad |
|-----|--------|----------------|
| **Gerente de Proyecto / Full-Stack** | Alejandro Chaparro Reyes | Gestión cliente, desarrollo, entregables |
| **Arquitecto Senior IA** | Claude Code (Anthropic) | Apoyo en arquitectura, revisión de código |

---

## 2. Alcance del Proyecto

### 2.1 Incluido en el precio — $20.000.000 COP

**Tienda E-Commerce (Frontend Angular 21):**
- ✅ SPA Angular 21 standalone con diseño corporativo Outiltech
- ✅ Catálogo de 114 productos (iPhone, Samsung, Android, Mac, iPad, Watch, AirPods, Accesorios, Segway)
- ✅ Hero slider con 8 slides y video de fondo (Cloudflare R2)
- ✅ 19 categorías/marcas con filtrado en tiempo real
- ✅ Carrito de compras con persistencia en localStorage
- ✅ Detalle de producto con variantes (storage, color)
- ✅ Checkout completo con validación de formularios
- ✅ Integración pasarela Wompi (tarjeta y PSE)
- ✅ Pago manual Nequi/Daviplata con QR estático
- ✅ Pantalla de resultado de pago (/payment-result)
- ✅ Notificaciones por email (EmailJS)
- ✅ Diseño responsive (PC, tablet, celular)
- ✅ PWA instalable en Android e iOS

**Sistema de Gestión Interna (Backend .NET 8):**
- ✅ 3 microservicios independientes (Usuarios, Pedidos, Pagos)
- ✅ API Gateway YARP para enrutamiento centralizado
- ✅ Autenticación JWT con 2 roles (Admin, Vendedor)
- ✅ Base de datos PostgreSQL con migraciones automáticas
- ✅ Base de datos MongoDB para catálogo
- ✅ Sincronización en tiempo real con Supabase
- ✅ Dashboard admin con métricas de pedidos
- ✅ CRUD completo de pedidos con estados
- ✅ Gestión de comprobantes Nequi
- ✅ Integración backend Wompi (crear transacción, verificar resultado)
- ✅ Endpoint webhook para notificaciones Wompi

**Infraestructura:**
- ✅ Servidor Hetzner Cloud VPS (CX31)
- ✅ Coolify para gestión de despliegues y contenedores
- ✅ Cloudflare CDN + DNS para outiltech.co
- ✅ Cloudflare R2 para almacenamiento de video
- ✅ Dominio outiltech.co (Namecheap)
- ✅ Docker Compose para entorno local de desarrollo
- ✅ HTTPS automático con Cloudflare

**Documentación y Entrega:**
- ✅ Manual de usuario (lenguaje no técnico)
- ✅ Manual técnico con guía de administración de servidor
- ✅ Colección Postman con pruebas documentadas
- ✅ Documentación Swagger de la API
- ✅ Plan PMO del proyecto
- ✅ Project Charter con propuesta comercial
- ✅ Contrato de servicios tecnológicos
- ✅ Acta de entrega formal
- ✅ Términos de uso y política de privacidad para el sitio
- ✅ Código fuente 100% entregado en GitHub

**Capacitación y Soporte:**
- ✅ 30 horas de soporte total (ver detalle en Project Charter)
- ✅ 15 días de soporte post-entrega
- ✅ Transferencia de accesos (Hetzner, Coolify, Cloudflare, Wompi, Supabase)

---

### 2.2 No incluido (fuera de alcance)

- ❌ Integración con sistemas ERP o CRM existentes
- ❌ App nativa en Play Store o App Store
- ❌ Migración de datos históricos de sistemas anteriores
- ❌ Módulo de reportes o business intelligence (Power BI, etc.)
- ❌ Soporte técnico después de los 15 días de garantía (tiene costo)
- ❌ Cambios de alcance o nuevas funcionalidades después de la aprobación
- ❌ Costos recurrentes de infraestructura (Hetzner, Cloudflare, Supabase, Wompi)

---

## 3. Las 5 Fases de Implementación

### FASE 1 — Semana 1 (21–27 Marzo): Arquitectura y Fundamentos

| Actividad | Resultado |
|-----------|----------|
| Levantamiento de requisitos | Catálogo de funcionalidades aprobado |
| Definición de arquitectura microservicios | Diagrama y stack tecnológico definido |
| Configuración repositorio GitHub | Repositorio con estructura inicial |
| Configuración Docker Compose | 5 servicios corriendo localmente |
| Microservicio Usuarios: modelos + JWT | Login funcional con 2 roles |
| Microservicio Pedidos: CRUD básico | GET y POST /pedidos funcionando |
| Configuración Hetzner + Coolify | Servidor en la nube activo |

### FASE 2 — Semana 2 (28 Mar–3 Abr): Backend Completo

| Actividad | Resultado |
|-----------|----------|
| Microservicio Pagos con PostgreSQL | POST /pagos devuelve 201 |
| API Gateway YARP | Los 3 servicios accesibles por gateway |
| Integración Wompi sandbox | Transacciones de prueba procesadas |
| Endpoint Nequi comprobante | PATCH /nequi-comprobante funcional |
| Supabase sync de pedidos | Dashboard muestra datos en tiempo real |
| Swagger documentado en 3 servicios | /swagger accesible en cada microservicio |

### FASE 3 — Semana 3 (4–10 Abr): Frontend E-Commerce

| Actividad | Resultado |
|-----------|----------|
| Angular 21 standalone con Signals | App compila y corre en localhost:4200 |
| Diseño UI Outiltech (naranja/negro) | Identidad visual corporativa |
| Catálogo de 114 productos | Productos visibles con filtros |
| Carrito y checkout completo | Flujo de compra end-to-end funcional |
| Integración Wompi frontend | Redirección a checkout Wompi |
| QR Nequi y comprobante | Pago manual Nequi funcional |
| EmailJS configurado | Emails de confirmación enviados |
| Angular environments | Build prod usa API de Hetzner |

### FASE 4 — Semana 4 (11–17 Abr): Integración y Calidad

| Actividad | Resultado |
|-----------|----------|
| Integración completa frontend-backend | Login, pedidos, pagos en producción |
| Pruebas E2E Postman (18 escenarios) | 18/18 tests pasan |
| Pruebas en múltiples dispositivos | Sin errores en PC, Android, iOS |
| Corrección interceptor JWT | JWT solo aplica al backend, no a Supabase |
| Optimización bundle Angular | < 800KB inicial |
| Cloudflare CDN configurado | HTTPS y CDN activos en outiltech.co |
| R2 video assets | Video hero desde Cloudflare R2 |

### FASE 5 — Días Finales (18 Abr–26 Abr): Cierre y Entrega

| Actividad | Resultado |
|-----------|----------|
| Ajustes finales Wompi llaves reales | Credenciales sandbox correctas |
| Inventario de productos | Tabla inventario_productos en PostgreSQL |
| Migración SQL Supabase (realtime) | Políticas públicas configuradas |
| Documentación completa | 13 documentos elaborados |
| Capacitación al cliente | Sesiones programadas |
| Transferencia de accesos | Credenciales entregadas |
| Acta de entrega | Firmada el 26 de abril |

---

## 4. Cronograma Visual — Gantt

```
ACTIVIDAD                              Mar21  Mar28  Abr4   Abr11  Abr18  Abr26
──────────────────────────────────────────────────────────────────────────────
Arquitectura y requisitos             ████
Microservicio Usuarios (Auth+JWT)     ████
Microservicio Pedidos (CRUD)          ████   ██
Microservicio Pagos                          ████
API Gateway YARP                             ████
PostgreSQL + MongoDB + Supabase       ████   ████
Integración Wompi backend                    ████
Frontend Angular 21 (e-commerce)                    ████
Catálogo 114 productos                              ████
Carrito y Checkout                                  ████
QR Nequi + comprobante                              ████
EmailJS notificaciones                               ████
Hetzner + Coolify + Cloudflare        ██     ██            ████
Integración completa prod                                  ████
Pruebas E2E (18 escenarios)                                ████
Documentación (13 docs)                                          ████
Capacitación y entrega formal                                         ██
──────────────────────────────────────────────────────────────────────────────
DEMOS DE AVANCE                        ✓      ✓      ✓      ✓      ✓     ✓
```

---

## 5. Presupuesto Detallado

| Concepto | Descripción | Horas | Valor/hora | Subtotal |
|---------|-------------|-------|-----------|---------|
| Gestión de proyecto y cliente | Reuniones, documentación, seguimiento | 20h | $150.000 | $3.000.000 |
| Diseño de arquitectura | Microservicios, decisiones técnicas | 10h | $150.000 | $1.500.000 |
| Backend: microservicios + Gateway | .NET 8, YARP, 3 servicios, PostgreSQL, MongoDB | 35h | $150.000 | $5.250.000 |
| Frontend: tienda e-commerce | Angular 21, 114 productos, carrito, checkout | 28h | $150.000 | $4.200.000 |
| Integración pasarela Wompi + Nequi | Wompi SDK, QR, comprobante, webhooks | 8h | $150.000 | $1.200.000 |
| Bases de datos PostgreSQL + Supabase | Diseño, migraciones, realtime sync | 5h | $150.000 | $750.000 |
| QA, pruebas y documentación | 18 escenarios Postman, 13 documentos | 10h | $100.000 | $1.000.000 |
| Capacitación y entrega formal | 30h soporte, transferencia accesos, actas | 8h | $125.000 | $1.000.000 |
| **Plataformas e infraestructura** | | | | |
| Servidor Hetzner VPS CX31 (1 mes) | Setup + 1 mes de hosting | — | — | $200.000 |
| Dominio outiltech.co (Namecheap) | Registro anual .co | — | — | $80.000 |
| Cloudflare CDN + R2 | Configuración CDN, DNS, video | — | — | $100.000 |
| Supabase (realtime + auth) | Configuración proyecto y tablas | — | — | $80.000 |
| Wompi (integración sandbox→producción) | Setup comercio, pruebas, claves | — | — | $140.000 |
| Coolify (CI/CD Hetzner) | Configuración deploys automáticos | — | — | $200.000 |
| EmailJS (templates de pedidos) | Setup, 2 templates, dominio propio | — | — | $100.000 |
| Ajustes finales y buffer | Correcciones, hotfixes, polish | — | — | $1.200.000 |
| **TOTAL** | | **124h** | | **$20.000.000 COP** |

### Forma de Pago

| Hito | Monto | Cuándo |
|------|-------|--------|
| Pago inicial | $10.000.000 COP (50%) | Al firmar el contrato |
| Pago final | $10.000.000 COP (50%) | Al firmar el acta de entrega (26 abril 2026) |

---

## 6. Gestión de Riesgos

| # | Riesgo | Prob. | Impacto | Mitigación | Contingencia |
|---|--------|-------|---------|-----------|-------------|
| 1 | Cambios de requisitos | Media | Alto | Congelar alcance semana 1 | Control de cambios con cotización |
| 2 | Caída del servidor Hetzner | Baja | Alto | Snapshots semanales | Restaurar desde snapshot |
| 3 | Rechazo de llaves Wompi sandbox | Baja | Medio | Usar tarjetas de prueba documentadas | Cambiar a llaves producción con comercio activo |
| 4 | Bug crítico post-entrega | Baja | Alto | Pruebas exhaustivas semana 4 | Soporte 15 días incluido |
| 5 | Dominio no disponible | Muy baja | Alto | Namecheap auto-renovación activa | Contactar soporte Namecheap |
| 6 | Quota EmailJS excedida | Baja | Medio | Plan gratuito 200 emails/mes | Cambiar a SMTP directo |

---

## 7. Garantía y Soporte Post-Entrega

### 7.1 Qué incluye (15 días desde 26 de abril)

- Corrección de bugs detectados después de la entrega
- Ajustes menores de configuración
- Soporte para dudas de uso
- Respuesta a incidentes: crítico < 4h, alto < 8h, medio < 24h, bajo < 48h

### 7.2 Canal de soporte

- **WhatsApp:** contacto directo con Alejandro Chaparro Reyes
- **Email:** alejandrochreyes2@gmail.com
- **Horario:** Lunes–Viernes 8am–6pm (Colombia)

---

## 8. CHECKLIST DE ENTREGA

> Lista de verificación formal de todos los entregables del proyecto Outiltech.

### 8.1 Código Fuente

- [x] Repositorio GitHub con código completo y actualizado
- [x] Branch `main` con el código de producción
- [x] `docker-compose.yml` funcional para entorno local
- [x] Variables de entorno documentadas en `docker-compose.yml`
- [x] Frontend Angular 21 compilando sin errores (`npm run build`)
- [x] 3 microservicios .NET 8 compilando sin errores
- [x] API Gateway YARP configurado y funcional
- [x] Migrations SQL de PostgreSQL incluidas en el código
- [x] Script de migración Supabase incluido (`003_realtime_y_politicas_publicas.sql`)

### 8.2 Funcionalidades Verificadas

- [x] Catálogo de 114 productos visible y filtrable
- [x] Carrito de compras funcional con persistencia
- [x] Checkout completo con validación de formularios
- [x] Pago Wompi sandbox procesado correctamente
- [x] QR Nequi estático visible inmediatamente
- [x] Comprobante Nequi guardado en base de datos
- [x] Emails de confirmación enviados vía EmailJS
- [x] Panel admin accesible con login JWT
- [x] Dashboard con métricas en tiempo real (Supabase)
- [x] CRUD de pedidos funcional

### 8.3 Infraestructura

- [x] Servidor Hetzner activo y accesible
- [x] Coolify configurado con todos los servicios
- [x] Dominio outiltech.co apuntando al servidor
- [x] HTTPS activo (Cloudflare)
- [x] Cloudflare R2 con video de hero
- [x] Supabase proyecto configurado
- [x] PostgreSQL con datos iniciales (seed)

### 8.4 Documentación (13 documentos)

- [x] 01 — Manual Técnico de Pruebas (con guía de administración)
- [x] 02 — Manual de Usuario
- [x] 03 — PMO Plan del Proyecto (este documento)
- [x] 04 — Guía Postman
- [x] 05 — Documentación Swagger
- [x] 06 — README del proyecto
- [x] 07 — Portafolio del desarrollador
- [x] 08 — Project Charter (con plan de capacitación y propuesta comercial)
- [x] 09 — Contrato de Servicios Tecnológicos
- [x] 10 — Términos de Uso y Privacidad
- [x] 11 — Acta de Entrega
- [x] 12 — Presentación Ejecutiva
- [x] Postman Collection JSON

### 8.5 Accesos Transferidos al Cliente

- [ ] Credenciales Hetzner (email + contraseña panel)
- [ ] Acceso Coolify (usuario + contraseña)
- [ ] Acceso Cloudflare (email + contraseña)
- [ ] Acceso Namecheap (email + contraseña dominio)
- [ ] Acceso Supabase (email + contraseña proyecto)
- [ ] Acceso Wompi (usuario + contraseña panel comercio)
- [ ] Credenciales admin panel Outiltech (email + contraseña)
- [ ] Acceso repositorio GitHub (como colaborador)
- [ ] Credenciales EmailJS (cuenta y claves)

### 8.6 Capacitación

- [ ] Sesión 1 completada (Panel admin + Dashboard)
- [ ] Sesión 2 completada (Pedidos + Pagos)
- [ ] Sesión 3 completada (Gestión usuarios + catálogo)
- [ ] Sesión 4 completada (Servidor + infraestructura)
- [ ] Sesión 5 completada (Q&A + emergencias)

### 8.7 Firmas y Documentos Legales

- [ ] Contrato de servicios firmado por ambas partes
- [ ] Acta de entrega firmada por Jhonnathan Hernández
- [ ] Acta de entrega firmada por Alejandro Chaparro Reyes
- [ ] Recibo de pago final confirmado

---

## 9. Aprobación y Firmas

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| **Gerente de Proyecto** | Alejandro Chaparro Reyes | __________________ | 26/04/2026 |
| **Cliente / Propietario** | Jhonnathan Hernández Medina | __________________ | 26/04/2026 |

---

*Outiltech E-Commerce — PMO Plan del Proyecto v2.0*  
*Desarrollado por Alejandro Chaparro Reyes · Abril 2026*
