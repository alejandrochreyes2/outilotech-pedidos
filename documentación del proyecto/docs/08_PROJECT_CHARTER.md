# Project Charter — Outiltech E-Commerce

**Versión:** 1.0  
**Fecha de inicio:** 21 de marzo de 2026  
**Fecha de entrega:** 26 de abril de 2026  
**Estado:** ENTREGADO ✅

---

## 1. Información General del Proyecto

| Campo | Detalle |
|-------|---------|
| **Nombre del proyecto** | Outiltech — Plataforma Digital Empresarial Completa |
| **Código** | OTC-2026-001 |
| **Cliente** | Outiltech |
| **Gerente / Propietario** | Jhonnathan Hernández Medina |
| **Cargo** | Gerente General y propietario de Outiltech |
| **Dirección comercial** | Cra 2A No 18A-52, Bogotá D.C. |
| **Teléfonos cliente** | 304 592 8793 / 305 780 4236 |
| **URL entregada** | https://outiltech.co |
| **Proveedor** | Alejandro Chaparro Reyes — Desarrollador Full-Stack |
| **Email proveedor** | alejandrochreyes2@gmail.com |
| **WhatsApp proveedor** | 3133082905 |
| **Duración** | 36 días calendario |
| **Inversión total** | **$20.000.000 COP** |
| **Forma de pago** | 50% al firmar el contrato · 50% al firmar el acta de entrega |

---

## 2. Descripción del Proyecto

> **Contexto clave:** Antes de este proyecto, **Outiltech no tenía ninguna presencia en internet**. No existía página web, no existía plataforma digital, no había ningún sistema para mostrar sus servicios, vender sus productos ni gestionar su negocio en línea. Todo el ecosistema digital de la empresa fue creado desde cero por Alejandro Chaparro Reyes.

El proyecto consistió en diseñar, desarrollar y desplegar **la presencia digital completa de Outiltech**: desde la identidad corporativa en internet (misión, visión, servicios) hasta la tienda e-commerce con pasarela de pagos, panel de administración, base de datos de inventario y herramientas de gestión visual para el equipo administrativo.

Outiltech no es solo una tienda de celulares: es una empresa de tecnología que ofrece **servicios especializados de ingeniería y sistemas** que nunca habían tenido vitrina digital. Este proyecto les dio esa vitrina.

---

### El problema que resolvimos (situación antes del 21 de marzo de 2026)

**Presencia digital:**
- ❌ Outiltech **no tenía página web** — cero presencia en Google
- ❌ No existía ninguna plataforma donde mostrar la empresa, su misión, visión ni servicios
- ❌ Nadie en internet sabía qué era Outiltech, qué ofrecía, dónde estaba
- ❌ Los servicios de ingeniería (Seguridad Informática, ISO 27001, Software a la Medida, etc.) **no estaban en ningún lado online**
- ❌ Un cliente potencial que buscara "seguridad informática Bogotá" o "auditoría ISO 27001 Colombia" **nunca encontraría a Outiltech**

**Ventas y operación:**
- ❌ Los pedidos de equipos se manejaban por WhatsApp sin ningún registro formal
- ❌ No había forma de cobrar con tarjeta de crédito o PSE
- ❌ No existía visibilidad del inventario ni de los ingresos
- ❌ Los clientes no podían comprar fuera del horario de atención
- ❌ No había control de inventario — no se sabía cuántas unidades había de cada producto

---

### Lo que construimos y entregamos

**Identidad digital y presencia corporativa:**
- ✅ Página web profesional en **outiltech.co** — Outiltech ya existe en internet
- ✅ Página **Misión y Visión** (`/mision-vision`) — identidad corporativa formal
- ✅ Catálogo completo de **servicios empresariales** visible en la web:
  - *Sistemas y Tecnologías:* Seguridad Informática & Forense Digital · Auditoría Interna ISO 27001
  - *Software a la Medida:* Software empresarial · Páginas web · IA en tu plataforma · Integración SAP y ERP · Apps para tu negocio
  - *Servicio Técnico:* Reparación de dispositivos · Diagnóstico gratuito · Servicio en garantía · Servicio a domicilio
  - *Empresas:* Ventas corporativas · Compras por volumen · Soporte TI · Leasing tecnológico · Instaladores certificados
