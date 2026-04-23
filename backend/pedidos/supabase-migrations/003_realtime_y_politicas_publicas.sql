-- ================================================================
-- OUTILTECH — Script maestro Supabase (ejecutar UNA SOLA VEZ)
-- Habilita Realtime + lectura pública anónima en TODAS las tablas
-- Después de esto: cualquier cambio en AppSheet se ve en el frontend
-- automáticamente sin necesidad de configurar nada más por tabla.
-- ================================================================

-- ── PASO 1: Realtime para todas las tablas existentes ────────────
-- Agrega cada tabla del esquema 'public' a la publicación de Realtime.
-- Si una tabla ya estaba incluida, el EXCEPTION la ignora sin romper.
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT tablename
    FROM   pg_tables
    WHERE  schemaname = 'public'
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %I', r.tablename);
      RAISE NOTICE 'Realtime habilitado: %', r.tablename;
    EXCEPTION WHEN others THEN
      RAISE NOTICE 'Ya en Realtime (ok): %', r.tablename;
    END;
  END LOOP;
END $$;


-- ── PASO 2: RLS + política SELECT pública en todas las tablas ────
-- Habilita Row Level Security y crea una política que permite
-- leer (SELECT) a cualquier usuario anónimo.
-- Usa DROP IF EXISTS para ser idempotente (se puede re-ejecutar sin error).
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT tablename
    FROM   pg_tables
    WHERE  schemaname = 'public'
  LOOP
    -- Habilitar RLS en la tabla
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', r.tablename);

    -- Eliminar política anterior si existe (idempotente)
    EXECUTE format(
      'DROP POLICY IF EXISTS "outiltech_public_read_%s" ON %I',
      r.tablename, r.tablename
    );

    -- Crear política de lectura pública
    EXECUTE format(
      'CREATE POLICY "outiltech_public_read_%s" ON %I FOR SELECT USING (true)',
      r.tablename, r.tablename
    );

    RAISE NOTICE 'Política SELECT pública creada: %', r.tablename;
  END LOOP;
END $$;


-- ── PASO 3: Función automática para tablas NUEVAS ────────────────
-- Esta función se ejecuta automáticamente cada vez que creas
-- una tabla nueva en Supabase. Configura Realtime y RLS al instante.
CREATE OR REPLACE FUNCTION outiltech_auto_setup_tabla()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  obj RECORD;
  nombre_tabla TEXT;
BEGIN
  FOR obj IN
    SELECT object_identity
    FROM   pg_event_trigger_ddl_commands()
    WHERE  command_tag = 'CREATE TABLE'
      AND  object_type = 'table'
  LOOP
    nombre_tabla := obj.object_identity;

    -- Agregar a Realtime
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE %s', nombre_tabla);
    EXCEPTION WHEN others THEN NULL; END;

    -- Habilitar RLS
    EXECUTE format('ALTER TABLE %s ENABLE ROW LEVEL SECURITY', nombre_tabla);

    -- Política SELECT pública
    EXECUTE format(
      'CREATE POLICY "outiltech_public_read" ON %s FOR SELECT USING (true)',
      nombre_tabla
    );

    RAISE NOTICE '[auto_setup] Tabla configurada automáticamente: %', nombre_tabla;
  END LOOP;
END;
$$;

-- Eliminar trigger si ya existía (idempotente)
DROP EVENT TRIGGER IF EXISTS outiltech_auto_nueva_tabla;

-- Crear el trigger de evento para futuras tablas
CREATE EVENT TRIGGER outiltech_auto_nueva_tabla
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE')
  EXECUTE FUNCTION outiltech_auto_setup_tabla();


-- ── VERIFICACIÓN ─────────────────────────────────────────────────
-- Ejecuta esto al final para confirmar que todo quedó bien:
SELECT
  t.tablename                                          AS tabla,
  EXISTS (
    SELECT 1 FROM pg_publication_tables pt
    WHERE  pt.tablename = t.tablename
      AND  pt.pubname   = 'supabase_realtime'
  )                                                    AS realtime_activo,
  (SELECT COUNT(*) FROM pg_policies p
   WHERE  p.tablename = t.tablename
     AND  p.cmd = 'SELECT')                           AS politicas_select
FROM pg_tables t
WHERE t.schemaname = 'public'
ORDER BY t.tablename;
