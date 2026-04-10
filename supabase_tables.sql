-- ============================================================
-- OUTILTECH — Script SQL para Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. TABLA PEDIDOS (historial de compras + datos de contacto/entrega)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pedidos (
    id            SERIAL PRIMARY KEY,
    cliente       VARCHAR(200) NOT NULL DEFAULT '',
    total         NUMERIC(18,2) NOT NULL DEFAULT 0,
    fecha         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Contacto
    email         VARCHAR(200) NOT NULL DEFAULT '',
    telefono      VARCHAR(50)  NOT NULL DEFAULT '',
    -- Entrega
    nombre        VARCHAR(100) NOT NULL DEFAULT '',
    apellido      VARCHAR(100) NOT NULL DEFAULT '',
    empresa       VARCHAR(200) NOT NULL DEFAULT '',
    ciudad        VARCHAR(100) NOT NULL DEFAULT '',
    direccion     VARCHAR(300) NOT NULL DEFAULT '',
    barrio        VARCHAR(100) NOT NULL DEFAULT '',
    tipo_id       VARCHAR(10)  NOT NULL DEFAULT '',
    numero_id     VARCHAR(50)  NOT NULL DEFAULT '',
    -- Método
    metodo_envio  VARCHAR(50)  NOT NULL DEFAULT 'domicilio',
    metodo_pago   VARCHAR(50)  NOT NULL DEFAULT 'tarjeta',
    -- Productos en JSON
    items_json    TEXT         NOT NULL DEFAULT '[]',
    estado        VARCHAR(50)  NOT NULL DEFAULT 'Completado',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. TABLA PAGOS (transacciones de pago)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.pagos (
    id          SERIAL PRIMARY KEY,
    pedido_id   INTEGER REFERENCES public.pedidos(id) ON DELETE SET NULL,
    monto       NUMERIC(18,2) NOT NULL DEFAULT 0,
    moneda      VARCHAR(10)   NOT NULL DEFAULT 'COP',
    metodo      VARCHAR(50)   NOT NULL DEFAULT 'tarjeta',
    estado      VARCHAR(50)   NOT NULL DEFAULT 'Aprobado',
    referencia  VARCHAR(100)  NOT NULL DEFAULT '',
    banco       VARCHAR(100)  NOT NULL DEFAULT '',
    fecha       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 3. TABLA LISTA_PRODUCTOS (catálogo + servicio técnico)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.lista_productos (
    id              SERIAL PRIMARY KEY,
    ref             VARCHAR(50)   NOT NULL DEFAULT '',
    nombre          VARCHAR(200)  NOT NULL,
    descripcion     TEXT          NOT NULL DEFAULT '',
    categoria       VARCHAR(100)  NOT NULL DEFAULT '',
    subcategoria    VARCHAR(100)  NOT NULL DEFAULT '',
    marca           VARCHAR(100)  NOT NULL DEFAULT '',
    cantidad        INTEGER       NOT NULL DEFAULT 0,
    v_unitario      NUMERIC(18,2) NOT NULL DEFAULT 0,
    valor_total     NUMERIC(18,2) GENERATED ALWAYS AS (cantidad * v_unitario) STORED,
    -- Servicio técnico
    imei_serial     VARCHAR(100)  NOT NULL DEFAULT '',
    contrasena      VARCHAR(100)  NOT NULL DEFAULT '',
    display         VARCHAR(100)  NOT NULL DEFAULT '',
    back_cover      VARCHAR(100)  NOT NULL DEFAULT '',
    celular         VARCHAR(50)   NOT NULL DEFAULT '',
    computador      VARCHAR(100)  NOT NULL DEFAULT '',
    observaciones   TEXT          NOT NULL DEFAULT '',
    activo          BOOLEAN       NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 4. TABLA RELACION_VENTAS (registro semanal de ventas)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.relacion_ventas (
    id            SERIAL PRIMARY KEY,
    fecha         DATE          NOT NULL DEFAULT CURRENT_DATE,
    hora          TIME          NOT NULL DEFAULT CURRENT_TIME,
    descripcion   TEXT          NOT NULL DEFAULT '',
    costo         NUMERIC(18,2) NOT NULL DEFAULT 0,
    compras       INTEGER       NOT NULL DEFAULT 1,
    total         NUMERIC(18,2) GENERATED ALWAYS AS (costo * compras) STORED,
    fac           VARCHAR(50)   NOT NULL DEFAULT '',
    cliente       VARCHAR(200)  NOT NULL DEFAULT '',
    celular       VARCHAR(50)   NOT NULL DEFAULT '',
    observaciones TEXT          NOT NULL DEFAULT '',
    semana        INTEGER       NOT NULL DEFAULT EXTRACT(WEEK FROM CURRENT_DATE)::INTEGER,
    anio          INTEGER       NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 5. TABLA USUARIOS (sincronizada con PostgreSQL local)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usuarios (
    id            SERIAL PRIMARY KEY,
    name          VARCHAR(100) NOT NULL,
    email         VARCHAR(200) NOT NULL UNIQUE,
    role          VARCHAR(50)  NOT NULL DEFAULT 'User',
    activo        BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- 6. TABLA HISTORIAL_COMPRAS (factura virtual — vista del dashboard)
-- Es una vista sobre pedidos para AppSheet
-- ============================================================
CREATE OR REPLACE VIEW public.historial_compras AS
SELECT
    p.id,
    'FAC-' || p.id::TEXT                                AS fac,
    p.fecha::DATE                                        AS fecha,
    p.fecha::TIME                                        AS hora,
    p.nombre || ' ' || p.apellido                        AS senor_a,
    p.email,
    p.telefono,
    p.ciudad,
    p.direccion || CASE WHEN p.barrio <> '' THEN ' · ' || p.barrio ELSE '' END AS direccion_completa,
    p.tipo_id                                            AS tipo_identificacion,
    p.numero_id                                          AS numero_identificacion,
    p.items_json                                         AS descripcion_productos,
    1                                                    AS cantidad,
    p.total                                              AS v_unitario,
    p.total                                              AS valor_total,
    p.metodo_envio,
    p.metodo_pago,
    p.estado
FROM public.pedidos p
ORDER BY p.fecha DESC;

-- ============================================================
-- DATOS DE EJEMPLO para AppSheet
-- ============================================================

-- Producto de ejemplo
INSERT INTO public.lista_productos (ref, nombre, descripcion, categoria, marca, cantidad, v_unitario, imei_serial)
VALUES
('IPH17-256', 'iPhone 17 256GB', 'iPhone 17 Sim Física 1 año garantía Apple', 'iPhone', 'Apple', 5, 3550000, ''),
('SS26U-256', 'Samsung S26 Ultra 256GB', 'Samsung Galaxy S26 Ultra, IA integrada, 200MP', 'Samsung', 'Samsung', 3, 5200000, ''),
('MBP14-M5', 'MacBook Pro 14" M5', 'MacBook Pro chip M5, 16GB RAM, 512GB SSD', 'Mac', 'Apple', 2, 9399000, '')
ON CONFLICT DO NOTHING;

-- Usuario admin de ejemplo
INSERT INTO public.usuarios (name, email, role)
VALUES ('Jhonatan Hernandez', 'jhonatanhtech@gmail.com', 'Admin')
ON CONFLICT (email) DO UPDATE SET role = 'Admin';

-- ============================================================
-- HABILITAR ROW LEVEL SECURITY (RLS) — recomendado en Supabase
-- ============================================================
ALTER TABLE public.pedidos        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagos          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lista_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relacion_ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios        ENABLE ROW LEVEL SECURITY;

-- Política: acceso total para roles autenticados (ajustar según necesidad)
CREATE POLICY "Admin full access pedidos"
    ON public.pedidos FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access pagos"
    ON public.pagos FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access productos"
    ON public.lista_productos FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access ventas"
    ON public.relacion_ventas FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access usuarios"
    ON public.usuarios FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
