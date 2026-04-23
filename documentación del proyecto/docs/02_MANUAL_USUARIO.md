# Manual de Usuario — Outiltech Tienda

**Versión:** 2.0  
**Fecha:** Abril 2026  
**Para:** Administrador(a) de Outiltech — Jhonnathan Hernández  
**URL:** https://outiltech.co

---

## Bienvenido a Outiltech

> **Un logro importante:** Antes del 21 de marzo de 2026, Outiltech no tenía ninguna página web ni presencia digital. Toda esta plataforma — tienda, panel admin, pagos, emails — fue construida desde cero especialmente para Outiltech.

Outiltech es tu tienda en línea para vender dispositivos de tecnología (iPhones, Samsung, Android, accesorios, patinetas Segway) a clientes de todo Colombia. Además de la tienda, Outiltech ofrece servicios empresariales:

- **Seguridad Informática y Análisis Forense Digital**
- **Auditoría Interna ISO 27001**
- **Software empresarial a la medida**
- **Páginas web e IA en plataformas empresariales**
- **Integración SAP y ERP · Apps para tu negocio**
- **Reparación técnica · Diagnóstico gratuito · Garantía · Servicio a domicilio**
- **Ventas corporativas · Compras por volumen · Soporte TI · Leasing tecnológico**

Este manual te explica cómo usar cada parte del sistema **sin necesidad de saber programación**.

---

## Parte 1 — La Tienda Pública (lo que ven los clientes)

### 1.1 Página Principal

Cuando un cliente entra a **outiltech.co** ve:

1. **Hero Slider** — Imágenes y video que muestran las promociones principales (iPhone Air, MacBook, Samsung Galaxy S25, etc.)
2. **Categorías** — 19 íconos de marcas/categorías para filtrar productos
3. **Productos Destacados** — Catálogo de 114 productos con precios
4. **Carrito de compras** — Ícono arriba a la derecha con el contador

### 1.2 Cómo un cliente hace una compra

**Paso 1 — Seleccionar producto:**
- El cliente navega por el catálogo
- Hace clic en el producto que desea
- Selecciona variante (ej: 128GB, color) si aplica
- Hace clic en "Agregar al carrito" o "Comprar ahora"

**Paso 2 — Revisar carrito:**
- Clic en el ícono del carrito (arriba derecha)
- Puede cambiar cantidades o eliminar productos
- Clic en "Ir al checkout"

**Paso 3 — Llenar datos de envío:**
- Email y teléfono de contacto
- Nombre, apellido, empresa (opcional)
- Ciudad y dirección de entrega
- Tipo y número de identificación

**Paso 4 — Elegir método de pago:**
- **Tarjeta de crédito/débito** → redirige a Wompi (plataforma segura de Bancolombia)
- **PSE** → redirige a Wompi para pago bancario
- **Nequi/Daviplata** → muestra QR para escanear y transferir al 3045928793
- **Efectivo (Efecty/Baloto)** → se genera cupón de pago

**Paso 5 — Confirmar pago:**
- Si paga con Nequi: escanea QR → transfiere → clic "Ya realicé el pago" → llena comprobante
- Si paga con tarjeta: completa el pago en Wompi → regresa automáticamente
- El cliente recibe email de confirmación automáticamente

---

## Parte 2 — Panel de Administración

### 2.1 Cómo entrar al panel de admin

1. Ir a **outiltech.co/login**
2. Ingresar email y contraseña de administrador
3. El sistema te lleva automáticamente al **Dashboard**

> **Credenciales por defecto:**  
> Email: `admin@outiltech.co`  
> Contraseña: *(entregada por separado en el acta de entrega)*

### 2.2 Dashboard — Resumen del negocio

El dashboard muestra un resumen en tiempo real:

| Tarjeta | Qué significa |
|---------|--------------|
| **Total Pedidos** | Cuántos pedidos se han recibido |
| **Pedidos Pendientes** | Pedidos sin procesar todavía |
| **Pedidos Confirmados** | Pedidos pagados y verificados |
| **Total Ingresos** | Suma de todos los pedidos (en COP) |

Los datos se actualizan automáticamente gracias a la conexión con Supabase.

### 2.3 Gestión de Pedidos

**Para ver la lista de pedidos:**
1. Menú lateral → "Pedidos"
2. Verás todos los pedidos con: número, cliente, total, estado, fecha

**Estados de un pedido:**

| Estado | Significado | Qué hacer |
|--------|------------|----------|
| `Pendiente` | Pedido recibido, pago no confirmado | Esperar confirmación |
| `PendienteVerificacion` | Cliente envió comprobante Nequi | Verificar transferencia manualmente |
| `Confirmado` | Pago verificado | Preparar y despachar |
| `Enviado` | Producto despachado | Enviar número de guía al cliente |
| `Entregado` | Cliente recibió el producto | Cerrar pedido |
| `Cancelado` | Pedido cancelado | Ninguna |

