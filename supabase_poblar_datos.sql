-- ============================================================
-- OUTILTECH — Poblar Supabase con datos de PostgreSQL local
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Limpiar tablas primero (para evitar duplicados si se corre varias veces)
TRUNCATE TABLE public.pagos          RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.relacion_ventas RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.lista_productos RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.pedidos        RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.usuarios       RESTART IDENTITY CASCADE;

-- ============================================================
-- 1. PEDIDOS (5 compras reales del carrito)
-- ============================================================
INSERT INTO public.pedidos
  (id, cliente, total, fecha, email, telefono, nombre, apellido, empresa,
   ciudad, direccion, barrio, tipo_id, numero_id, metodo_envio, metodo_pago,
   items_json, estado)
VALUES
  (1, 'OutilTech Test', 9399000, '2026-04-11 00:38:39+00',
   'test@outiltech.co', '3110000000', 'Usuario', 'Prueba', 'OutilTech Demo',
   'Bogotá', 'Calle Test 123', 'Centro', 'CC', '999999999',
   'domicilio', 'tarjeta',
   '[{"id":3,"nombre":"MacBook Pro 14 M5","cantidad":1,"v_unitario":9399000}]',
   'Completado'),

  (2, 'OutilTech Test', 9399000, '2026-04-11 00:40:13+00',
   'test@outiltech.co', '3110000000', 'Usuario', 'Prueba', 'OutilTech Demo',
   'Bogotá', 'Calle Test 123', 'Centro', 'CC', '999999999',
   'domicilio', 'tarjeta',
   '[{"id":3,"nombre":"MacBook Pro 14 M5","cantidad":1,"v_unitario":9399000}]',
   'Completado'),

  (3, 'carlos biyagran', 4800000, '2026-04-11 00:51:00+00',
   'alejandrochreyes2@gmail.com', '3133082905', 'carlos', 'biyagran', 'Petición personal',
   'Cali', 'transversal 9 # 40-81', 'ois', 'CC', '80766703',
   'domicilio', 'nequi',
   '[{"id":"iph17pro-256","nombre":"iPhone 17 Pro 256GB","marca":"Apple","variante":"","cantidad":1,"precioUnitario":4800000,"subtotal":4800000}]',
   'Completado'),

  (4, 'Cliente', 9600000, '2026-04-11 01:44:21+00',
   '', '', '', '', '',
   '', '', '', '', '',
   'domicilio', 'tarjeta',
   '[{"id":"iph17pro-256","nombre":"iPhone 17 Pro 256GB","marca":"Apple","variante":"","cantidad":2,"precioUnitario":4800000,"subtotal":9600000}]',
   'Completado'),

  (5, 'Raul alejandro Chaparro reyes', 3550000, '2026-04-11 01:49:40+00',
   'alejandrochreyes@gmail.com', '3133082905', 'Raul alejandro', 'Chaparro reyes', 'Lider técnico Senior',
   'Bogotá', 'Kr 72m bis b # 42b-15 sur', 'boita', 'CC', '80766703',
   'domicilio', 'nequi',
   '[{"id":"iph17-256","nombre":"iPhone 17 256GB","marca":"Apple","variante":"","cantidad":1,"precioUnitario":3550000,"subtotal":3550000}]',
   'Completado');

-- Reiniciar secuencia para que próximos IDs empiecen en 6
SELECT setval('public.pedidos_id_seq', 5, true);

-- ============================================================
-- 2. PAGOS (1 transacción aprobada)
-- ============================================================
INSERT INTO public.pagos
  (id, pedido_id, monto, moneda, metodo, estado, referencia, banco, fecha)
VALUES
  (1, 3, 4800000, 'COP', 'nequi', 'Aprobado', 'NEQ-2026-APR-00003', 'Nequi', '2026-04-11 01:33:57+00');

SELECT setval('public.pagos_id_seq', 1, true);

-- ============================================================
-- 3. LISTA PRODUCTOS (catálogo de 3 equipos)
-- ============================================================
INSERT INTO public.lista_productos
  (id, ref, nombre, descripcion, categoria, subcategoria, marca, cantidad,
   v_unitario, imei_serial, contrasena, display, back_cover, celular,
   computador, observaciones, activo)
VALUES
  (1, 'IPH17PRO-256', 'iPhone 17 Pro 256GB',
   'iPhone 17 Pro Sim Física, 1 año garantía Apple, titanio negro',
   'iPhone', '', 'Apple', 5, 4800000, '', '', '', '', '', '', '', true),

  (2, 'SS26U-256', 'Samsung Galaxy S26 Ultra',
   'Samsung S26 Ultra 256GB, IA integrada, 200MP cámara',
   'Samsung', '', 'Samsung', 3, 5200000, '', '', '', '', '', '', '', true),

  (3, 'MBP14-M5', 'MacBook Pro 14" M5',
   'MacBook Pro chip M5 Pro, 16GB RAM, 512GB SSD',
   'Mac', '', 'Apple', 2, 9399000, '', '', '', '', '', '', '', true);

SELECT setval('public.lista_productos_id_seq', 3, true);

-- ============================================================
-- 4. RELACION VENTAS (1 registro semanal)
-- ============================================================
INSERT INTO public.relacion_ventas
  (id, fecha, hora, descripcion, costo, compras, fac, cliente, celular,
   observaciones, semana, anio)
VALUES
  (1, '2026-04-11', '01:33:57',
   'iPhone 17 Pro 256GB', 4800000, 1,
   'FAC-3', 'carlos biyagran', '3133082905',
   'Pago por Nequi - referencia NEQ-2026-APR-00003', 15, 2026);

SELECT setval('public.relacion_ventas_id_seq', 1, true);

-- ============================================================
-- 5. USUARIOS (admin del sistema)
-- ============================================================
INSERT INTO public.usuarios (id, name, email, role, activo)
VALUES
  (1, 'Jhonatan Hernandez', 'jhonatanhtech@gmail.com', 'Admin', true),
  (2, 'Alejandro Chaparro', 'alejandrochreyes2@gmail.com', 'Admin', true);

SELECT setval('public.usuarios_id_seq', 2, true);

-- ============================================================
-- VERIFICACIÓN FINAL
-- ============================================================
SELECT 'pedidos'         AS tabla, COUNT(*) AS registros FROM public.pedidos
UNION ALL
SELECT 'pagos',           COUNT(*) FROM public.pagos
UNION ALL
SELECT 'lista_productos', COUNT(*) FROM public.lista_productos
UNION ALL
SELECT 'relacion_ventas', COUNT(*) FROM public.relacion_ventas
UNION ALL
SELECT 'usuarios',        COUNT(*) FROM public.usuarios
ORDER BY tabla;
