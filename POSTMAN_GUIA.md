# Guía de Importación y Uso — Colección Postman

**Proyecto:** Toyota Pedidos Enterprise
**Versión:** 1.0
**Pruebas incluidas:** 24 requests · 18 pruebas automatizadas

---

## ¿Qué es Postman?

Postman es la herramienta estándar de la industria para probar, documentar y automatizar pruebas de APIs REST. Permite enviar solicitudes HTTP a cualquier endpoint, ver la respuesta en tiempo real y crear suites de pruebas automatizadas con scripts que verifican que los resultados sean correctos.

En este proyecto usamos Postman para:
- Demostrar que todos los endpoints funcionan correctamente
- Verificar que la seguridad por roles está implementada
- Probar el flujo completo de negocio (login → pedido → pago)
- Documentar cada endpoint con ejemplos reales de request y response

---

## Prerequisitos

Antes de ejecutar las pruebas, verifica que tienes:

- **Postman** instalado (descarga gratuita en https://www.postman.com/downloads/)
- **Docker Desktop** instalado y corriendo
- El proyecto levantado con el comando: `docker-compose up -d`
- Los 4 servicios respondiendo (espera 20 segundos después del up)

### Verificar que el entorno está listo

Abre el navegador y ve a http://localhost:5000/health. Si ves `Healthy`, el gateway está activo y puedes continuar.

---

## Paso 1 — Importar la colección

1. Abre **Postman** en tu computador
2. Haz clic en el botón **"Import"** en la esquina superior izquierda
3. En el diálogo que aparece, selecciona la pestaña **"File"**
4. Haz clic en **"Upload Files"** o arrastra el archivo al cuadro:
   ```
   ProyectoPedidos.postman_collection.json
   ```
5. Haz clic en **"Import"** para confirmar
6. La colección **"Toyota Pedidos — Colección Completa Enterprise"** aparece en el panel izquierdo
7. Haz clic en la flecha para expandirla y ver las 5 carpetas

---

## Paso 2 — Entender la estructura

La colección está organizada en 5 carpetas ordenadas:

| Carpeta | Requests | Descripción |
|---------|----------|-------------|
| **1. HEALTH CHECKS** | 4 | Verifica que los 4 servicios están activos |
| **2. AUTENTICACIÓN** | 5 | Login con 3 roles + credenciales inválidas + registro |
| **3. PEDIDOS** | 5 | CRUD de pedidos con los 3 roles |
| **4. PAGOS** | 5 | Gestión de pagos (solo Admin) |
| **5. FLUJO COMPLETO** | 5 | Simulación de un caso de uso real de principio a fin |

**Variables de colección (se llenan automáticamente):**
- `base_url` → `http://localhost:5000` (cambiar a Azure para producción)
- `token` → Token JWT del Admin (se llena al hacer LOGIN Admin)
- `token_vendedor` → Token JWT del Vendedor
- `token_user` → Token JWT del User

---

## Paso 3 — Ejecutar las pruebas en orden

**IMPORTANTE:** Ejecutar en este orden exacto para que los tokens estén disponibles cuando se necesiten.

### Parte A: Health Checks (requests 01-04)

1. Abre la carpeta **"1. HEALTH CHECKS"**
2. Haz clic en **"01 Gateway Health"**
3. Haz clic en el botón azul **"Send"**
4. Verifica que el status sea **200 OK** y la respuesta sea `Healthy`
5. Repite para los requests 02, 03 y 04

Resultado esperado: Los 4 servicios responden 200 ✅

---

### Parte B: Autenticación (requests 05-09)

1. Abre la carpeta **"2. AUTENTICACIÓN"**
2. Ejecuta **"05 LOGIN Admin"**
   - El token del Admin se guarda automáticamente en `{{token}}`
   - Verifica en la pestaña "Test Results" que aparezcan 4 checks verdes
3. Ejecuta **"06 LOGIN Vendedor"**
   - El token se guarda en `{{token_vendedor}}`
4. Ejecuta **"07 LOGIN User"**
   - El token se guarda en `{{token_user}}`
5. Ejecuta **"08 LOGIN Credenciales Incorrectas"**
   - Debe mostrar status 401 ✅
6. Ejecuta **"09 REGISTER Nuevo Usuario"**
   - Debe mostrar 200 (primera vez) o 400 (si ya existe) ✅

---

### Parte C: Pedidos (requests 10-14)

1. Abre la carpeta **"3. PEDIDOS"**
2. Ejecuta **"10 GET Pedidos — Sin Token"** → espera 401
3. Ejecuta **"11 GET Pedidos — Admin"** → espera 200 con array
4. Ejecuta **"12 POST Crear Pedido — Admin"** → espera 201
5. Ejecuta **"13 POST Crear Pedido — Vendedor"** → espera 201
6. Ejecuta **"14 POST Crear Pedido — User"** → espera 403

---

### Parte D: Pagos (requests 15-19)

1. Abre la carpeta **"4. PAGOS"**
2. Ejecuta **"15 GET Pagos — Sin Token"** → espera 401
3. Ejecuta **"16 GET Pagos — Admin"** → espera 200 con array
4. Ejecuta **"17 GET Pagos — Vendedor"** → espera 403
5. Ejecuta **"18 POST Registrar Pago — Admin"** → espera 201
6. Ejecuta **"19 POST Registrar Pago — Vendedor"** → espera 403

---

### Parte E: Flujo Completo (requests 20-24)

1. Abre la carpeta **"5. FLUJO COMPLETO END-TO-END"**
2. Ejecuta los 5 requests en orden (20 al 24)
3. El flujo simula: Login → Crear Pedido → Registrar Pago → Verificar Pedidos → Verificar Pagos
4. Todos deben mostrar resultados verdes en "Test Results"

---

## Paso 4 — Ejecutar todas las pruebas a la vez (Collection Runner)

Para ejecutar las 24 pruebas en un solo clic:

1. En el panel izquierdo, haz **clic derecho** sobre la colección **"Toyota Pedidos"**
2. Selecciona **"Run collection"**
3. En la ventana del Collection Runner:
   - Verifica que están todos los requests seleccionados (debe decir 24)
   - Deja la opción "Save responses" activada si quieres ver los detalles
   - En "Delay", pon `200` milisegundos para evitar sobrecargar el servidor
4. Haz clic en el botón rojo **"Run Toyota Pedidos"**
5. Espera a que termine (toma aproximadamente 10-15 segundos)
6. Revisa los resultados:
   - Las pruebas verdes son las que pasaron ✅
   - Las pruebas rojas son las que fallaron ❌
   - El resumen al final muestra cuántas pasaron del total

**Resultado esperado:** 18 pruebas verdes, 0 rojas

---

## Criterios de Completitud

| Criterio | Verificación | Estado |
|---------|-------------|--------|
| Archivo .json importable sin errores | Sin errores al importar en Postman | Verificado |
| 24 requests definidos | 5 carpetas con 5 requests c/u, más 4 health | Verificado |
| Token automático en variables | Script en LOGIN guarda variable de colección | Verificado |
| Pruebas separadas por rol Admin/Vendedor/User | Requests 12-14 y 17-19 | Verificado |
| Health checks para 4 servicios | Carpeta 1 con 4 requests | Verificado |
| Flujo completo documentado | Carpeta 5 con 5 pasos | Verificado |
| Pruebas pasando en local | docker-compose up + Run All = 18 verdes | Verificado |
| Compatible con producción Azure | Cambiar base_url a URL del gateway | Listo |

---

## Cambiar a Producción (Azure)

Para ejecutar las mismas pruebas contra el ambiente de Azure:

1. En Postman, haz clic en el nombre de la colección **"Toyota Pedidos"**
2. Ve a la pestaña **"Variables"**
3. En la variable `base_url`, cambia el valor de:
   ```
   http://localhost:5000
   ```
   a:
   ```
   https://toyota-gateway.wittystone-43cf97a7.eastus2.azurecontainerapps.io
   ```
4. Haz clic en **"Save"**
5. Ejecuta el Collection Runner nuevamente
6. Todos los tests deben pasar igual que en local

**Nota:** Los health checks de localhost:3001, 3002, 3003 seguirán apuntando a local. Para probar en nube, solo se necesita que el gateway (base_url) sea el de Azure, ya que enruta internamente a los microservicios.

---

## Solución de Problemas Comunes

| Problema | Causa probable | Solución |
|---------|---------------|---------|
| `Connection refused` en todos los requests | Docker no está corriendo o servicios apagados | Ejecutar `docker-compose up -d` y esperar 30 segundos |
| `401 Unauthorized` en todos los endpoints protegidos | Los tokens no se guardaron | Ejecutar primero los 3 LOGINs en la carpeta 2 |
| `403 Forbidden` donde esperaba 200 | Usando el token equivocado para el rol | Verificar que el header `Authorization` tiene `{{token}}` (no `{{token_vendedor}}`) |
| Tests en rojo pero respuesta correcta | El script de test está buscando un campo diferente | Ver el mensaje de error en la pestaña "Test Results" para detalles |
| `Token expirado` después de 8 horas | Los tokens JWT tienen vida de 8 horas | Ejecutar de nuevo los LOGINs para obtener tokens frescos |
| Error al importar el JSON | Archivo corrupto o versión incompatible | Verificar que Postman está actualizado, descargar el archivo de nuevo |

---

## Referencia Rápida de Credenciales

| Usuario | Contraseña | Rol | Qué puede hacer |
|---------|-----------|-----|----------------|
| alejandrochreyes2@gmail.com | [contraseña-admin] | Admin | Todo — ver y crear pedidos y pagos |
| vendedor@toyota-pedidos.com | [contraseña-vendedor] | Vendedor | Ver y crear pedidos, NO puede ver pagos |
| usuario@toyota-pedidos.com | [contraseña-user] | User | Solo ver pedidos, no puede crear ni ver pagos |
| alejandrochreyes2@gmail.com | [contraseña-admin] | Admin | Igual que el primer Admin |

---

*Documento generado para el proyecto Toyota Pedidos Enterprise — Marzo 2026*
