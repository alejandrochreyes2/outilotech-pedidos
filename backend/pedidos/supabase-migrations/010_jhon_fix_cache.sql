-- ============================================================
-- PARCHE 010: Fix caché trigram — umbral COUNT(*) >= 1
-- Ejecutar en: PostgreSQL Hetzner (local) Y Supabase SQL Editor
-- ============================================================

-- Reemplaza buscar_respuesta_similar:
-- 1. HAVING COUNT(*) >= 1  (antes era >= 2)
-- 2. Normalización de texto (ignora tildes en la búsqueda)
-- 3. Ventana ampliada a 60 días (antes 30)

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
DECLARE
  pregunta_normalizada TEXT;
BEGIN
  pregunta_normalizada := LOWER(
    TRANSLATE(pregunta_input,
      'áéíóúÁÉÍÓÚàèìòùäëïöüñÑ',
      'aeiouAEIOUaeiouaeiounn')
  );

  RETURN QUERY
  SELECT
    c.pregunta,
    c.respuesta,
    GREATEST(
      similarity(c.pregunta, pregunta_input),
      similarity(c.pregunta, pregunta_normalizada)
    )::FLOAT                         AS sim,
    COUNT(*)::INTEGER                AS veces_validada,
    EXTRACT(DAY FROM NOW() - MIN(c.creado_en))::INTEGER AS dias_antiguedad
  FROM conversaciones c
  WHERE
    c.respuesta     IS NOT NULL
    AND c.respuesta != ''
    AND c.desde_cache = FALSE
    AND (
      similarity(c.pregunta, pregunta_input)      > umbral_similitud
      OR
      similarity(c.pregunta, pregunta_normalizada) > umbral_similitud
    )
    AND c.creado_en > NOW() - INTERVAL '60 days'
  GROUP BY c.pregunta, c.respuesta
  HAVING COUNT(*) >= 1
  ORDER BY sim DESC, veces_validada DESC
  LIMIT 1;
END;
$$;

-- Índice trigram sobre pregunta normalizada (sin tildes)
CREATE INDEX IF NOT EXISTS idx_conversaciones_trgm_norm
ON conversaciones
USING gin(
  LOWER(TRANSLATE(pregunta,
    'áéíóúÁÉÍÓÚàèìòùäëïöüñÑ',
    'aeiouAEIOUaeiouaeiounn'))
  gin_trgm_ops
);

-- Verificar:
-- SELECT * FROM buscar_respuesta_similar('iphone barato', 0.55);
-- SELECT * FROM buscar_respuesta_similar('cual es el movil mas economico', 0.50);
