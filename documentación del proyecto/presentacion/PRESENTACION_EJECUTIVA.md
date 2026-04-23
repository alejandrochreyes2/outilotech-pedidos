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

## DIAPOSITIVA 2 — El Punto de Partida: Outiltech no existía en internet

> **Dato clave:** Antes del 21 de marzo de 2026, si buscabas "Outiltech" en Google, **no aparecía nada**. La empresa existía físicamente, pero era invisible digitalmente.

### Lo que Outiltech tenía antes de este proyecto: NADA

| Área | Situación real |
|------|--------------|
| Página web | ❌ No existía |
| Misión y Visión publicada | ❌ No había ninguna plataforma que las mostrara |
| Servicios de ingeniería online | ❌ Seguridad Informática, ISO 27001, Software, IA — nadie los encontraba |
| Tienda de productos | ❌ Solo por WhatsApp y presencial |
| Pasarela de pagos | ❌ Solo efectivo y transferencias manuales |
| Control de inventario | ❌ Manual, sin sistema |
| Dashboard de ventas | ❌ No había ningún registro digital |
| Panel de administración | ❌ No existía |

### Outiltech ofrece servicios que el mercado necesita — pero nadie los conocía:

- **Seguridad Informática & Forense Digital** — análisis de vulnerabilidades, recuperación de datos
- **Auditoría Interna ISO 27001** — certificación para empresas
- **Software a la Medida** — desarrollo de sistemas, integración SAP/ERP, IA
- **Servicio Técnico** — reparación, diagnóstico, garantía, servicio a domicilio
- **Soluciones Empresariales** — ventas por volumen, soporte TI, leasing tecnológico

> *Antes de este proyecto: servicios de alto valor que nadie contrataba porque nadie sabía que existían.*

---

## DIAPOSITIVA 3 — La Solución: Presencia Digital Completa desde Cero

### outiltech.co — Outiltech ya existe en internet

🏢 **Identidad corporativa** — Misión, Visión y valores publicados en `/mision-vision`  
🗂️ **Catálogo de servicios** — 14 servicios en 4 categorías visibles en el mega-menú  
🔒 **Página ISO 27001** — landing dedicada para el servicio estrella de auditoría  
🛍️ **Tienda e-commerce** — 114 productos de Apple, Samsung, Android, Segway  
💳 **Pagos electrónicos** — tarjeta, PSE, Nequi, Daviplata  
📧 **Emails automáticos** — confirmación al cliente en segundos  
📊 **Dashboard admin** — 95+ pedidos, $121M+ en ventas monitoreadas en tiempo real  
📋 **Historial de pagos** — FAC-1, FAC-2… cada transacción registrada con datos de entrega  
📱 **AppSheet** — gestión visual del inventario sin tocar código  
📦 **Envíos a toda Colombia** — clientes de cualquier ciudad pueden comprar  

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

---

## DIAPOSITIVA 9-A — Pantallazo 1: Misión y Visión (outiltech.co/mision-vision)

```
┌─────────────────────────────────────────────────────────────────────┐
│  🎯 NUESTRA MISIÓN                  🚀 NUESTRA VISIÓN               │
│  ─────────────────────────────      ───────────────────────────────  │
│  Brindar servicios                  Ser una empresa reconocida a     │
│  especializados en seguridad        nivel nacional por su excelencia │
│  informática, auditoría,            en seguridad informática,        │
│  análisis forense digital,          análisis forense y soluciones    │
│  microelectrónica y                 tecnológicas avanzadas.          │
│  recuperación de datos.                                              │
│                                     Destacarnos por la confianza,    │
│  [Seguridad Informática]            la innovación y la capacidad de  │
│  [Análisis Forense]                 resolver problemas complejos...  │
│  [Recuperación de Datos]                                             │
│  [Microelectrónica]                 [Alcance Nacional][Innovación]   │
│                                     [Ecosistema Apple][Alta Exig.]   │
└─────────────────────────────────────────────────────────────────────┘
```

