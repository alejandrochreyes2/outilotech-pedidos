# Manual de Usuario — Plataforma de Pedidos Toyota

---

## ¿Qué es esta aplicación?

La **Plataforma de Pedidos Toyota** es un sistema en línea que le permite a su equipo registrar, consultar y gestionar pedidos y pagos de forma rápida y segura, directamente desde el navegador web. No necesita instalar ningún programa adicional.

Dependiendo del tipo de usuario que tenga asignado, podrá realizar diferentes acciones:

| Tipo de usuario | Qué puede hacer |
|-----------------|-----------------|
| **Administrador** | Ver y crear pedidos, registrar pagos, ver estadísticas generales y gestionar usuarios |
| **Vendedor** | Ver y crear pedidos. No puede acceder a pagos ni a la gestión de usuarios |
| **Usuario básico** | Solo puede consultar el listado de pedidos |

---

## Cómo ingresar al sistema

**Paso 1 — Abrir el navegador**
Abra su navegador de internet (Chrome, Edge o Firefox) y escriba en la barra de direcciones:
```
http://localhost
```
Si la aplicación está en la nube (Azure), la dirección le será proporcionada por el administrador.

**Paso 2 — Pantalla de inicio de sesión**
Verá una pantalla con dos campos:
- **Usuario o correo**: escriba su dirección de correo electrónico
- **Contraseña**: escriba su contraseña (distingue mayúsculas y minúsculas)

Luego haga clic en el botón **"Ingresar"**. Mientras el sistema verifica sus datos, el botón mostrará el texto **"Ingresando..."** — espere unos segundos sin hacer clic de nuevo.

**Paso 3 — Si la contraseña es incorrecta**
Aparecerá el mensaje: *"Credenciales incorrectas"*.
- Verifique que no tenga activado el Bloqueo de Mayúsculas (tecla `Caps Lock`)
- Asegúrese de escribir el correo completo (incluyendo `@toyota.com`)
- Si olvidó su contraseña, contacte al administrador del sistema

**Paso 4 — Cómo cerrar sesión**
En el menú lateral izquierdo, haga clic en el botón **"Cerrar sesión"** (o "Logout"). Esto lo llevará de vuelta a la pantalla de inicio de sesión y borrará su sesión de forma segura.

> **Importante:** Si cierra el navegador sin cerrar sesión, su sesión permanece activa por 8 horas. Por seguridad, siempre use el botón de cierre de sesión.

---

## Usuarios de prueba disponibles

| Correo electrónico | Contraseña | Tipo de acceso |
|--------------------|------------|----------------|
| `admin@toyota.com` | `Admin123!` | Administrador completo |
| `vendedor@toyota.com` | `Vend123!` | Vendedor |
| `admin@admin.com` | `Admin@123` | Administrador |
| `user@user.com` | `User@123` | Usuario básico |

---

## Módulo Dashboard

El Dashboard es la primera pantalla que verá al ingresar. Muestra un resumen personalizado según su rol.

**Si es Administrador:**
- Una tarjeta de bienvenida con su nombre, correo y rol destacado
- **Total de Pedidos**: cuántos pedidos hay registrados en el sistema
- **Total de Pagos**: cuántos pagos han sido procesados

**Si es Vendedor o Usuario básico:**
- Una tarjeta de bienvenida con su nombre y rol
- Un resumen con la cantidad de pedidos en el sistema
- Un mensaje indicando cómo acceder a sus pedidos desde el menú lateral

El menú lateral muestra solo las secciones a las que tiene acceso según su rol.

---

## Módulo Pedidos

### Ver la lista de pedidos

1. Haga clic en **"Pedidos"** en el menú lateral
2. Se cargará automáticamente la lista de pedidos registrados
3. La tabla muestra: número de pedido, nombre del cliente, valor total y fecha

### Crear un nuevo pedido *(solo Administrador y Vendedor)*

Debajo de la lista de pedidos encontrará el formulario **"Nuevo pedido"**:

1. **Cliente**: escriba el nombre del cliente o empresa
2. **Total**: escriba el valor del pedido en pesos (solo números)
3. Haga clic en **"Crear pedido"**
4. Si todo es correcto, el pedido aparecerá al instante en la lista
5. Verá el mensaje verde: *"Pedido creado correctamente"*

### Qué significa cada campo

