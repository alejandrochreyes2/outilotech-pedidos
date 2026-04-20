-- =============================================================
-- MIGRATION 001 — Auto-fix sequence on explicit-ID inserts
-- =============================================================
-- PROBLEMA: Cuando se inserta en Supabase con un id explícito
-- (ej: registros de prueba o migraciones manuales), la secuencia
-- interna no avanza. El próximo INSERT sin id falla con
-- "duplicate key value violates unique constraint".
--
-- SOLUCIÓN: Este trigger ajusta la secuencia automáticamente
-- antes de cada INSERT, asegurando que siempre esté >= id nuevo.
--
-- EJECUTAR UNA SOLA VEZ en: Supabase → SQL Editor
-- Es idempotente (CREATE OR REPLACE), se puede re-ejecutar sin riesgo.
-- =============================================================

CREATE OR REPLACE FUNCTION fix_pedidos_id_sequence()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM setval(
    pg_get_serial_sequence('pedidos', 'id'),
    GREATEST(
      COALESCE(currval(pg_get_serial_sequence('pedidos', 'id')), 1),
      NEW.id
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_fix_pedidos_sequence ON pedidos;

CREATE TRIGGER trg_fix_pedidos_sequence
BEFORE INSERT ON pedidos
FOR EACH ROW
WHEN (NEW.id IS NOT NULL)
EXECUTE FUNCTION fix_pedidos_id_sequence();

-- Verificación: muestra el valor actual de la secuencia
SELECT last_value FROM pedidos_id_seq;
