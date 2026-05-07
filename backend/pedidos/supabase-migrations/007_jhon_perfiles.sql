-- ============================================================
-- 007_jhon_perfiles.sql — Perfiles de clientes
-- Ejecutar en: PostgreSQL Hetzner LOCAL Y en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS perfiles_clientes (
  id                    SERIAL PRIMARY KEY,
  session_id            VARCHAR(100) UNIQUE NOT NULL,
  email                 VARCHAR(200),
  nombre                VARCHAR(200),
  productos_consultados TEXT[] DEFAULT '{}',
  total_visitas         INTEGER DEFAULT 1,
  satisfaccion_promedio DECIMAL(3,2) DEFAULT 0.5,
  segmento              VARCHAR(20) DEFAULT 'nuevo',
  ultima_visita         TIMESTAMP DEFAULT NOW(),
  primera_visita        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_perfiles_session
ON perfiles_clientes(session_id);

CREATE INDEX IF NOT EXISTS idx_perfiles_segmento
ON perfiles_clientes(segmento);

-- Trigger para actualizar segmento automáticamente
CREATE OR REPLACE FUNCTION actualizar_segmento_cliente()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.segmento :=
    CASE
      WHEN NEW.total_visitas = 1 THEN 'nuevo'
      WHEN NEW.satisfaccion_promedio < 0.4 THEN 'insatisfecho'
      WHEN NEW.total_visitas > 5
        AND NEW.satisfaccion_promedio > 0.8 THEN 'vip'
      ELSE 'recurrente'
    END;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_segmento_cliente ON perfiles_clientes;
CREATE TRIGGER trg_segmento_cliente
BEFORE INSERT OR UPDATE ON perfiles_clientes
FOR EACH ROW EXECUTE FUNCTION actualizar_segmento_cliente();

-- Verificar
SELECT * FROM perfiles_clientes LIMIT 1;
