# PMO — Plan de Proyecto Toyota Pedidos Enterprise

**Versión:** 1.0
**Fecha de elaboración:** Marzo 2026
**Estado:** Plantilla lista para personalizar con datos del cliente

---

## 1. Ficha del Proyecto

| Campo | Detalle |
|-------|---------|
| **Nombre del proyecto** | Toyota Pedidos — Plataforma Enterprise de Microservicios |
| **Código del proyecto** | TPEM-2026-001 |
| **Cliente** | [Nombre de la empresa cliente] |
| **Representante del cliente** | [Nombre y cargo del contacto principal] |
| **Presupuesto aprobado** | $20.000.000 COP |
| **Forma de pago** | 50% al firmar · 50% a la entrega |
| **Duración estimada** | 30 días calendario (4 semanas + 2 días de cierre) |
| **Fecha de inicio** | [Fecha acordada con el cliente — Día 1] |
| **Fecha de entrega** | [Fecha de inicio + 30 días] |
| **Inicio soporte** | [Fecha de entrega + 1 día] |
| **Fin soporte** | [Fecha de entrega + 15 días] |
| **Modalidad** | Remoto 100% |
| **Canal de comunicación** | WhatsApp / Email / Videollamada semanal |
| **Repositorio** | https://github.com/alejandrochreyes2/proyecto-pedidos |
| **URL de producción** | https://gentle-water-0ba98b90f.1.azurestaticapps.net |

### Equipo del Proyecto

| Rol | Nombre | Responsabilidad |
|-----|--------|----------------|
| **Gerente de Proyecto** | Alejandro Chaparro Reyes | Gestión cliente, entregables, cronograma |
| **Arquitecto Senior** | Claude Code (IA Senior Developer) | Diseño técnico, decisiones de arquitectura |
| **Tech Lead** | Daniel | Desarrollo backend, integraciones, DevOps |

---

## 2. Alcance del Proyecto

### 2.1 Incluido en el precio — $20.000.000 COP

**Backend (Microservicios):**
- ✅ 3 microservicios independientes en .NET 8 (Usuarios, Pedidos, Pagos)
- ✅ API Gateway YARP para enrutamiento centralizado
- ✅ Autenticación JWT con algoritmo HS256 y expiración configurable
- ✅ 3 roles de acceso: Administrador, Vendedor, Usuario
- ✅ Base de datos PostgreSQL con 3 esquemas separados
- ✅ Base de datos MongoDB para catálogo de productos
- ✅ Seed data inicial (usuarios y productos de muestra)

**Frontend (Angular):**
- ✅ SPA Angular 21 con diseño corporativo personalizado
- ✅ Dashboard con métricas en tiempo real
- ✅ Módulo de gestión de pedidos (CRUD completo)
- ✅ Módulo de gestión de pagos (Admin)
- ✅ Sistema de login con manejo de sesión y guards por rol
- ✅ 6 secciones informativas (Acerca, Concesionarios, Planes, Promociones, Contacto, Simulador)
- ✅ Formulario de contacto con envío de emails reales (EmailJS)
- ✅ Simulador de crédito con cálculo de cuotas en tiempo real
- ✅ Diseño responsive (PC, tablet, celular)
- ✅ PWA instalable en Android e iOS

**Infraestructura (Azure):**
- ✅ Frontend en Azure Static Web Apps (CDN global)
- ✅ Microservicios en Azure Container Apps (auto-scaling)
- ✅ Azure Container Registry para imágenes Docker
- ✅ CI/CD con GitHub Actions (deploy automático al hacer push)
- ✅ Configuración de CORS por ambiente

**Documentación y Entrega:**
- ✅ Manual de usuario (lenguaje no técnico)
- ✅ Manual técnico de pruebas con 18 escenarios documentados
- ✅ Colección Postman exportada y lista para importar
- ✅ Documento de arquitectura técnica con diagrama Draw.io
- ✅ Plan PMO del proyecto
- ✅ Código fuente 100% entregado en GitHub

**Capacitación y Soporte:**
- ✅ Sesión de capacitación de 2 horas (grabada en video)
- ✅ 15 días de soporte correctivo post-entrega sin costo adicional
- ✅ Transferencia de accesos Azure al cliente
- ✅ Transferencia del repositorio GitHub al cliente

---

### 2.2 No incluido (fuera de alcance)