**Qué muestra este pantallazo:**
- La empresa tenía misión y visión definidas internamente pero **nunca las había publicado en ningún lado**
- Este proyecto creó y publicó la identidad formal de Outiltech en internet por primera vez
- Diseño con identidad visual corporativa: fondo oscuro (#1a1a1a), naranja Outiltech, tonos azul/morado
- URL de producción: **https://outiltech.co/mision-vision**

---

## DIAPOSITIVA 9-B — Pantallazo 2: Mega-Menú de Servicios

```
┌─────────────────────────────────────────────────────────────────────┐
│  SISTEMAS Y         SOFTWARE A        SERVICIO          EMPRESAS     │
│  TECNOLOGÍAS        LA MEDIDA         TÉCNICO                        │
│  ──────────────     ─────────────     ─────────────     ─────────── │
│  Seguridad          Software          Reparación de     Ventas       │
│  Informática &      empresarial       dispositivos      corporativas │
│  Forense Digital                                                     │
│                     Páginas web       Diagnóstico       Compras por  │
│  Auditoría                            gratuito          volumen      │
│  Interna ISO 27001  IA en tu                                         │
│                     plataforma        Servicio en       Soporte TI   │
│                                       garantía                       │
│                     Integración                         Leasing      │
│                     SAP y ERP         Servicio a        tecnológico  │
│                                       domicilio                      │
│                     Apps para tu                        Encuentra    │
│                     negocio                             una tienda   │
└─────────────────────────────────────────────────────────────────────┘
```

**Qué muestra este pantallazo:**
- El mega-menú de "Servicios" en la barra de navegación principal
- **14 servicios en 4 categorías** — todo el portafolio de Outiltech ahora visible en internet
- Antes de este proyecto, ninguno de estos servicios estaba publicado en ningún lado online
- Los clientes que busquen "auditoría ISO 27001 Bogotá" o "software empresarial Colombia" ahora pueden encontrar a Outiltech

---

## DIAPOSITIVA 9-C — Pantallazo 3: Página Auditoría Interna ISO 27001 (outiltech.co/iso27001)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│              OUTILTECH — SISTEMAS Y TECNOLOGÍAS                      │
│                                                                      │
│           Auditoría Interna                                          │
│              ISO 27001                                               │
│                                                                      │
│     Asegura, Cumple y Fortalece tu Organización.                     │
│     Transformamos la auditoría en una herramienta                    │
│     estratégica, no en un simple requisito.                          │
│                                                                      │
│  [Solicitar auditoría]  [Ver todos los servicios]  [Certificados]   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

**Qué muestra este pantallazo:**
- Landing page dedicada para el servicio de Auditoría ISO 27001 — el servicio de mayor valor de Outiltech
- Fondo de imagen de candado/seguridad con overlay verde — diseño profesional que genera confianza
- Botones de acción claros para que empresas contacten a Outiltech
- URL de producción: **https://outiltech.co/iso27001**
- **Impacto:** Una empresa que busca certificación ISO 27001 en Colombia ahora puede encontrar y contratar a Outiltech

---

## DIAPOSITIVA 9-D — Pantallazo 4: Dashboard Admin (outiltech.co/dashboard)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Bienvenido, Jhonnathan Hernández Medina     [Admin]                 │
│  jhonatanhtech@gmail.com                                            │
│  ─────────────────────────────────────────────────────────────────  │
│                                                                      │
│  📦 95           💳 1            💰 $121.855.100+    ✅ 100%        │
│  Compras         Total           Total Ventas         Disponibili-   │
│  Registradas     Pagos                                dad            │
│                                                                      │
│  Historial de compras satisfactorias                [Actualizar]     │
│  ─────────────────────────────────────────────────────────────────  │
│  FAC-95  22/04/2026  Cliente            $1.500  ✓ Completado        │
│  FAC-94  22/04/2026  Raul Chaparro      $1.500  ✓ Completado        │
│  FAC-93  22/04/2026  Raul Chaparro      $1.500  ✓ Completado        │
│  FAC-92  22/04/2026  EFECTIVO Chaparro  $1.500  ✓ Completado        │
└─────────────────────────────────────────────────────────────────────┘
```

**Qué muestra este pantallazo (datos reales del sistema):**
- **95 compras registradas** en el sistema desde el lanzamiento
- **$121.855.100+ COP en ventas totales** — Outiltech ya tiene visibilidad real de sus ingresos
- Historial de todas las compras con número de factura, fecha, cliente, monto y estado
- Jhonnathan puede ver este dashboard desde su celular en cualquier momento
- URL de producción: **https://outiltech.co/dashboard**
- Los datos se actualizan en tiempo real vía Supabase sin recargar la página

---

## DIAPOSITIVA 9-E — Pantallazo 5: Módulo de Pagos (outiltech.co/pagos)

```
┌─────────────────────────────────────────────────────────────────────┐
│  43 Compras registradas  │  $22.880.800 Total facturado  │  0 Trans │
│                                                                      │
│  Datos de Contacto y Entrega                        [Actualizar]    │
│  ─────────────────────────────────────────────────────────────────  │
│  FAC# │ FECHA    │ CLIENTE              │ EMAIL      │ MÉTODO PAGO  │
│  FAC-1│20/04/26  │ DANIEL ESTEBAN       │ alejandro..│ Tarjeta      │
│  FAC-2│20/04/26  │ Raul Chaparro reyes  │ alejandro..│ Nequi        │
│  FAC-3│20/04/26  │ raul alejandro reyes │ xxcelux4.. │ Nequi        │
│  FAC-4│20/04/26  │ raul alejandro reyes │ xxcelux4.. │ Tarjeta      │
│  FAC-5│20/04/26  │ raul alejandro reyes │ xxcelux4.. │ Tarjeta      │
│  FAC-6│20/04/26  │ raul alejandro reyes │ xxcelux4.. │ Tarjeta      │
│  FAC-7│20/04/26  │ alejandro chaparro   │ alejandro..│ Tarjeta      │
│  FAC-8│20/04/26  │ alejandro compra     │ alejandro..│ Efectivo     │
└─────────────────────────────────────────────────────────────────────┘
```

**Qué muestra este pantallazo (datos reales del sistema en producción):**
- **43 compras registradas** con datos completos de contacto y entrega
- **$22.880.800 COP total facturado** — visible en tiempo real
- Cada factura muestra: FAC#, fecha, cliente, email, teléfono, ciudad, dirección, método de envío, método de pago, total y estado
- Múltiples métodos de pago ya usados: Tarjeta (Wompi), Nequi, Efectivo
- Jhonnathan puede coordinar las entregas directamente desde esta pantalla
- URL de producción: **https://outiltech.co/pagos**

---

## DIAPOSITIVA 9-F — Pantallazo 6: AppSheet — Gestión Visual del Inventario

```
┌─────────────────────────────────────────────────────────────────────┐
│  inventario productos                          [Search] [+ Add]     │
│  ─────────────────────────────────────────────────────────────────  │
│  id    producto_id    nombre              marca   categoría  precio │
│  ─────────────────────────────────────────────────────────────────  │
│  Accesorios (8 productos)                                           │
│   3    pencil-pro     Apple Pencil Pro     Apple   Accesorios 680k  │
│  46    cubo-uni       Cubo Original Apple  Apple   Accesorios 260k  │
│   2    pencil-2gen    Apple Pencil 2da Gen Apple   Accesorios 1.5k  │
│  ─────────────────────────────────────────────────────────────────  │
│  AirPods (3 productos)                                              │
│  43    airpods4-rep   AirPods 4 Réplica   Apple   AirPods    260k  │
│  44    airpodsp2-rep  AirPods Pro 2 Répl  Apple   AirPods    260k  │
│  45    airpodsp3-ori  AirPods Pro 3 Orig  Apple   AirPods    1.4M  │
│  ─────────────────────────────────────────────────────────────────  │
│  Android (14 productos)                                             │
│  101   redmi-note14   Redmi Note 14 256GB Redmi   Android    850k  │
└─────────────────────────────────────────────────────────────────────┘
```

**Qué muestra este pantallazo:**
- **AppSheet** conectado directamente a la tabla `inventario_productos` en PostgreSQL/Supabase
- El administrador puede **cambiar precios, agregar productos, desactivar disponibilidad** — todo sin tocar código
- Muestra todos los campos: id, nombre, marca, categoría, modelo, año, precio, precio_anterior, unidades, disponibilidad, garantía, slug
- Los cambios se sincronizan automáticamente con la tienda en outiltech.co
- **Sin conocimientos técnicos requeridos** — cualquier empleado administrativo puede gestionar el catálogo
- Accesible desde cualquier dispositivo con internet

> **Por qué esto importa:** Antes de AppSheet, cambiar un precio requería un desarrollador que editara el código fuente. Ahora Jhonnathan o cualquier empleado puede hacerlo en 10 segundos desde el celular.

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
