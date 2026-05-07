-- ============================================================
-- 004_jhon_estadisticas.sql — Tabla de estadísticas diarias
-- Ejecutar en: PostgreSQL Hetzner LOCAL Y en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS estadisticas_jhon (
  id                              SERIAL PRIMARY KEY,
  fecha                           DATE NOT NULL UNIQUE,
  total_conversaciones            INTEGER DEFAULT 0,
  respuestas_desde_cache          INTEGER DEFAULT 0,
  respuestas_desde_groq           INTEGER DEFAULT 0,
  respuestas_desde_entrenamiento  INTEGER DEFAULT 0,
  hora_pico                       INTEGER,
  producto_mas_consultado         VARCHAR(200),
  tasa_satisfaccion               DECIMAL(5,2),
  total_escalaciones_wa           INTEGER DEFAULT 0,
  creado_en                       TIMESTAMP DEFAULT NOW()
);

-- Trigger que actualiza estadísticas cada vez que se inserta una conversación
CREATE OR REPLACE FUNCTION actualizar_estadisticas_diarias()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.pregunta IS NOT NULL AND NEW.respuesta IS NOT NULL THEN
    INSERT INTO estadisticas_jhon (fecha, total_conversaciones)
    VALUES (CURRENT_DATE, 1)
    ON CONFLICT (fecha) DO UPDATE SET
      total_conversaciones =
        estadisticas_jhon.total_conversaciones + 1,
      respuestas_desde_cache =
        estadisticas_jhon.respuestas_desde_cache +
        CASE WHEN NEW.nivel_respuesta = 'cache_trgm' THEN 1 ELSE 0 END,
      respuestas_desde_groq =
        estadisticas_jhon.respuestas_desde_groq +
        CASE WHEN NEW.nivel_respuesta = 'groq_api' THEN 1 ELSE 0 END,
      respuestas_desde_entrenamiento =
        estadisticas_jhon.respuestas_desde_entrenamiento +
        CASE WHEN NEW.nivel_respuesta = 'entrenamiento' THEN 1 ELSE 0 END;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_estadisticas_jhon ON conversaciones;
CREATE TRIGGER trg_estadisticas_jhon
AFTER INSERT ON conversaciones
FOR EACH ROW EXECUTE FUNCTION actualizar_estadisticas_diarias();

-- Verificar
SELECT * FROM estadisticas_jhon;
