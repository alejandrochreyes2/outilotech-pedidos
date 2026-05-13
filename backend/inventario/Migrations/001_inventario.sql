-- ============================================================
-- INVENTARIO OUTILTECH - PostgreSQL Schema + Triggers
-- Basado en: ControlInventario 2026.xlsx
--   Stock: 419 productos | Entradas: compras | Salidas: ventas
-- ============================================================

-- ─── TABLA MAESTRA DE PRODUCTOS ───────────────────────────
CREATE TABLE IF NOT EXISTS inventario_stock (
    id                          SERIAL PRIMARY KEY,
    codigo_producto             VARCHAR(20)    UNIQUE NOT NULL,
    descripcion                 VARCHAR(255)   NOT NULL,
    lote                        VARCHAR(50),
    entradas                    INTEGER        NOT NULL DEFAULT 0,
    salidas                     INTEGER        NOT NULL DEFAULT 0,
    stock_actual                INTEGER        NOT NULL DEFAULT 0,
    costo_unitario              NUMERIC(12,2)  NOT NULL DEFAULT 0,
    precio_venta                NUMERIC(12,2)  NOT NULL DEFAULT 0,
    importe_inventario_proveedor NUMERIC(14,2) NOT NULL DEFAULT 0,
    venta                       NUMERIC(14,2)  NOT NULL DEFAULT 0,
    created_at                  TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at                  TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ─── COMPRAS / RECEPCIONES ────────────────────────────────
CREATE TABLE IF NOT EXISTS inventario_entradas (
    id               SERIAL PRIMARY KEY,
    nro_documento    INTEGER       NOT NULL,
    fecha            DATE          NOT NULL DEFAULT CURRENT_DATE,
    codigo_producto  VARCHAR(20)   NOT NULL REFERENCES inventario_stock(codigo_producto) ON UPDATE CASCADE,
    descripcion      VARCHAR(255),
    lote             VARCHAR(50),
    cantidad         INTEGER       NOT NULL CHECK (cantidad > 0),
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─── VENTAS / DESPACHOS ───────────────────────────────────
CREATE TABLE IF NOT EXISTS inventario_salidas (
    id               SERIAL PRIMARY KEY,
    nro_documento    INTEGER       NOT NULL,
    fecha            DATE          NOT NULL DEFAULT CURRENT_DATE,
    codigo_producto  VARCHAR(20)   NOT NULL REFERENCES inventario_stock(codigo_producto) ON UPDATE CASCADE,
    descripcion      VARCHAR(255),
    lote             VARCHAR(50),
    cantidad         INTEGER       NOT NULL CHECK (cantidad > 0),
    precio_venta     NUMERIC(12,2) NOT NULL DEFAULT 0,
    utilidad         NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ─── ÍNDICES DE RENDIMIENTO ───────────────────────────────
CREATE INDEX IF NOT EXISTS idx_entradas_codigo  ON inventario_entradas(codigo_producto);
CREATE INDEX IF NOT EXISTS idx_entradas_fecha   ON inventario_entradas(fecha);
CREATE INDEX IF NOT EXISTS idx_salidas_codigo   ON inventario_salidas(codigo_producto);
CREATE INDEX IF NOT EXISTS idx_salidas_fecha    ON inventario_salidas(fecha);
CREATE INDEX IF NOT EXISTS idx_stock_descripcion ON inventario_stock(descripcion);

-- ─── TRIGGER: updated_at automático en stock ─────────────
CREATE OR REPLACE FUNCTION fn_stock_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_stock_updated_at ON inventario_stock;
CREATE TRIGGER trg_stock_updated_at
    BEFORE UPDATE ON inventario_stock
    FOR EACH ROW EXECUTE FUNCTION fn_stock_updated_at();

-- ─── TRIGGER: ENTRADA → suma stock ───────────────────────
CREATE OR REPLACE FUNCTION fn_entrada_actualiza_stock()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE inventario_stock
    SET entradas    = entradas + NEW.cantidad,
        stock_actual = stock_actual + NEW.cantidad,
        importe_inventario_proveedor = (stock_actual + NEW.cantidad) * costo_unitario,
        updated_at  = NOW()
    WHERE codigo_producto = NEW.codigo_producto;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_entrada_stock ON inventario_entradas;
CREATE TRIGGER trg_entrada_stock
    AFTER INSERT ON inventario_entradas
    FOR EACH ROW EXECUTE FUNCTION fn_entrada_actualiza_stock();

-- ─── TRIGGER: SALIDA → valida stock y descuenta ──────────
CREATE OR REPLACE FUNCTION fn_salida_valida_stock()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    stock_disponible INTEGER;
    desc_producto    VARCHAR(255);
BEGIN
    SELECT stock_actual, descripcion
    INTO   stock_disponible, desc_producto
    FROM   inventario_stock
    WHERE  codigo_producto = NEW.codigo_producto;

    IF stock_disponible IS NULL THEN
        RAISE EXCEPTION 'Producto % no existe en inventario', NEW.codigo_producto;
    END IF;

    IF stock_disponible < NEW.cantidad THEN
        RAISE EXCEPTION
            'Stock insuficiente para "%": disponible=%, solicitado=%',
            desc_producto, stock_disponible, NEW.cantidad
            USING ERRCODE = 'P0001';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_salida_valida ON inventario_salidas;
CREATE TRIGGER trg_salida_valida
    BEFORE INSERT ON inventario_salidas
    FOR EACH ROW EXECUTE FUNCTION fn_salida_valida_stock();

-- ─── TRIGGER: SALIDA → actualiza stock después ───────────
CREATE OR REPLACE FUNCTION fn_salida_actualiza_stock()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    UPDATE inventario_stock
    SET salidas      = salidas + NEW.cantidad,
        stock_actual = stock_actual - NEW.cantidad,
        precio_venta = CASE WHEN NEW.precio_venta > 0 THEN NEW.precio_venta ELSE precio_venta END,
        venta        = venta + (NEW.precio_venta * NEW.cantidad),
        importe_inventario_proveedor = (stock_actual - NEW.cantidad) * costo_unitario,
        updated_at   = NOW()
    WHERE codigo_producto = NEW.codigo_producto;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_salida_stock ON inventario_salidas;
CREATE TRIGGER trg_salida_stock
    AFTER INSERT ON inventario_salidas
    FOR EACH ROW EXECUTE FUNCTION fn_salida_actualiza_stock();

-- ─── VISTA: resumen de stock bajo (stock_actual < 3) ─────
CREATE OR REPLACE VIEW v_stock_bajo AS
SELECT codigo_producto, descripcion, lote, stock_actual, costo_unitario, precio_venta
FROM   inventario_stock
WHERE  stock_actual < 3
ORDER  BY stock_actual ASC, descripcion ASC;

-- ─── VISTA: valor total del inventario ───────────────────
CREATE OR REPLACE VIEW v_valor_inventario AS
SELECT
    COUNT(*)                           AS total_productos,
    SUM(stock_actual)                  AS unidades_totales,
    SUM(importe_inventario_proveedor)  AS valor_costo_total,
    SUM(venta)                         AS valor_ventas_total
FROM inventario_stock;