- ✅ Página dedicada **Auditoría Interna ISO 27001** (`/iso27001`) con descripción del servicio
- ✅ Menú de navegación completo con mega-menú de servicios

**Tienda E-Commerce:**
- ✅ Tienda online con 114 productos disponible 24/7
- ✅ Pasarela de pagos Wompi (Bancolombia) para tarjeta y PSE
- ✅ Pago Nequi/Daviplata con QR estático y verificación de comprobante
- ✅ Emails automáticos de confirmación al cliente

**Sistema de gestión:**
- ✅ Panel de administración con dashboard en tiempo real (Supabase)
- ✅ Gestión de pedidos con estados, historial y exportación
- ✅ Módulo de pagos con historial de transacciones (FAC-1, FAC-2…)
- ✅ **AppSheet** conectado a la base de datos `inventario_productos` para gestión visual del catálogo sin tocar código

**Resultado:** Outiltech pasó de ser **invisible en internet** a tener una plataforma digital completa que muestra quiénes son, qué ofrecen, dónde están y cómo contratar sus servicios — todo en outiltech.co.

---

## 3. Tecnologías Implementadas

### 3.1 Frontend (Tienda Web + Portal Corporativo)

| Tecnología | Función | Costo por licencia |
|-----------|---------|-------------------|
| **Angular 21** | Framework principal — tienda + portal corporativo completo | Gratis (MIT) |
| **TypeScript 5** | Lenguaje de programación tipado | Gratis (MIT) |
| **EmailJS** | Envío automático de emails al cliente | Gratis (200/mes) → $100.000 setup |
| **Supabase JS** | Actualización en tiempo real del dashboard | Gratis (incluido) |
| **AppSheet (Google)** | Gestión visual del inventario sobre PostgreSQL | Gratis (plan básico) → $150.000 setup |

### 3.2 Backend (Sistema de Gestión)

| Tecnología | Función | Costo por licencia |
|-----------|---------|-------------------|
| **.NET 8 ASP.NET Core** | 3 microservicios independientes | Gratis (MIT) |
| **YARP** | API Gateway que conecta los servicios | Gratis (MIT) |
| **JWT Bearer** | Autenticación segura con tokens | Gratis (incluido en .NET) |
| **Entity Framework Core** | Manejo de la base de datos PostgreSQL | Gratis (MIT) |
| **PostgreSQL 15** | Base de datos principal del sistema | Gratis (Open Source) → $80.000 setup |
| **MongoDB 6** | Base de datos del catálogo de productos | Gratis (Open Source) |
| **Supabase** | Base de datos en tiempo real | Plan gratuito → $80.000 setup |

### 3.3 Pagos

| Tecnología | Función | Costo |
|-----------|---------|-------|
| **Wompi (Bancolombia)** | Pagos con tarjeta y PSE | 2.49% + $900/transacción → $140.000 integración |
| **Nequi/Daviplata** | Pago manual por QR | Sin comisión de pasarela (pago directo) |

### 3.4 Infraestructura

| Tecnología | Función | Costo incluido |
|-----------|---------|---------------|
| **Hetzner VPS CX31** | Servidor en la nube | $200.000 (1 mes setup + operación) |
| **Coolify** | Panel de gestión de contenedores | Gratis (Open Source) → $200.000 setup |
| **Docker + Compose** | Contenedores para deploy | Gratis (Open Source) |
| **Cloudflare CDN** | Aceleración, CDN y HTTPS automático | Plan gratuito → $100.000 setup |
| **Cloudflare R2** | Almacenamiento de videos del hero | Plan gratuito |
| **Namecheap** | Dominio outiltech.co (1 año) | $80.000 |

---

## 4. Plan de Costos por Fase