- ❌ Integración con sistemas ERP o CRM existentes (SAP, Salesforce, etc.)
- ❌ Pasarela de pagos real (Wompi, PSE, MercadoPago, Stripe)
- ❌ App nativa en Play Store o App Store (Flutter o React Native)
- ❌ Migración de datos históricos de sistemas anteriores
- ❌ Módulo de reportes o business intelligence (Power BI, etc.)
- ❌ Soporte técnico después de los 15 días de garantía
- ❌ Cambios de alcance o nuevas funcionalidades después de la aprobación de requisitos
- ❌ Hosting posterior a la entrega (el cliente asume costos de Azure)
- ❌ Dominio personalizado (el cliente debe adquirirlo y configurarlo)

---

### 2.3 Supuestos del Proyecto

1. El cliente provee logo, colores corporativos y textos de contenido antes del inicio de la semana 3
2. El cliente tiene o crea una cuenta en Azure con tarjeta de crédito activa
3. El cliente designa un responsable técnico para pruebas y aprobaciones
4. Los requisitos quedan congelados después de la aprobación en la semana 1
5. El cliente responde solicitudes de información en un plazo máximo de 24 horas hábiles
6. El entorno de producción final usa las credenciales de Azure del cliente

---

## 3. Objetivos SMART

| # | Objetivo | Específico | Medible | Alcanzable | Relevante | Tiempo |
|---|---------|-----------|---------|-----------|----------|--------|
| 1 | **Autenticación funcional** | Login con 3 roles (Admin, Vendedor, User) | 100% de pruebas de login pasan | Sí, implementado con JWT | Seguridad del sistema | Fin semana 1 |
| 2 | **Backend completo** | 3 microservicios con 11 endpoints documentados | 11/11 endpoints responden correctamente | Sí, stack conocido | Core del negocio | Fin semana 2 |
| 3 | **Frontend en producción** | Angular desplegado en URL pública de Azure | URL responde 200 en Chrome, Edge y móvil | Sí, infraestructura lista | Acceso del cliente | Fin semana 3 |
| 4 | **Calidad verificada** | 18 escenarios de prueba documentados | 18/18 pruebas pasan en producción | Sí, escenarios definidos | Confianza del cliente | Fin semana 4 |
| 5 | **Entrega formal** | Documentación, capacitación y accesos transferidos | Acta de entrega firmada | Sí, proceso definido | Cierre formal del proyecto | Día 30 |

---

## 4. Metodología de Trabajo

### 4.1 Marco Metodológico

Scrum adaptado con sprints semanales, enfocado en entregas de valor al cliente al final de cada semana. La comunicación es asincrónica por defecto (GitHub + WhatsApp) con reuniones sincrónicas mínimas y enfocadas.

### 4.2 Ceremonias del Proyecto

| Ceremonia | Día | Duración | Participantes | Propósito |
|-----------|-----|----------|--------------|----------|
| **Kick-off** | Día 1 (Lunes) | 1 hora | Todo el equipo + cliente | Alineación de objetivos y acuerdos |
| **Check-in** | Cada lunes | 30 min | Gerente + cliente | Revisión de avance semanal |
| **Stand-up** | Cada miércoles | 15 min | Equipo técnico | Bloqueos y prioridades |
| **Demo** | Cada viernes | 45 min | Todo el equipo + cliente | Demostración de entregables |
| **Retrospectiva** | Fin de semana 2 | 30 min | Equipo técnico | Mejoras de proceso |
| **Demo final** | Día 28 | 1 hora | Todo el equipo + cliente | Presentación del sistema completo |
| **Capacitación** | Día 29 | 2 horas | Equipo técnico + usuarios finales | Transferencia de conocimiento |

### 4.3 Herramientas de Trabajo

| Herramienta | Uso |
|------------|-----|
| **GitHub** | Repositorio de código y fuente de verdad del proyecto |
| **GitHub Actions** | CI/CD automático en cada push a main |
| **WhatsApp** | Comunicación informal y alertas urgentes |
| **Email** | Comunicación formal, entregables y aprobaciones |
| **Postman** | Pruebas de API y documentación técnica |
| **draw.io** | Diagramas de arquitectura |
| **Google Meet / Teams** | Videollamadas de reuniones |

---

## 5. Las 5 Fases de Implementación

---

### FASE 1 — SEMANA 1: Fundamentos y Arquitectura
**Días 1 al 7**

#### Actividades detalladas

