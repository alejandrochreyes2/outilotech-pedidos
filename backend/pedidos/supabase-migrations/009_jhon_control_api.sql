-- ============================================================
-- 009_jhon_control_api.sql — Control de límites Groq API
-- Ejecutar en: PostgreSQL Hetzner LOCAL Y en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS control_api (
  id                 SERIAL PRIMARY KEY,
  proveedor          VARCHAR(50) DEFAULT 'groq',
  timestamp_llamada  TIMESTAMP DEFAULT NOW(),
  tokens_usados      INTEGER,
  modelo             VARCHAR(100),
  session_id         VARCHAR(100),
  duracion_ms        INTEGER
);

CREATE INDEX IF NOT EXISTS idx_control_api_timestamp
ON control_api(timestamp_llamada DESC);

-- Vista para monitoreo en tiempo real del límite Groq
CREATE OR REPLACE VIEW v_estado_groq AS
SELECT
  COUNT(*) FILTER (
    WHERE timestamp_llamada > NOW() - INTERVAL '60 seconds'
  )                          AS calls_ultimo_minuto,
  30                         AS limite_por_minuto,
  COUNT(*) FILTER (
    WHERE timestamp_llamada > NOW() - INTERVAL '24 hours'
  )                          AS calls_hoy,
  14400                      AS limite_diario,
  ROUND(
    COUNT(*) FILTER (
      WHERE timestamp_llamada > NOW() - INTERVAL '24 hours'
    ) * 100.0 / 14400, 2
  )                          AS porcentaje_usado_hoy
FROM control_api
WHERE proveedor = 'groq';

-- Verificar
SELECT * FROM v_estado_groq;