| Campo | Significado |
|-------|-------------|
| **#** | Número de identificación único del pedido |
| **Cliente** | Nombre de la empresa o persona que realizó el pedido |
| **Total** | Valor total del pedido en pesos colombianos |
| **Fecha** | Fecha y hora en que se registró el pedido |

### Si no tiene permiso para crear pedidos

Si intenta crear un pedido y su rol no lo permite, verá el mensaje: *"Sin permiso para crear pedidos"*. Esto es normal y significa que su tipo de cuenta no incluye esa función. Contacte al administrador si necesita ese acceso.

---

## Módulo Pagos

> Esta sección es **exclusiva para Administradores**. Si no es administrador y accede a esta URL, el sistema lo redirigirá automáticamente al Dashboard.

### Ver la lista de pagos

1. Haga clic en **"Pagos"** en el menú lateral
2. Se cargará la lista de pagos registrados
3. La tabla muestra: número de pago, ID del pedido asociado, monto, estado y fecha

### Cómo registrar un pago

1. En el formulario **"Registrar pago"** complete:
   - **ID del pedido**: el número del pedido que se está pagando (ver columna # en la lista de pedidos)
   - **Monto**: el valor a pagar
2. Haga clic en **"Registrar pago"**
3. Verá el mensaje: *"Pago registrado correctamente"*

### Qué significa cada campo

| Campo | Significado |
|-------|-------------|
| **#** | Número de identificación único del pago |
| **Pedido** | ID del pedido al que corresponde este pago |
| **Monto** | Valor pagado |
| **Estado** | Estado actual: `Pendiente`, `Completado`, etc. |
| **Fecha** | Fecha y hora en que se registró el pago |

---

## Módulo Usuarios

> Esta sección es **exclusiva para Administradores**.

Desde aquí los administradores pueden revisar la gestión del sistema. Solo el personal con rol **Admin** tiene acceso a esta sección.

Si un Vendedor o Usuario intenta acceder a `/usuarios`, el sistema lo redirigirá automáticamente al Dashboard.

---

## Mensajes de error comunes

### "Sin permiso" / "Solo administradores pueden..."
**Qué significa:** Está intentando realizar una acción que su tipo de cuenta no permite.
**Qué hacer:** No es un error del sistema. Si necesita ese acceso, contacte al administrador para que actualice su rol.

### "Credenciales incorrectas"
**Qué significa:** El correo o la contraseña ingresados no son correctos.
**Qué hacer:** Verifique mayúsculas, el correo completo y vuelva a intentarlo. Si persiste el problema, contacte al administrador.

### "Error de conexión o inesperado"
**Qué significa:** El sistema no pudo conectarse al servidor en ese momento.
**Qué hacer:** Espere unos segundos y recargue la página (`F5`). Si el problema continúa, contacte al equipo de soporte técnico.

### "Ingresando..." (botón bloqueado)
**Qué significa:** El sistema está procesando su solicitud de inicio de sesión.
**Qué hacer:** Espere unos segundos. No haga clic varias veces.

### Sesión expirada (redirige automáticamente al login)
**Qué significa:** Su sesión de 8 horas venció, o el sistema detectó un acceso no autorizado.
**Qué hacer:** Ingrese nuevamente con su correo y contraseña.

---

## Preguntas frecuentes

**1. ¿Puedo usar el sistema desde el celular?**
Sí, la aplicación funciona en el navegador del celular. Se recomienda usar Chrome o Edge en modo horizontal para una mejor experiencia.

**2. ¿Mis datos se guardan si cierro el navegador?**
Los pedidos y pagos registrados se guardan en el servidor. Sin embargo, si cierra el navegador sin cerrar sesión, tendrá que volver a iniciar sesión la próxima vez.

**3. ¿Puedo ver pedidos de otros vendedores?**
Sí. La lista de pedidos muestra todos los pedidos del sistema, independientemente de quién los creó.

**4. ¿Qué pasa si registro un pago con el ID de pedido equivocado?**
El pago quedará asociado al número de pedido que ingresó. Contacte al administrador para que corrija el registro.

**5. ¿Cómo sé qué rol tengo asignado?**
Al ingresar al sistema, su rol aparece en la tarjeta de bienvenida del Dashboard (Admin, Vendedor o User). También puede verlo en la parte superior del menú lateral.