| Día | Actividad | Responsable | Criterio de completitud |
|-----|----------|-------------|------------------------|
| 1-2 | Levantamiento de requisitos con el cliente (formulario + entrevista) | Alejandro | Documento de requisitos aprobado |
| 2 | Definición y aprobación de arquitectura técnica | Claude Code | Diagrama de arquitectura firmado |
| 3 | Configuración repositorio GitHub, ramas y protecciones | Daniel | Branch main protegido, CI/CD verde |
| 3 | Configuración Azure: Resource Group, ACR, Container Apps Env | Daniel | Recursos Azure creados y verificados |
| 3-4 | Microservicio Usuarios: modelos, DbContext, seed data | Daniel | Seed data funcionando en Docker local |
| 4 | Endpoints de autenticación con JWT y 3 roles | Daniel | POST /auth/login devuelve token válido |
| 4-5 | Microservicio Pedidos: CRUD básico con autorización | Daniel | GET y POST /pedidos funcionan con token |
| 5 | Pipeline GitHub Actions: build + push a ACR + deploy Container Apps | Daniel | Push a main → deploy automático en 5 min |
| 6 | Pruebas de integración semana 1 (6 escenarios) | Alejandro | 6/6 pruebas pasan con curl o Postman |
| 7 | Demo semana 1 al cliente | Alejandro | Cliente aprueba el avance |

#### Entregables Semana 1

- [ ] Documento de arquitectura técnica aprobado por el cliente
- [ ] Repositorio GitHub configurado con CI/CD funcionando
- [ ] Microservicio Usuarios con login y JWT completamente funcional
- [ ] Microservicio Pedidos con CRUD básico (GET, POST)
- [ ] URL de Azure respondiendo con HTTP 200
- [ ] Colección Postman con 6 pruebas básicas

#### Criterios de Aceptación Semana 1

- Login funcional con los 3 roles (Admin, Vendedor, User)
- JWT con expiración de 8 horas verificada
- Pipeline GitHub Actions verde en la primera ejecución manual
- URL `http://localhost/login` responde 200 en entorno local
- URL de Azure Static Web Apps responde 200 con la app cargada

---

### FASE 2 — SEMANA 2: Backend Completo y Seguro
**Días 8 al 14**

#### Actividades detalladas

| Día | Actividad | Responsable | Criterio de completitud |
|-----|----------|-------------|------------------------|
| 8-9 | Microservicio Pagos con PostgreSQL real y seed data | Daniel | POST /pagos devuelve 201 con datos correctos |
| 9-10 | API Gateway YARP: enrutamiento completo a los 3 servicios | Daniel | Los 3 servicios responden a través del gateway |
| 10 | Repository Pattern y DTOs en los 3 microservicios | Daniel | Código refactorizado, sin DbContext en controllers |
| 11 | MongoDB: setup, conexión y seed de 5 productos en catálogo | Daniel | GET /api/productos devuelve 5 productos |
| 11-12 | Middleware global de excepciones y logging estructurado | Daniel | Errores 500 devuelven JSON con mensaje claro |
| 12 | Swagger documentado y funcional en los 3 servicios | Daniel | Swagger UI abre en /swagger en cada servicio |
| 13 | Pruebas de integración entre microservicios (11 escenarios) | Alejandro | 11/11 pruebas pasan con Postman |
| 14 | Demo semana 2 al cliente | Alejandro | Cliente aprueba backend completo |

#### Entregables Semana 2

- [ ] 3 microservicios funcionando en Azure Container Apps
- [ ] API Gateway enrutando correctamente los 3 servicios
- [ ] 11 escenarios de prueba pasando con Postman (tabla completa)
- [ ] Documentación Swagger de cada microservicio accesible
- [ ] Bases de datos PostgreSQL y MongoDB operativas
- [ ] Script `init-mongo.js` para persistencia del catálogo

#### Criterios de Aceptación Semana 2

| Prueba | Resultado esperado |
|--------|--------------------|
| GET /api/pedidos sin token | 401 Unauthorized |
| GET /api/pedidos con Admin | 200 OK con lista |
| GET /api/pagos con Vendedor | 403 Forbidden |
| POST /api/pagos con Admin | 201 Created |
| POST /api/usuarios/auth/login con credenciales válidas | 200 con token JWT |

---

### FASE 3 — SEMANA 3: Frontend Angular Enterprise
**Días 15 al 21**

#### Actividades detalladas

