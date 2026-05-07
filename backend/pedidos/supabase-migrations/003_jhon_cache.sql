-- ============================================================
-- 003_jhon_cache.sql — Cache semántico con trigram para JhonIA
-- Ejecutar en: PostgreSQL Hetzner LOCAL Y en Supabase SQL Editor
-- ============================================================

-- PASO 1: Activar extensión trigram
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- PASO 2: Columnas nuevas en tabla conversaciones existente
ALTER TABLE conversaciones
  ADD COLUMN IF NOT EXISTS pregunta        TEXT,
  ADD COLUMN IF NOT EXISTS respuesta       TEXT,
  ADD COLUMN IF NOT EXISTS desde_cache     BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS nivel_respuesta VARCHAR(20),
  ADD COLUMN IF NOT EXISTS intencion       VARCHAR(30),
  ADD COLUMN IF NOT EXISTS sentimiento     VARCHAR(10),
  ADD COLUMN IF NOT EXISTS tokens_usados   INTEGER,
  ADD COLUMN IF NOT EXISTS duracion_ms     INTEGER;

-- PASO 3: Índices optimizados para búsqueda semántica
CREATE INDEX IF NOT EXISTS idx_conversaciones_trgm
ON conversaciones
USING gin(pregunta gin_trgm_ops)
WHERE pregunta IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_conversaciones_fecha
ON conversaciones(creado_en DESC);

-- PASO 4: Función principal de búsqueda semántica
CREATE OR REPLACE FUNCTION buscar_respuesta_similar(
  pregunta_input    TEXT,
  umbral_similitud  FLOAT DEFAULT 0.65
)
RETURNS TABLE (
  pregunta_original  TEXT,
  respuesta          TEXT,
  similitud          FLOAT,
  veces_validada     INTEGER,
  dias_antiguedad    INTEGER
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.pregunta                                         AS pregunta_original,
    c.respuesta                                        AS respuesta,
    similarity(c.pregunta, pregunta_input)::FLOAT      AS similitud,
    COUNT(*)::INTEGER                                  AS veces_validada,
    EXTRACT(DAY FROM NOW() - MIN(c.creado_en))::INTEGER AS dias_antiguedad
  FROM conversaciones c
  WHERE
    c.respuesta     IS NOT NULL
    AND c.respuesta != ''
    AND c.pregunta  IS NOT NULL
    AND (c.desde_cache = FALSE OR c.desde_cache IS NULL)
    AND similarity(c.pregunta, pregunta_input) > umbral_similitud
    AND c.creado_en > NOW() - INTERVAL '30 days'
  GROUP BY c.pregunta, c.respuesta
  HAVING COUNT(*) >= 2
  ORDER BY similitud DESC, veces_validada DESC
  LIMIT 1;
END;
$$;

-- PASO 5: Función auxiliar para registrar uso del caché
CREATE OR REPLACE FUNCTION registrar_uso_cache(
  session_id_input  VARCHAR(100),
  pregunta_input    TEXT,
  respuesta_input   TEXT,
  similitud_input   FLOAT
) RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO conversaciones (
    session_id, pregunta, respuesta,
    desde_cache, nivel_respuesta, creado_en
  ) VALUES (
    session_id_input, pregunta_input, respuesta_input,
    TRUE, 'cache_trgm', NOW()
  );
END;
$$;

-- PASO 6: Verificar que la función funciona
SELECT * FROM buscar_respuesta_similar('cuánto cuesta el iPhone 15', 0.65);