**Para cambiar el estado de un pedido:**
1. Clic en el pedido
2. Cambiar el campo "Estado"
3. Guardar

**Para ver el detalle completo:**
- Cada pedido muestra: datos del cliente, dirección de entrega, productos comprados, método de pago y comprobante (si hay).

### 2.4 Gestión de Usuarios del Sistema

Solo el administrador puede crear nuevos usuarios del panel:

1. Menú lateral → "Usuarios"
2. Clic en "Nuevo usuario"
3. Llenar: email, contraseña, nombre, rol
4. Roles disponibles: **Admin** (acceso total) o **Vendedor** (solo pedidos)

### 2.5 Ver Pagos

1. Menú lateral → "Pagos"
2. Lista de todas las transacciones registradas
3. Solo disponible para el rol Administrador

---

## Parte 3 — Verificación de Pagos Nequi/Daviplata

Como los pagos Nequi son manuales (el cliente transfiere directamente), debes verificarlos tú:

### Proceso de verificación:

1. **Recibes email** de "Comprobante recibido" con los datos del cliente:
   - Número de celular desde donde pagó
   - Código de comprobante de la transacción
   - Valor pagado

2. **Verificas en tu app Nequi:**
   - Abrir Nequi → Movimientos
   - Buscar la transferencia del número indicado
   - Confirmar que el monto y la fecha coinciden

3. **Actualizas el estado** del pedido en el panel:
   - Pedidos → buscar por número de pedido
   - Cambiar estado a "Confirmado"

4. **El cliente es notificado** automáticamente por email cuando el estado cambia.

---

## Parte 4 — Proceso de Despacho

Una vez el pago está confirmado:

1. Preparar el paquete con el producto
2. Generar guía de envío con tu operador logístico (Coordinadora, Servientrega, etc.)
3. Actualizar el pedido: estado → "Enviado", agregar número de guía
4. El cliente puede rastrear con el número de guía

---

## Parte 5 — Preguntas Frecuentes

**¿El sistema descuenta inventario automáticamente?**  
Sí, cuando se confirma un pedido, el inventario se actualiza en la base de datos.

**¿Qué hago si un cliente quiere cancelar?**  
Ir al pedido → cambiar estado a "Cancelado". Si ya pagó con Wompi, la devolución se hace desde el panel de Wompi.

**¿Cómo cambio los precios de los productos?**  
Actualmente los precios están en el código fuente (`productos.service.ts`). Para cambios de precios, contactar al desarrollador o solicitar módulo de administración de productos (servicio adicional).

**¿El sitio funciona en celular?**  
Sí, el sitio es completamente responsive y funciona en todos los dispositivos. También se puede instalar como app (PWA) en Android e iOS.

**¿Qué pasa si hay un error en una compra?**  
Revisar la sección "Pedidos" en el panel. Si el pedido no aparece, el cliente puede reportar por WhatsApp al 3045928793 y verificar manualmente.

**¿Cómo contacto soporte técnico?**  
- WhatsApp: verificar con Alejandro Chaparro Reyes
- Email: alejandrochreyes2@gmail.com
- Tiempo de respuesta: < 4 horas para críticos, < 24 horas para consultas

**¿Puedo agregar nuevos productos?**  
Sí, contactando al desarrollador. También se puede solicitar un módulo de administración de catálogo como funcionalidad adicional.

---

## Parte 6 — Glosario

| Término | Significado |
|---------|------------|
| **Dashboard** | Panel de control con resumen del negocio |
| **Checkout** | Pantalla de pago al final de la compra |
| **JWT** | Token de seguridad que autoriza el acceso al panel |
| **Wompi** | Plataforma de pagos electrónicos de Bancolombia |
| **Supabase** | Base de datos en la nube para datos en tiempo real |
| **Coolify** | Panel de control del servidor donde corre el sistema |
| **Hetzner** | Servidor en la nube donde está alojado el backend |
| **Cloudflare** | Servicio que protege el sitio y lo hace cargar rápido |
| **QR Nequi** | Código QR que el cliente escanea para transferir el pago |
| **Comprobante** | Número de referencia que genera Nequi después de transferir |

---

*Outiltech — Manual de Usuario v2.0 — Abril 2026*  
*Cra 2A No 18A-52, Bogotá · Lun-Sáb 9am-7pm · 304 592 8793*  
*Desarrollado por Alejandro Chaparro Reyes · alejandrochreyes2@gmail.com · WhatsApp 3133082905*
