-- ============================================================
-- 005_jhon_diagnostico.sql — Tablas de diagnóstico y gaps
-- Ejecutar en: PostgreSQL Hetzner LOCAL Y en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS conversaciones_fallidas (
  id              SERIAL PRIMARY KEY,
  session_id      VARCHAR(100),
  pregunta        TEXT,
  respuesta_jhon  TEXT,
  motivo_falla    VARCHAR(50),
  creado_en       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gaps_conocimiento (
  id              SERIAL PRIMARY KEY,
  pregunta        TEXT NOT NULL UNIQUE,
  veces_fallida   INTEGER DEFAULT 1,
  resuelta        BOOLEAN DEFAULT FALSE,
  respuesta_admin TEXT,
  creado_en       TIMESTAMP DEFAULT NOW(),
  resuelta_en     TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gaps_resuelta
ON gaps_conocimiento(resuelta, veces_fallida DESC);

-- Verificar
SELECT * FROM conversaciones_fallidas LIMIT 1;
SELECT * FROM gaps_conocimiento LIMIT 1;