| Día | Actividad | Responsable | Criterio de completitud |
|-----|----------|-------------|------------------------|
| 15-16 | Configuración Angular 21 standalone con Signals API | Daniel | App compila y corre en localhost:4200 |
| 16 | Diseño UI corporativo con colores, logo y tipografía del cliente | Daniel/Alejandro | Mockup aprobado por el cliente |
| 17 | Guards de autenticación y autorización por rol | Daniel | Ruta /dashboard bloquea sin token |
| 17-18 | Módulos Dashboard, Pedidos y Pagos con llamadas a la API | Daniel | Dashboard muestra pedidos y pagos reales |
| 18 | Secciones informativas: Acerca, Concesionarios, Planes, Promociones | Daniel | 4 secciones visibles en el menú público |
| 19 | Formulario de contacto con EmailJS configurado | Daniel | Email llega al destinatario en < 1 min |
| 19-20 | Simulador de crédito: cálculo PMT en tiempo real con Signals | Daniel | Simulador calcula cuota al cambiar valores |
| 20 | Configuración Angular environments (local vs producción) | Daniel | Build prod usa URL del gateway de Azure |
| 20 | Deploy a Azure Static Web Apps con configuración correcta | Daniel | URL de producción funciona 100% |
| 21 | Demo semana 3 al cliente | Alejandro | Cliente aprueba el frontend completo |

#### Entregables Semana 3

- [ ] Frontend desplegado en Azure Static Web Apps con URL pública
- [ ] Todas las rutas protegidas correctamente por rol
- [ ] Formulario de contacto enviando emails reales con EmailJS
- [ ] Simulador de crédito funcional con cálculo en tiempo real
- [ ] Diseño responsive verificado en PC, tablet y celular Android
- [ ] Angular environments configurados para local y producción

#### Criterios de Aceptación Semana 3

- Login como Admin muestra 5 opciones en el menú (Dashboard, Pedidos, Pagos, Catálogo, Salir)
- Login como Vendedor muestra 3 opciones (Dashboard, Pedidos, Salir)
- Login como User muestra vista de solo lectura
- La app funciona en celular Android sin instalar ninguna app (PWA)
- Emails del formulario de contacto llegan en menos de 1 minuto
- El simulador calcula la cuota mensual correctamente con fórmula PMT

---

### FASE 4 — SEMANA 4: Integración, Calidad y Documentación
**Días 22 al 28**

#### Actividades detalladas

| Día | Actividad | Responsable | Criterio de completitud |
|-----|----------|-------------|------------------------|
| 22-23 | Integración completa frontend-backend en producción | Daniel | Login, pedidos y pagos funcionan en Azure |
| 23 | Pruebas end-to-end con Postman: 18 escenarios completos | Alejandro | 18/18 tests pasan en colección Postman |
| 24 | Pruebas en múltiples dispositivos: PC, Android, iOS, tablet | Alejandro | Sin errores en consola en ningún dispositivo |
| 24 | Verificación de persistencia de datos | Daniel | Datos sobreviven restart de contenedores |
| 25 | Optimización: tiempo de respuesta, bundle size, CORS | Daniel | Respuesta < 2 seg, bundle < 1MB |
| 25-26 | Manual de usuario (lenguaje no técnico, con capturas) | Alejandro | Manual revisado y aprobado por el cliente |
| 26-27 | Manual técnico de pruebas con capturas de pantalla | Alejandro | Manual con los 18 escenarios documentados |
| 27 | Colección Postman exportada, documentada y verificada | Daniel | Archivo .json importable con tests pasando |
| 28 | Demo final completo al cliente | Alejandro | Cliente da aprobación formal del sistema |

#### Entregables Semana 4

- [ ] Sistema integrado 100% en producción (frontend + backend + datos)
- [ ] 18 pruebas Postman documentadas y pasando en producción
- [ ] Manual de usuario completo con capturas de pantalla
- [ ] Manual técnico de pruebas con 18 escenarios detallados
- [ ] Colección Postman exportada como `.json` lista para importar
- [ ] Tiempos de respuesta verificados (< 2 segundos en todas las rutas)

#### Criterios de Aceptación Semana 4

| Criterio | Estándar de calidad |
|----------|-------------------|
| Pruebas Postman | 18/18 pasan en el entorno de producción |
| Tiempo de respuesta | Todos los endpoints < 2 segundos |
| Compatibilidad de navegadores | Chrome ✅ Edge ✅ Firefox ✅ Safari ✅ |
| Consola del navegador | Sin errores rojos en ningún flujo crítico |
| Persistencia de datos | Datos disponibles después de reiniciar el sistema |
| Diseño responsive | Sin scroll horizontal en mobile (320px mínimo) |

