-- ============================================================
-- FACTURACIÓN ELECTRÓNICA OUTILTECH — Tablas + Secuencia + Triggers
-- Módulo POS para cajera y vendedora
-- ============================================================

-- ─── SECUENCIA PARA NÚMERO DE FACTURA ────────────────────
CREATE SEQUENCE IF NOT EXISTS seq_factura_numero START 1;

-- ─── FUNCIÓN: Genera número FE-YYYY-NNNN ─────────────────
CREATE OR REPLACE FUNCTION fn_generar_numero_factura()
RETURNS VARCHAR AS $$
DECLARE
    num INTEGER;
BEGIN
    num := nextval('seq_factura_numero');
    RETURN 'FE-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || LPAD(num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ─── TABLA PRINCIPAL DE FACTURAS ─────────────────────────
CREATE TABLE IF NOT EXISTS facturas (
    id                  SERIAL PRIMARY KEY,
    numero_factura      VARCHAR(30)    UNIQUE NOT NULL,
    fecha               TIMESTAMP      NOT NULL DEFAULT NOW(),
    cajera              VARCHAR(100)   NOT NULL DEFAULT 'Cajera',
    cliente_nombre      VARCHAR(200),
    cliente_id          VARCHAR(50),
    cliente_email       VARCHAR(200),
    cliente_telefono    VARCHAR(50),
    subtotal            NUMERIC(14,2)  NOT NULL DEFAULT 0,
    descuento           NUMERIC(14,2)  NOT NULL DEFAULT 0,
    total               NUMERIC(14,2)  NOT NULL DEFAULT 0,
    metodo_pago         VARCHAR(50),
    estado              VARCHAR(30)    NOT NULL DEFAULT 'emitida'
                        CHECK (estado IN ('borrador','emitida','pagada','anulada')),
    notas               TEXT,
    wompi_referencia    VARCHAR(100),
    created_at          TIMESTAMP      NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP      NOT NULL DEFAULT NOW()
);

-- ─── TABLA DE ITEMS DE FACTURA ────────────────────────────
CREATE TABLE IF NOT EXISTS factura_items (
    id              SERIAL PRIMARY KEY,
    factura_id      INTEGER        NOT NULL REFERENCES facturas(id) ON DELETE CASCADE,
    codigo_producto VARCHAR(20)    NOT NULL,
    descripcion     VARCHAR(255)   NOT NULL,
    cantidad        INTEGER        NOT NULL CHECK (cantidad > 0),
    precio_unitario NUMERIC(12,2)  NOT NULL DEFAULT 0,
    descuento_item  NUMERIC(12,2)  NOT NULL DEFAULT 0,
    subtotal        NUMERIC(14,2)  NOT NULL DEFAULT 0,
    fuente          VARCHAR(20)    NOT NULL DEFAULT 'stock'
                    CHECK (fuente IN ('stock','catalogo','manual'))
);

-- ─── ÍNDICES ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_facturas_fecha   ON facturas(fecha);
CREATE INDEX IF NOT EXISTS idx_facturas_estado  ON facturas(estado);
CREATE INDEX IF NOT EXISTS idx_facturas_cajera  ON facturas(cajera);
CREATE INDEX IF NOT EXISTS idx_fitems_factura   ON factura_items(factura_id);
CREATE INDEX IF NOT EXISTS idx_fitems_codigo    ON factura_items(codigo_producto);

-- ─── TRIGGER: updated_at automático en facturas ──────────
CREATE OR REPLACE FUNCTION fn_factura_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_factura_updated_at ON facturas;
CREATE TRIGGER trg_factura_updated_at
    BEFORE UPDATE ON facturas
    FOR EACH ROW EXECUTE FUNCTION fn_factura_updated_at();

-- ─── TRIGGER: Al pagar → descuenta stock automáticamente ─
-- Cuando estado cambia a 'pagada', inserta en inventario_salidas
-- por cada item que tenga codigo en inventario_stock.
-- El trigger existente trg_salida_stock actualiza inventario_stock.
CREATE OR REPLACE FUNCTION fn_factura_pagar_descuenta_stock()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF NEW.estado = 'pagada' AND OLD.estado <> 'pagada' THEN
        INSERT INTO inventario_salidas (
            nro_documento,
            fecha,
            codigo_producto,
            descripcion,
            cantidad,
            precio_venta,
            utilidad
        )
        SELECT
            NEW.id,
            CURRENT_DATE,
            fi.codigo_producto,
            fi.descripcion,
            fi.cantidad,
            fi.precio_unitario,
            fi.precio_unitario - COALESCE(s.costo_unitario, 0)
        FROM factura_items fi
        INNER JOIN inventario_stock s ON s.codigo_producto = fi.codigo_producto
        WHERE fi.factura_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_factura_pagar_stock ON facturas;
CREATE TRIGGER trg_factura_pagar_stock
    AFTER UPDATE ON facturas
    FOR EACH ROW EXECUTE FUNCTION fn_factura_pagar_descuenta_stock();

-- ─── VISTA: Resumen de facturas del día ──────────────────
CREATE OR REPLACE VIEW v_facturas_hoy AS
SELECT
    DATE(f.fecha)                AS dia,
    COUNT(*)                     AS total_facturas,
    COUNT(*) FILTER (WHERE f.estado = 'pagada')  AS pagadas,
    COUNT(*) FILTER (WHERE f.estado = 'anulada') AS anuladas,
    SUM(f.total) FILTER (WHERE f.estado = 'pagada') AS ingresos_dia,
    AVG(f.total) FILTER (WHERE f.estado = 'pagada') AS ticket_promedio
FROM facturas f
WHERE DATE(f.fecha) = CURRENT_DATE
GROUP BY DATE(f.fecha);

-- ─── VISTA: Reporte de ventas por cajera ─────────────────
CREATE OR REPLACE VIEW v_ventas_cajera AS
SELECT
    cajera,
    DATE(fecha)                  AS dia,
    COUNT(*) FILTER (WHERE estado = 'pagada') AS facturas_pagadas,
    SUM(total) FILTER (WHERE estado = 'pagada') AS total_vendido
FROM facturas
GROUP BY cajera, DATE(fecha)
ORDER BY dia DESC, total_vendido DESC;
