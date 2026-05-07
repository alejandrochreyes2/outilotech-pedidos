-- ============================================================
-- 006_jhon_conocimiento.sql — Base de conocimiento entrenada
-- Ejecutar en: PostgreSQL Hetzner LOCAL Y en Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE IF NOT EXISTS conocimiento_jhon (
  id                SERIAL PRIMARY KEY,
  pregunta_clave    TEXT NOT NULL,
  respuesta_oficial TEXT NOT NULL,
  categoria         VARCHAR(50),
  veces_usada       INTEGER DEFAULT 0,
  activo            BOOLEAN DEFAULT TRUE,
  creado_por        VARCHAR(100) DEFAULT 'admin',
  creado_en         TIMESTAMP DEFAULT NOW(),
  actualizado_en    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conocimiento_trgm
ON conocimiento_jhon
USING gin(pregunta_clave gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_conocimiento_activo
ON conocimiento_jhon(activo) WHERE activo = TRUE;

-- Función para buscar en conocimiento entrenado por admin
CREATE OR REPLACE FUNCTION buscar_en_conocimiento_jhon(
  pregunta_input    TEXT,
  umbral_similitud  FLOAT DEFAULT 0.70
)
RETURNS TABLE (
  respuesta_oficial  TEXT,
  categoria          TEXT,
  similitud          FLOAT
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  SELECT
    k.respuesta_oficial,
    k.categoria::TEXT,
    similarity(k.pregunta_clave, pregunta_input)::FLOAT AS sim
  FROM conocimiento_jhon k
  WHERE
    k.activo = TRUE
    AND similarity(k.pregunta_clave, pregunta_input) > umbral_similitud
  ORDER BY sim DESC
  LIMIT 1;
END;
$$;

-- Poblar conocimiento base de Outiltech
INSERT INTO conocimiento_jhon (pregunta_clave, respuesta_oficial, categoria) VALUES
('horario de atención', 'Nuestro horario es Lunes a Viernes 8am-5pm, Sábados 9am-1pm. También puedes escribirnos en cualquier momento por WhatsApp +57 3133082905.', 'EMPRESA'),
('cómo contactarlos', 'Puedes contactarnos por correo: contactanos@outiltech.co, por WhatsApp: +57 3133082905, o visitando outiltech.co.', 'EMPRESA'),
('qué servicios ofrecen', 'Ofrecemos: Tienda E-Commerce de tecnología, Software a la Medida con IA, consultoría ISO 27001, Forense Digital, PWA, DevOps y creación de chatbots IA.', 'EMPRESA'),
('precio software a la medida', 'El software a la medida comienza desde $30.000 COP por hora. La primera reunión de consultoría es completamente GRATIS y sin compromiso.', 'PRECIOS'),
('garantía de los productos', 'Todos nuestros productos tienen garantía oficial de 1 año con el fabricante. Apple y Samsung tienen soporte directo con sus centros de servicio autorizados.', 'GARANTIAS'),
('hacen envíos', 'Sí, hacemos envíos a todo Colombia en 1-3 días hábiles. También puedes recoger tu pedido en nuestra tienda. Los envíos tienen costo adicional según la ciudad.', 'ENVIOS'),
('qué es outiltech', 'Outiltech es una empresa colombiana con 8+ años de experiencia en tecnología, ventas de dispositivos Apple/Samsung y desarrollo de software a la medida con inteligencia artificial.', 'EMPRESA'),
('primera reunión gratis', 'Sí, la primera reunión de consultoría de software es completamente gratuita y sin compromiso. Escríbenos a contactanos@outiltech.co para agendar.', 'PRECIOS'),
('métodos de pago', 'Aceptamos: tarjeta de crédito/débito (Wompi), PSE, Nequi/Daviplata, efectivo (Efecty/Baloto) y financiación en cuotas con Addi.', 'EMPRESA'),
('tienen apple', 'Sí, somos tienda de productos Apple en Colombia. Tenemos iPhone, MacBook, iPad, Apple Watch, AirPods y accesorios. Visita outiltech.co para ver todo el catálogo.', 'PRODUCTOS'),
('iso 27001', 'Ofrecemos consultoría para implementar la norma ISO 27001 de Seguridad de la Información. Apoyamos a tu empresa a obtener la certificación. Contáctanos para una evaluación gratuita.', 'SOFTWARE'),
('forense digital', 'Nuestro servicio de Forense Digital incluye análisis de evidencia digital, investigación de incidentes de seguridad y peritaje informático. Contáctanos para más información.', 'SOFTWARE')
ON CONFLICT DO NOTHING;

-- Verificar
SELECT * FROM buscar_en_conocimiento_jhon('horario atención', 0.70);
SELECT COUNT(*) FROM conocimiento_jhon WHERE activo = TRUE;