---

### FASE 5 — DÍAS 29-30: Cierre, Capacitación y Entrega Formal
**Días 29 al 30**

#### Actividades detalladas

| Día | Actividad | Responsable | Criterio de completitud |
|-----|----------|-------------|------------------------|
| 29 (mañana) | Sesión de capacitación de 2 horas (grabada) | Alejandro + Daniel | Video grabado y compartido al cliente |
| 29 (tarde) | Transferencia de accesos Azure al cliente | Daniel | Cliente confirma acceso a Azure Portal |
| 29 (tarde) | Transferencia del repositorio GitHub al cliente | Daniel | Cliente tiene acceso de propietario al repo |
| 30 (mañana) | Elaboración del documento de cierre del proyecto | Alejandro | Documento firmado por ambas partes |
| 30 (mañana) | Acta de entrega y aceptación formal | Alejandro | Acta firmada digitalmente |
| 30 (tarde) | Inicio oficial del período de soporte de 15 días | Alejandro | Canal de soporte activo y confirmado |

#### Agenda de Capacitación (Día 29 — 2 horas)

| Bloque | Duración | Contenido |
|--------|----------|-----------|
| **Bloque 1** | 30 min | Acceso al sistema: login, roles, cambio de contraseña |
| **Bloque 2** | 30 min | Gestión de pedidos: crear, consultar, filtrar, exportar |
| **Bloque 3** | 20 min | Gestión de pagos: registrar, asociar a pedido, estados |
| **Bloque 4** | 15 min | Administración: crear usuarios, asignar roles |
| **Bloque 5** | 25 min | Preguntas y respuestas en vivo |

#### Entregables de Cierre

- [ ] Video de capacitación grabado y compartido (Google Drive / YouTube privado)
- [ ] Acceso completo a Azure transferido al cliente (Propietario del Resource Group)
- [ ] Repositorio GitHub transferido al cliente (propietario del repo)
- [ ] Acta de entrega y aceptación firmada por ambas partes
- [ ] Documento de cierre del proyecto
- [ ] Contacto de soporte post-entrega confirmado y activo (15 días)

---

## 6. Cronograma Visual — Gantt Simplificado

```
ACTIVIDAD                               S1    S2    S3    S4    CIERRE
──────────────────────────────────────────────────────────────────────
Levantamiento de requisitos           ████
Definición de arquitectura            ████
Microservicio Usuarios (Auth+JWT)     ████
Microservicio Pedidos (CRUD)          ██    ██
Microservicio Pagos                         ████
API Gateway YARP                            ████
Base de datos PostgreSQL (3 schemas)   ██   ██
Base de datos MongoDB (catálogo)            ██
CI/CD GitHub Actions                  ████
Azure Container Apps (deploy)          ██   ██
Frontend Angular 21 (base)                        ████
Diseño UI corporativo                             ████
Módulos Dashboard / Pedidos / Pagos               ████
Secciones públicas (6 módulos)                    ████
PWA + Mobile                                      ████
Environments local/nube                           ████
Integración completa                                    ████
Pruebas Postman (18 escenarios)                         ████
Documentación técnica                                    ████
Manual de usuario                                        ████
Optimización y rendimiento                               ████
Capacitación cliente                                           ██
Acta de entrega y cierre                                       ██
──────────────────────────────────────────────────────────────────────
DEMO DE AVANCE                         ✓     ✓     ✓     ✓     ✓
```

---

## 7. Gestión de Riesgos

| # | Riesgo identificado | Probabilidad | Impacto | Plan de mitigación | Plan de contingencia |
|---|--------------------|--------------|---------|--------------------|---------------------|
| 1 | Cambios de requisitos después de la aprobación | Media | Alto | Congelar requisitos en semana 1 con firma del cliente | Control de cambios con cotización adicional |
| 2 | Problemas de disponibilidad en Azure | Baja | Alto | Ambiente local 100% funcional como backup | Presentar demo desde localhost con docker-compose |
| 3 | Retrasos en la respuesta del cliente | Media | Medio | Establecer SLA de respuesta 24h en el contrato | Adelantar trabajo paralelo que no dependa del cliente |
| 4 | Bug crítico en producción post-entrega | Baja | Alto | Pruebas exhaustivas en semana 4 antes de la entrega | Soporte de 15 días incluido para correcciones |
| 5 | Problemas de conectividad o herramientas | Baja | Bajo | Trabajo asincrónico con GitHub como fuente de verdad | Videollamada de respaldo en horario flexible |
| 6 | Aumento de costos en Azure | Baja | Medio | Usar tier gratuito de Azure para la demo | El cliente asume costos reales en producción |

