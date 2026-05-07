-- ============================================================
-- 008_jhon_productos_relacionados.sql
-- Ejecutar en: PostgreSQL Hetzner LOCAL Y en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS productos_relacionados (
  id                         SERIAL PRIMARY KEY,
  producto_a                 VARCHAR(200),
  producto_b                 VARCHAR(200),
  veces_consultados_juntos   INTEGER DEFAULT 1,
  actualizado_en             TIMESTAMP DEFAULT NOW(),
  UNIQUE(producto_a, producto_b)
);

-- Verificar
SELECT * FROM productos_relacionados LIMIT 1;
