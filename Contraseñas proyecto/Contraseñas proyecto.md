# Contraseñas Proyecto — Outiltech E-Commerce
**Actualizado:** 23 de abril de 2026  
**Proyecto:** Plataforma E-Commerce Outiltech  
**Dominio:** https://outiltech.co  
**Desarrollador:** Alejandro Chaparro Reyes — alejandrochreyes2@gmail.com — 3133082905

> CONFIDENCIAL — No compartir este archivo. Protegerlo con contraseña o mantenerlo offline.

---

## 1. SERVIDOR HETZNER (VPS)

| Parámetro | Valor |
|-----------|-------|
| Proveedor | Hetzner Cloud |
| IP del servidor | `178.156.222.248` |
| IP alternativa | `178.156.222.249` |
| Puerto SSH | `22` |
| Usuario SSH | `root` |
| Autenticación SSH | Clave SSH (archivo `id_rsa` en `C:\Users\user\.ssh\`) |
| Panel de Hetzner | https://console.hetzner.cloud |

---

## 2. COOLIFY (Orquestador de contenedores)

| Parámetro | Valor |
|-----------|-------|
| URL del panel | http://178.156.222.248:8000 |
| UUID de la app | `g12weuw6n4h1cag21oo53sd1` |
| API Token | Guardado en GitHub Secret: `COOLIFY_API_TOKEN` |
| URL de Coolify | Guardado en GitHub Secret: `COOLIFY_URL` |

**Para iniciar sesión en Coolify:** Abrir http://178.156.222.248:8000 en el navegador.

---

## 3. BASE DE DATOS POSTGRESQL — PRODUCCIÓN (Hetzner)

| Parámetro | Valor |
|-----------|-------|
| Host externo | `178.156.222.248` |
| Host interno (Docker) | `postgres` |
| Puerto | `5432` |
| Base de datos | `outiltech` |
| Usuario | `postgres` |
| Contraseña | `root` |
| Conexión DBeaver | Host: `178.156.222.248`, Puerto: `5432`, DB: `outiltech`, User: `postgres`, Pass: `root` |

**Contenedor en Hetzner:** `postgres-g12weuw6n4h1cag21oo53sd1-145444361808`

---

## 4. BASE DE DATOS POSTGRESQL — DESARROLLO LOCAL

| Parámetro | Valor |
|-----------|-------|
| Host | `localhost` |
| Puerto | `5432` |
| Base de datos | `outiltech_db` |
| Usuario | `toyota_user` |
| Contraseña | `Toyota2026!` |
| Conexión DBeaver | Host: `localhost`, Puerto: `5432`, DB: `outiltech_db`, User: `toyota_user`, Pass: `Toyota2026!` |

**Para iniciar el contenedor local:**
```bash
cd "c:\...\proyecto-pedidos"
docker-compose up -d postgres
```

> El postgres local también tiene usuario `postgres` con contraseña `postgres` (acceso superusuario).

---

## 5. MONGODB

| Parámetro | Valor |
|-----------|-------|
| Host local (Docker) | `mongodb://mongodb:27017` |
| Host externo prod | `178.156.222.248:27017` |
| Usuario admin | `admin` |
| Contraseña admin | `root` |
| Base de datos | Sin autenticación en desarrollo |

---

## 6. JWT (Autenticación entre microservicios)

| Parámetro | Producción (Coolify) | Desarrollo (appsettings) |
|-----------|----------------------|--------------------------|
| Key | `YourSuperSecretKeyHere1234567890` | `OutiltechSecretKey2026SuperSegura!MínimoCincuentaCaracteres!!` |
| Issuer | `OutilTech` | `outiltech-api` |
| Audience | `OutilTechUsers` | `outiltech-client` |

---

## 7. USUARIOS DEL SISTEMA (Login en outiltech.co/login)

| Rol | Email | Usuario | Contraseña |
|-----|-------|---------|------------|
| Admin | alejandrochreyes2@gmail.com | alejandro_admin | `Kx9#mT4$vR2n` |
| Admin | contactanos@outiltech.co | jhonatan_admin | `Admin1327` |
| Admin | jhonatanhtech@gmail.com | jhonatanhtech | `Admin1327` |
| Vendedor | vendedor@outiltech.co | vendedor_outiltech | `Bw3$pL7#qN5j` |
| Usuario | usuario@outiltech.co | usuario_outiltech | `Ym6#cF1$hK8s` |

**URL de login:** https://outiltech.co/login

---

## 8. SUPABASE

| Parámetro | Valor |
|-----------|-------|
| Proyecto | `outiltech` |
| URL | `https://gklxdzhmpjwwmffjdmwv.supabase.co` |
| Referencia del proyecto | `gklxdzhmpjwwmffjdmwv` |
| Anon/Public Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbHhkemhtcGp3d21mZmpkbXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NTM0MDEsImV4cCI6MjA5MTQyOTQwMX0.Es3YyKtLnx9lKiA_xyTHxK_IDSICb9kGf5-nu2XE_jg` |
| Panel de Supabase | https://supabase.com/dashboard/project/gklxdzhmpjwwmffjdmwv |
| Tablas usadas | `pedidos`, `pagos` |

---

## 9. CLOUDFLARE

| Parámetro | Valor |
|-----------|-------|
| Dominio | `outiltech.co` |
| DNS gestionado por | Cloudflare |
| Panel | https://dash.cloudflare.com |
| Registros DNS activos | `outiltech.co` → VPS Hetzner, `api.outiltech.co` → VPS Hetzner |
| Cloudflare R2 Account ID | `25f2837928035b4d4fab5eeb7e7ef9b7` |
| Cloudflare R2 Bucket ID | `a0b7016e047745bb9b903fba581c7a59` |
| R2 Access Key ID | `ede362f51681d0704b845ff74d9fe316` |
| R2 Secret Access Key | Guardado en GitHub Secret: `R2_SECRET_ACCESS_KEY` |
| R2 URL pública | `https://pub-a0b7016e047745bb9b903fba581c7a59.r2.dev` |
| Bucket de videos | `outiltech-videos` |

---

## 10. WOMPI (Pasarela de pagos)

| Parámetro | Valor |
|-----------|-------|
| Entorno sandbox (pruebas) | |
| Public Key Sandbox | `pub_test_iGDtX1yJbTOiwFOZQsz57WHnqkPfKATo` |
| Integrity Key Sandbox | `test_integrity_emFDteel2smneriBhxztMfMmudxgZhPg` |
| Entorno producción (real) | |
| Public Key Producción | `pub_prod_KvfEtrlz3o4BUKuiSvYufUMqFYW8h5GK` |
| Panel Wompi | https://comercios.wompi.co |

> La llave privada de producción (`priv_prod_...`) NO está en el código. Debe obtenerse del panel de Wompi y guardarse como variable de entorno en Coolify.

---

## 11. EMAILJS (Envío de correos)

| Parámetro | Valor |
|-----------|-------|
| Cuenta | alejandrochreyes2@gmail.com |
| Service ID | `service_outiltech` |
| Template ID (checkout/pedidos) | `template_zbn2qhv` |
| Template ID (contacto) | `template_wqqymcp` |
| Public Key | `K16QvN016m0k4KJdY` |
| Panel EmailJS | https://dashboard.emailjs.com |

---

## 12. GITHUB

| Parámetro | Valor |
|-----------|-------|
| Usuario | `alejandrochreyes2` |
| Repo backend + docs | https://github.com/alejandrochreyes2/outilotech-pedidos |
| Repo portafolio frontend | https://github.com/alejandrochreyes2/outiltech-portafolio |

---

## 13. URLS DEL PROYECTO

| Servicio | URL |
|----------|-----|
| Tienda web | https://outiltech.co |
| Login | https://outiltech.co/login |
| API Gateway | https://api.outiltech.co |
| Swagger Usuarios | https://api.outiltech.co/api/usuarios/swagger |
| Swagger Pedidos | https://api.outiltech.co/api/pedidos/swagger |
| Swagger Pagos | https://api.outiltech.co/api/pagos/swagger |
| Health Usuarios | https://api.outiltech.co/api/usuarios/health |
| Panel Coolify | http://178.156.222.248:8000 |
| Video hero R2 | https://pub-a0b7016e047745bb9b903fba581c7a59.r2.dev/videos/hero-tech.mp4 |

---

## 14. COMANDOS PARA HACER PUSH (Git Bash)

### Push al repo principal (backend + docs):
```bash
cd "c:\Users\user\OneDrive - Comunicacion Celular S.A.- Comcel S.A\Documentos\mi cuaderno 2026\desarrollo software\desarrollador fullstack\prueba2\prueba\proyecto-pedidos"
git add -A
git commit -m "descripcion de los cambios"
git push origin main
```

### Push al repo portafolio:
```bash
cd "ruta del repo outiltech-portafolio"
git add -A
git commit -m "descripcion de los cambios"
git push origin main
```

> Cada push a `outilotech-pedidos/main` dispara automáticamente el redeploy en Coolify vía GitHub Actions.

---

## 15. PUERTOS DE LOS MICROSERVICIOS

| Servicio | Puerto local | Puerto contenedor |
|----------|-------------|-------------------|
| Frontend (Nginx) | 80 | 80 |
| API Gateway (YARP) | 5000 | 5000 |
| Usuarios API | 3001 | 8080 |
| Pedidos API | 3002 | 8080 |
| Pagos API | 3003 | 8080 |
| PostgreSQL | 5432 | 5432 |
| MongoDB | 27017 | 27017 |

---

*Outiltech E-Commerce — Bogotá D.C., Colombia — 2026*