| Fase | Período | Actividades principales | Costo |
|------|---------|------------------------|-------|
| **Fase 1** — Arquitectura | 21–27 Mar | Setup servidor, microservicios base, autenticación JWT | $3.750.000 |
| **Fase 2** — Backend | 28 Mar–3 Abr | Pagos, Gateway YARP, Wompi, Nequi, Supabase | $4.500.000 |
| **Fase 3** — Frontend | 4–10 Abr | Angular 21, tienda completa, carrito, checkout, emails | $4.950.000 |
| **Fase 4** — Integración | 11–17 Abr | Pruebas E2E, correcciones, optimización, infraestructura | $3.800.000 |
| **Fase 5** — Entrega | 18–26 Abr | Documentación, capacitación, accesos, actas | $3.000.000 |
| **TOTAL** | 36 días | | **$20.000.000 COP** |

### Detalle presupuesto por concepto

| Concepto | Subtotal |
|---------|---------|
| Gestión de proyecto y cliente | $3.000.000 |
| Diseño de arquitectura | $1.500.000 |
| Backend: 3 microservicios + API Gateway | $5.250.000 |
| Frontend: tienda e-commerce Angular 21 | $4.200.000 |
| Integración pasarela Wompi + Nequi | $1.200.000 |
| Bases de datos (PostgreSQL + Supabase) | $750.000 |
| QA, pruebas y documentación (13 docs) | $1.000.000 |
| Capacitación y entrega formal | $1.000.000 |
| Infraestructura (Hetzner, Cloudflare, Namecheap, etc.) | $900.000 |
| Plataformas de pago y servicios (Wompi, EmailJS, Supabase, Coolify) | $400.000 |
| Buffer de ajustes finales | $1.800.000 |
| **TOTAL** | **$20.000.000 COP** |

---

## 5. PROPUESTA COMERCIAL

> Esta sección está escrita en lenguaje de negocios — sin tecnicismos — para que sea clara para cualquier empresario.

---

### ¿Por qué Outiltech necesitaba una tienda en línea?

En Colombia, más del **60% de las compras de tecnología** se inician en internet antes de que el cliente visite una tienda física. Si Outiltech no tiene presencia digital, está perdiendo clientes que buscan iPhones, Samsung o accesorios en Google y los encuentran en la competencia.

Una tienda en línea profesional no es un lujo — es una herramienta de ventas que trabaja **24 horas al día, 7 días a la semana**, incluso cuando la tienda física está cerrada.

---

### ¿Qué problemas resuelve esta inversión?

| Problema anterior | Solución entregada |
|------------------|-------------------|
| Pedidos por WhatsApp sin registro | Sistema que registra cada venta automáticamente |
| Clientes solo podían pagar en efectivo | Wompi acepta tarjetas débito, crédito y PSE |
| No había control de pedidos | Dashboard en tiempo real desde el celular |
| Sin presencia en Google | Dominio outiltech.co indexable en buscadores |
| Atención solo en horario de tienda | Tienda disponible 24/7 |
| Clientes de solo Bogotá | Despachos a toda Colombia |

---

### Retorno de la inversión (ROI)

**Escenario conservador:**
- Ticket promedio de compra: $600.000 COP
- 3 ventas adicionales por semana gracias a la tienda online
- Ingresos adicionales semanales: $1.800.000 COP
- **Inversión recuperada en: 11 semanas** (menos de 3 meses)

**Escenario realista:**
- 5 ventas adicionales por semana
- Ingresos adicionales semanales: $3.000.000 COP
- **Inversión recuperada en: 7 semanas**

---

### Beneficios incluidos en el precio de $20.000.000