---

## 8. Presupuesto Detallado

| Concepto | Descripción | Horas | Valor/hora | Subtotal |
|---------|-------------|-------|-----------|---------|
| **Gestión de proyecto y cliente** | Reuniones, documentación PMO, seguimiento, actas | 20h | $150.000 | $3.000.000 |
| **Arquitectura y diseño técnico** | Diagrama, decisiones técnicas, revisión de código | 20h | $150.000 | $3.000.000 |
| **Desarrollo backend** | 3 microservicios + Gateway + CI/CD + Docker | 40h | $150.000 | $6.000.000 |
| **Desarrollo frontend** | Angular 21 + 9 módulos + diseño + PWA + environments | 30h | $150.000 | $4.500.000 |
| **QA y pruebas** | 18 escenarios Postman + pruebas de regresión + cross-browser | 8h | $100.000 | $800.000 |
| **Documentación** | Manual de usuario + manual técnico + README + colección Postman | 4h | $100.000 | $400.000 |
| **Infraestructura Azure** | Container Apps + Static Web Apps + ACR + PostgreSQL (1 mes) | — | — | $1.300.000 |
| **Capacitación y cierre** | Sesión 2h grabada + transferencia accesos + acta de entrega | 8h | $125.000 | $1.000.000 |
| **TOTAL** | | **130h** | | **$20.000.000 COP** |

### 8.1 Forma de Pago

| Hito | Monto | Cuándo |
|------|-------|--------|
| **Pago inicial** | $10.000.000 COP (50%) | Al firmar el contrato de servicios |
| **Pago final** | $10.000.000 COP (50%) | Al firmar el acta de entrega (Día 30) |

### 8.2 Medios de Pago Aceptados

- Transferencia bancaria
- Nequi
- Daviplata
- Efectivo (previa coordinación)

> *Nota: El IVA aplica según el régimen tributario del cliente. Consultar antes de firmar.*

---

## 9. Garantía y Soporte Post-Entrega

### 9.1 Qué incluye la garantía (15 días sin costo)

- Corrección de bugs o errores funcionales detectados después de la entrega
- Ajustes menores de configuración (CORS, variables de entorno, credenciales)
- Soporte para dudas técnicas sobre el uso del sistema
- Respuesta a incidentes en máximo 4 horas hábiles

### 9.2 Qué NO incluye la garantía

- Nuevas funcionalidades o módulos no contemplados en el alcance
- Cambios de diseño o modificaciones visuales adicionales
- Integración con nuevos sistemas externos
- Incidentes causados por cambios realizados por el cliente sin previo aviso

### 9.3 Proceso de Soporte

1. El cliente reporta el incidente por WhatsApp o email con descripción y captura de pantalla
2. El equipo confirma recepción en máximo 2 horas hábiles
3. Se clasifica el incidente (crítico / alto / medio / bajo)
4. Resolución según prioridad: crítico < 4h, alto < 8h, medio < 24h, bajo < 48h
5. El cliente prueba y confirma la resolución

---

## 10. Condiciones Comerciales

| Condición | Detalle |
|-----------|---------|
| **Vigencia de la propuesta** | 30 días calendario desde la fecha de envío |
| **Moneda** | Pesos colombianos (COP) |
| **IVA** | No incluido. Aplicable según régimen del cliente |
| **Contrato** | Se requiere contrato de servicios tecnológicos firmado antes de iniciar |
| **Propiedad intelectual** | 100% del código fuente es propiedad del cliente al finalizar el proyecto |
| **Confidencialidad** | Firma de NDA disponible bajo solicitud del cliente |
| **Cancelación** | Si el cliente cancela después de iniciar, el pago inicial no es reembolsable |

---

## 11. Aprobación y Firmas

*Este plan será firmado por ambas partes antes del inicio del proyecto.*

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| **Gerente de Proyecto** | Alejandro Chaparro Reyes | __________________ | ___________ |
| **Representante del Cliente** | [Nombre y cargo] | __________________ | ___________ |

---

*Documento elaborado por el equipo de proyecto Toyota Pedidos Enterprise.*
*Versión 1.0 — Marzo 2026*
