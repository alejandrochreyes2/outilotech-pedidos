# Presentación Ejecutiva — Outiltech E-Commerce
## Demo Final · 26 de Abril de 2026

> **Nota:** Este documento está estructurado como guión para la presentación ejecutiva. Para convertir a PowerPoint: copiar cada sección como una diapositiva en PowerPoint o Google Slides con fondo oscuro (#1a1a1a), texto blanco y acento naranja (#FF6B00) — la identidad visual de Outiltech.

---

## DIAPOSITIVA 1 — Portada

```
┌─────────────────────────────────────────────────┐
│                                                   │
│         ██████  ██   ██ ████████  ██  ██          │
│        ██    ██ ██   ██    ██     ██  ██          │
│        ██    ██ ██   ██    ██     ██  ██          │
│        ██    ██ ██   ██    ██     ██  ██          │
│         ██████   █████     ██      ████           │
│                                                   │
│         ████████ ███████  ██████  ██   ██         │
│            ██    ██      ██    ██ ██   ██         │
│            ██    █████   ██       ███████         │
│            ██    ██      ██    ██ ██   ██         │
│            ██    ███████  ██████  ██   ██         │
│                                                   │
│         Plataforma E-Commerce de Tecnología       │
│              outiltech.co                         │
│                                                   │
│    Presentado por: Alejandro Chaparro Reyes        │
│    Bogotá, 26 de abril de 2026                    │
└─────────────────────────────────────────────────┘
```

---

## DIAPOSITIVA 2 — El Reto de Outiltech

### Antes de este proyecto...

| Situación | Problema |
|-----------|---------|
| Pedidos por WhatsApp | Sin registro formal, datos perdidos |
| Solo efectivo y transferencia manual | Se perdían ventas de clientes con tarjeta |
| Sin presencia en Google | Competidores con tienda online ganaban clientes |
| Atención solo en horario de tienda | Ventas limitadas a Lun-Sáb 9am-7pm |
| Control manual en cuadernos | Sin métricas ni historial de ingresos |

### La pregunta clave:
> *¿Cuántas ventas pierde Outiltech cada mes porque no tiene cómo recibir pagos con tarjeta o porque el cliente busca en Google y encuentra a la competencia?*

---

## DIAPOSITIVA 3 — La Solución Entregada

### outiltech.co — Disponible 24/7

🛍️ **Tienda profesional** con 114 productos de Apple, Samsung, Android, Segway  
💳 **Pagos electrónicos** — tarjeta, PSE, Nequi, Daviplata  
📧 **Emails automáticos** — el cliente sabe el estado de su pedido en tiempo real  
📊 **Panel admin** — Jhonnathan ve sus ventas desde el celular, en cualquier momento  
🔒 **Seguridad Wompi** — la pasarela de Bancolombia, de confianza para los colombianos  
📦 **Envíos a toda Colombia** — los clientes de cualquier ciudad pueden comprar  

---

## DIAPOSITIVA 4 — Demo en Vivo

### Flujo del cliente (5 minutos)

```
1. Cliente abre outiltech.co en el celular
            ↓
2. Navega el catálogo → filtra por "iPhone"
            ↓
3. Selecciona iPhone 16 Pro → "Agregar al carrito"
            ↓
4. Ir al carrito → "Ir al checkout"
            ↓
5. Llena datos de envío
            ↓
6. Selecciona "Tarjeta de crédito"
            ↓
7. "Completar pago" → Wompi abre en segundos
            ↓
8. Ingresa tarjeta de prueba: 4242 4242 4242 4242
            ↓
9. Pago aprobado → regresa a outiltech.co ✅
            ↓
10. Cliente recibe email de confirmación en 30 segundos
```

### Flujo del admin (3 minutos)

```
1. Admin abre outiltech.co/login
            ↓
2. Dashboard: el pedido ya aparece en tiempo real
            ↓
3. Clic en el pedido → ver datos completos
            ↓
4. Cambiar estado: "Pendiente" → "Confirmado"
            ↓
5. Despachar → actualizar a "Enviado" + guía
```

---

## DIAPOSITIVA 5 — Arquitectura Técnica

```
[CLIENTE EN EL NAVEGADOR / CELULAR]
              │
              ▼ HTTPS
    ┌─────────────────────┐
    │   Cloudflare CDN    │  ← Velocidad + Seguridad global
    │     outiltech.co    │
    └─────────────────────┘
              │
              ▼
    ┌─────────────────────┐
    │   Angular 21        │  ← Tienda web + Panel admin
    │   (Frontend)        │    Diseño responsive para PC y celular
    └─────────────────────┘
              │
              ▼ REST API
    ┌─────────────────────┐
    │   API Gateway       │  ← Un solo punto de entrada
    │   (YARP)            │    Hetzner VPS · Coolify
    └──────┬──────┬───────┘
           │      │      │
     ┌─────┘  ┌───┘  ┌───┘
     ▼         ▼      ▼
  [Usuarios] [Pedidos] [Pagos]
  .NET 8      .NET 8    .NET 8
     │         │         │
     ▼         ▼         ▼
 [PostgreSQL] [PG+Supabase] [PG+MongoDB]
```

**¿Por qué microservicios?**
- Si hay un problema en pagos, la tienda sigue funcionando
- Cada parte se puede actualizar de forma independiente
- El sistema escala según la demanda

---

## DIAPOSITIVA 6 — Stack Tecnológico

| Categoría | Tecnología | Por qué se eligió |
|-----------|-----------|------------------|
| **Tienda web** | Angular 21 | El framework más usado en empresas grandes (Google, IBM) |
| **Backend** | .NET 8 ASP.NET Core | Robusto, seguro, usado por Microsoft y Bancolombia |
| **Pagos** | Wompi | La pasarela oficial de Bancolombia — confianza colombiana |
| **Servidor** | Hetzner Cloud | 3x más barato que AWS para el mismo rendimiento |
| **CDN** | Cloudflare | Carga rápida en todo el mundo + protección DDoS gratis |
| **Tiempo real** | Supabase | Dashboard actualizado al instante sin recargar la página |
| **Dominio** | outiltech.co (Namecheap) | Identidad propia, profesional, memorable |

---

## DIAPOSITIVA 7 — Retorno de la Inversión (ROI)

### Inversión: $20.000.000 COP

| Escenario | Ventas adicionales/semana | Ticket promedio | Recuperación |
|-----------|--------------------------|----------------|-------------|
| Conservador | 3 ventas | $600.000 COP | 11 semanas |
| **Realista** | **5 ventas** | **$600.000 COP** | **7 semanas** |
| Optimista | 10 ventas | $800.000 COP | 3 semanas |

### Beneficios adicionales no cuantificables
- **Imagen profesional** — "Tenemos tienda en línea" vs. "Solo WhatsApp"
- **Datos del negocio** — Por primera vez, saber cuánto se vende, qué vende más
- **Alcance nacional** — No más ventas solo en Bogotá
- **Disponibilidad 24/7** — Ventas incluso cuando la tienda está cerrada

---

## DIAPOSITIVA 8 — Lo que se Entregó

### 13 Documentos + Código + Infraestructura

| Entregable | ✅ |
|-----------|---|
| Tienda outiltech.co funcional | ✅ |
| Panel de administración | ✅ |
| 3 microservicios backend | ✅ |
| Integración Wompi (tarjeta + PSE) | ✅ |
| QR Nequi/Daviplata | ✅ |
| Servidor Hetzner configurado | ✅ |
| Dominio outiltech.co | ✅ |
| Cloudflare CDN + HTTPS | ✅ |
| 13 documentos técnicos y comerciales | ✅ |
| 30h soporte (15 cap + 10 bugs + 5 admin) | ✅ |
| Código fuente 100% propiedad de Outiltech | ✅ |

**Costo total: $20.000.000 COP**  
*(Pago inicial: $10M · Pago final: $10M)*

---

## DIAPOSITIVA 9 — Próximos Pasos (Roadmap)

### Después de la entrega...

**Corto plazo (1-3 meses) — incluido en soporte:**
- ✅ 5 sesiones de capacitación (15 horas)
- ✅ Corrección de bugs reportados
- ✅ Activar Wompi en producción (tarjetas reales)

**Mediano plazo (3-6 meses) — inversión adicional:**
- 📋 Módulo de administración de catálogo (agregar/editar/eliminar productos sin programación)
- 📊 Módulo de reportes y métricas avanzadas
- 🔔 Notificaciones push a clientes (WhatsApp API o SMS)
- 🗺️ Integración con operador logístico para tracking automático

**Largo plazo (6-12 meses):**
- 📱 App nativa (Android + iOS) en Play Store y App Store
- 🤖 Chatbot de atención al cliente con IA
- 💼 Portal de mayoristas / distribuidores

---

## DIAPOSITIVA 10 — Cierre

### Gracias, Jhonnathan

**Lo que construimos juntos:**  
Una herramienta de ventas que trabaja 24/7 para Outiltech.

**Lo que sigue:**  
15 días de soporte garantizado y 5 sesiones de capacitación para que tú y tu equipo puedan sacarle el máximo provecho.

**El próximo paso:**  
Firmar el Acta de Entrega → Activar Wompi en producción → Primera venta real en outiltech.co 🎉

---

📧 **alejandrochreyes2@gmail.com**  
🌐 **outiltech.co**  
💼 **https://github.com/alejandrochreyes2/outiltech-portafolio**

---

*Presentación Ejecutiva — Outiltech E-Commerce*  
*Alejandro Chaparro Reyes · Bogotá, 26 de abril de 2026*