✅ Tienda web profesional en outiltech.co (disponible 24/7)  
✅ Cobro con tarjeta de crédito y débito (Visa, Mastercard, Amex)  
✅ Cobro con PSE desde cualquier banco colombiano  
✅ Cobro con Nequi y Daviplata (sin comisiones de pasarela)  
✅ Catálogo de 114 productos con filtros y búsqueda  
✅ Carrito de compras con persistencia  
✅ Emails automáticos de confirmación a los clientes  
✅ Panel de administración para gestionar pedidos  
✅ Dashboard con resumen de ventas en tiempo real  
✅ Servidor propio (Hetzner) configurado y listo  
✅ Dominio outiltech.co por 1 año  
✅ Protección Cloudflare (HTTPS, velocidad, seguridad)  
✅ 30 horas de capacitación y soporte  
✅ 15 días de garantía post-entrega  
✅ 13 documentos técnicos y comerciales  
✅ Código fuente 100% propiedad de Outiltech  

---

### Lo que NO incluye este precio (claridad total)

❌ Costos mensuales recurrentes del servidor Hetzner (~€7-12/mes)  
❌ Renovación anual del dominio outiltech.co (~$80.000/año)  
❌ Comisiones de Wompi por transacción (2.49% + $900 — las paga el comprador o se absorben)  
❌ Nuevas funcionalidades después de la entrega (cotizan aparte)  
❌ Soporte técnico después de los 15 días de garantía (tiene costo)  

---

### ¿Por qué elegir a Alejandro Chaparro Reyes?

- **Entrega completa:** Frontend + backend + infraestructura + documentación. Un solo proveedor, sin subcontratos.
- **Tecnología de punta:** Angular 21 + .NET 8 — las mismas tecnologías usadas por empresas como Microsoft, Accenture e IBM.
- **Pagos reales:** Integración directa con Wompi (la pasarela de Bancolombia). Los clientes pueden pagar con cualquier tarjeta o banco colombiano.
- **Código limpio y documentado:** 13 documentos entregados. El equipo de Outiltech puede entender y mantener el sistema.
- **Soporte real:** 30 horas de acompañamiento para que el equipo pueda usar el sistema con total autonomía.

---

## 6. PLAN DE CAPACITACIÓN

### 6.1 Distribución de las 30 horas de soporte

| Tipo | Horas | Descripción |
|------|-------|------------|
| **Capacitación formal** | 15 horas | Sesiones estructuradas con agenda y temas definidos |
| **Resolución de bugs y ajustes** | 10 horas | Corrección de errores detectados post-entrega |
| **Acompañamiento administrativo** | 5 horas | Ayuda para gestionar plataformas (Hetzner, Cloudflare, Wompi, etc.) |
| **TOTAL** | **30 horas** | |

---

### 6.2 Cronograma de Sesiones de Capacitación Formal (15 horas)

| Sesión | Fecha | Duración | Temas |
|--------|-------|----------|-------|
| **Sesión 1** | 28 abril 2026 (martes) | 3 horas | Acceso al panel admin, dashboard, ver pedidos, cambiar estados |
| **Sesión 2** | 30 abril 2026 (jueves) | 3 horas | Verificar pagos Nequi, proceso de despacho, estados de pedido |
| **Sesión 3** | 5 mayo 2026 (martes) | 3 horas | Gestión de usuarios del sistema, roles de acceso |
| **Sesión 4** | 7 mayo 2026 (jueves) | 3 horas | Gestión del servidor Hetzner, Coolify, Cloudflare, Supabase |
| **Sesión 5** | 9 mayo 2026 (sábado) | 3 horas | Preguntas y respuestas, emergencias, renovaciones anuales |
| **TOTAL** | | **15 horas** | |

---

### 6.3 Agenda detallada por sesión

#### Sesión 1 — Panel Admin (28 abril, 3h)
- Acceder a outiltech.co/login con credenciales de administrador
- Navegación por el menú: Dashboard, Pedidos, Pagos, Usuarios
- Dashboard: interpretar las métricas (pedidos, ingresos, estados)
- Gestión de pedidos: ver lista, filtrar, buscar por cliente
- Cambiar estado de un pedido (Pendiente → Confirmado → Enviado → Entregado)
- Ver detalle completo de un pedido (datos del cliente, productos, comprobante)
- **Práctica en vivo:** hacer un pedido de prueba y gestionarlo hasta "Entregado"

