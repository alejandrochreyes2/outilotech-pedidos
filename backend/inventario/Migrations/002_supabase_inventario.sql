-- ============================================================
-- INVENTARIO OUTILTECH — Supabase + AppSheet
-- Pegar en: Supabase Dashboard → SQL Editor → New Query → Run
-- ============================================================

-- ─── TABLAS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.inventario_stock (
    id                           SERIAL PRIMARY KEY,
    codigo_producto              VARCHAR(20)    UNIQUE NOT NULL,
    descripcion                  VARCHAR(255)   NOT NULL,
    lote                         VARCHAR(50),
    entradas                     INTEGER        NOT NULL DEFAULT 0,
    salidas                      INTEGER        NOT NULL DEFAULT 0,
    stock_actual                 INTEGER        NOT NULL DEFAULT 0,
    costo_unitario               NUMERIC(12,2)  NOT NULL DEFAULT 0,
    precio_venta                 NUMERIC(12,2)  NOT NULL DEFAULT 0,
    importe_inventario_proveedor NUMERIC(14,2)  NOT NULL DEFAULT 0,
    venta                        NUMERIC(14,2)  NOT NULL DEFAULT 0,
    created_at                   TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at                   TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventario_entradas (
    id               SERIAL PRIMARY KEY,
    nro_documento    INTEGER       NOT NULL,
    fecha            DATE          NOT NULL DEFAULT CURRENT_DATE,
    codigo_producto  VARCHAR(20)   NOT NULL REFERENCES public.inventario_stock(codigo_producto) ON UPDATE CASCADE,
    descripcion      VARCHAR(255),
    lote             VARCHAR(50),
    cantidad         INTEGER       NOT NULL CHECK (cantidad > 0),
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.inventario_salidas (
    id               SERIAL PRIMARY KEY,
    nro_documento    INTEGER       NOT NULL,
    fecha            DATE          NOT NULL DEFAULT CURRENT_DATE,
    codigo_producto  VARCHAR(20)   NOT NULL REFERENCES public.inventario_stock(codigo_producto) ON UPDATE CASCADE,
    descripcion      VARCHAR(255),
    lote             VARCHAR(50),
    cantidad         INTEGER       NOT NULL CHECK (cantidad > 0),
    precio_venta     NUMERIC(12,2) NOT NULL DEFAULT 0,
    utilidad         NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─── ÍNDICES ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_inv_entradas_codigo ON public.inventario_entradas(codigo_producto);
CREATE INDEX IF NOT EXISTS idx_inv_entradas_fecha  ON public.inventario_entradas(fecha);
CREATE INDEX IF NOT EXISTS idx_inv_salidas_codigo  ON public.inventario_salidas(codigo_producto);
CREATE INDEX IF NOT EXISTS idx_inv_salidas_fecha   ON public.inventario_salidas(fecha);

-- ─── TRIGGER updated_at ──────────────────────────────────
CREATE OR REPLACE FUNCTION public.fn_inv_stock_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;
DROP TRIGGER IF EXISTS trg_stock_updated_at ON public.inventario_stock;
CREATE TRIGGER trg_stock_updated_at
    BEFORE UPDATE ON public.inventario_stock
    FOR EACH ROW EXECUTE FUNCTION public.fn_inv_stock_updated_at();

-- ─── TRIGGER ENTRADA → suma stock ────────────────────────
CREATE OR REPLACE FUNCTION public.fn_inv_entrada_stock()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE public.inventario_stock
    SET entradas     = entradas + NEW.cantidad,
        stock_actual = stock_actual + NEW.cantidad,
        importe_inventario_proveedor = (stock_actual + NEW.cantidad) * costo_unitario,
        updated_at   = NOW()
    WHERE codigo_producto = NEW.codigo_producto;
    RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_entrada_stock ON public.inventario_entradas;
CREATE TRIGGER trg_entrada_stock
    AFTER INSERT ON public.inventario_entradas
    FOR EACH ROW EXECUTE FUNCTION public.fn_inv_entrada_stock();

-- ─── TRIGGER SALIDA → valida stock ───────────────────────
CREATE OR REPLACE FUNCTION public.fn_inv_salida_valida()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE v_stock INTEGER; v_desc VARCHAR;
BEGIN
    SELECT stock_actual, descripcion INTO v_stock, v_desc
    FROM public.inventario_stock WHERE codigo_producto = NEW.codigo_producto;
    IF v_stock IS NULL THEN
        RAISE EXCEPTION 'Producto % no existe', NEW.codigo_producto;
    END IF;
    IF v_stock < NEW.cantidad THEN
        RAISE EXCEPTION 'Stock insuficiente para "%": disponible=%, solicitado=%',
            v_desc, v_stock, NEW.cantidad USING ERRCODE = 'P0001';
    END IF;
    RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_salida_valida ON public.inventario_salidas;
CREATE TRIGGER trg_salida_valida
    BEFORE INSERT ON public.inventario_salidas
    FOR EACH ROW EXECUTE FUNCTION public.fn_inv_salida_valida();

-- ─── TRIGGER SALIDA → descuenta stock ────────────────────
CREATE OR REPLACE FUNCTION public.fn_inv_salida_stock()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE public.inventario_stock
    SET salidas      = salidas + NEW.cantidad,
        stock_actual = stock_actual - NEW.cantidad,
        precio_venta = CASE WHEN NEW.precio_venta > 0 THEN NEW.precio_venta ELSE precio_venta END,
        venta        = venta + (NEW.precio_venta * NEW.cantidad),
        importe_inventario_proveedor = (stock_actual - NEW.cantidad) * costo_unitario,
        updated_at   = NOW()
    WHERE codigo_producto = NEW.codigo_producto;
    RETURN NEW;
END; $$;
DROP TRIGGER IF EXISTS trg_salida_stock ON public.inventario_salidas;
CREATE TRIGGER trg_salida_stock
    AFTER INSERT ON public.inventario_salidas
    FOR EACH ROW EXECUTE FUNCTION public.fn_inv_salida_stock();

-- ─── VISTAS ──────────────────────────────────────────────
CREATE OR REPLACE VIEW public.v_stock_bajo AS
SELECT codigo_producto, descripcion, lote, stock_actual, costo_unitario, precio_venta
FROM public.inventario_stock WHERE stock_actual < 3
ORDER BY stock_actual ASC;

CREATE OR REPLACE VIEW public.v_valor_inventario AS
SELECT COUNT(*) AS total_productos,
       SUM(stock_actual) AS unidades_totales,
       SUM(importe_inventario_proveedor) AS valor_costo_total,
       SUM(venta) AS valor_ventas_total
FROM public.inventario_stock;

-- ─── ROW LEVEL SECURITY (RLS) para AppSheet ──────────────
-- AppSheet usa la anon key o service_role key de Supabase

ALTER TABLE public.inventario_stock   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_entradas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventario_salidas  ENABLE ROW LEVEL SECURITY;

-- Política: acceso total (lectura + escritura) para usuarios autenticados y anon
-- Cambiar 'anon' por 'authenticated' si AppSheet usa auth
CREATE POLICY "inventario_stock_all"    ON public.inventario_stock    FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "inventario_entradas_all" ON public.inventario_entradas FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "inventario_salidas_all"  ON public.inventario_salidas  FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- ─── REPLICACIÓN REALTIME (para Angular live updates) ────
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'inventario_stock'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.inventario_stock;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'inventario_entradas'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.inventario_entradas;
    END IF;
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime' AND tablename = 'inventario_salidas'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.inventario_salidas;
    END IF;
END $$;