#### Sesión 2 — Pagos y Despacho (30 abril, 3h)
- Proceso completo de verificación de pago Nequi/Daviplata
- Cómo revisar el comprobante en la app Nequi
- Qué hacer cuando el pago con Wompi queda "pendiente"
- Proceso de despacho: preparar paquete, generar guía, actualizar tracking
- Panel de pagos: qué información contiene, cómo exportar
- Cómo manejar una devolución (con Wompi y con Nequi)
- **Práctica en vivo:** procesar un pago Nequi completo

#### Sesión 3 — Usuarios y Catálogo (5 mayo, 3h)
- Crear un nuevo usuario del panel (ej: empleado)
- Asignar roles: Admin vs Vendedor (qué puede hacer cada uno)
- Cambiar contraseñas de usuarios
- Cómo funciona el catálogo de productos (cómo se actualizan precios)
- Proceso para solicitar cambios en el catálogo al desarrollador
- **Práctica en vivo:** crear usuario "Vendedor" para un empleado

#### Sesión 4 — Servidor e Infraestructura (7 mayo, 3h)
- Acceder al panel Coolify (gestión del servidor Hetzner)
- Reiniciar servicios cuando hay problemas
- Ver logs en tiempo real para diagnosticar errores
- Acceder a Cloudflare: DNS, caché, estadísticas de tráfico
- Acceder a Supabase: ver pedidos, exportar datos
- Acceder a Namecheap: renovar dominio, verificar estado
- Acceder a Wompi: ver transacciones, hacer devoluciones
- **Guía de emergencias:** qué hacer si el sitio cae

#### Sesión 5 — Q&A y Cierre (9 mayo, 3h)
- Repaso de todo lo visto en las sesiones anteriores
- Preguntas y respuestas abiertas
- Casos de uso específicos de Outiltech
- Cómo contactar soporte técnico (después del período de garantía)
- Renovaciones anuales: dominio, servidor, certificados
- Próximas funcionalidades recomendadas (roadmap)
- **Revisión del checklist de entrega**

---

### 6.4 Modalidad de las sesiones

- **Formato:** Videollamada Google Meet / Teams
- **Grabación:** Todas las sesiones se graban y se comparten al cliente
- **Material:** Se entrega presentación por cada sesión
- **Canal de dudas:** WhatsApp para dudas puntuales entre sesiones
- **Confirmación:** El cliente confirma cada sesión con 24h de anticipación

---

### 6.5 Soporte técnico durante las 10 horas de bugs

| Tipo de incidente | Tiempo de respuesta | Descripción |
|-----------------|--------------------|-----------  |
| **Crítico** (sitio caído) | < 4 horas hábiles | Cualquier error que impida a los clientes comprar |
| **Alto** (función importante) | < 8 horas hábiles | Error en pagos, emails no llegan, dashboard no carga |
| **Medio** (inconveniente) | < 24 horas hábiles | Texto incorrecto, imagen rota, filtro que falla |
| **Bajo** (mejora) | < 48 horas hábiles | Ajustes visuales, cambios de texto |

---

### 6.6 Acompañamiento administrativo (5 horas)

Estas horas se usan para ayudar al cliente a gestionar directamente las plataformas:
- Configurar renovación automática del dominio en Namecheap
- Configurar cuenta de comercio en Wompi para producción
- Ayudar a configurar usuarios adicionales de Cloudflare
- Asesoría en la elección de un plan de servidor cuando el negocio crezca
- Apoyo para configurar sistema de facturación electrónica (si se requiere)

---

## 7. Firmas y Aprobación

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| **Desarrollador / Proveedor** | Alejandro Chaparro Reyes | __________________ | 26/04/2026 |
| **Cliente / Propietario** | Jhonnathan Hernández Medina | __________________ | 26/04/2026 |

---

*Project Charter — Outiltech E-Commerce*  
*Alejandro Chaparro Reyes · Abril 2026*
