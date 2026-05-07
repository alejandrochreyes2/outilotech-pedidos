-- ============================================================
-- PRECARGA MASIVA conocimiento_jhon — 60+ preguntas frecuentes
-- Outiltech.co — Tienda Tecnología + Servicios Software Colombia
-- Ejecutar en: PostgreSQL Hetzner Y Supabase SQL Editor
-- ============================================================

-- Primero limpiar entradas de prueba anteriores de 'admin'
-- (comentar esta línea si ya tienes entradas personalizadas que quieres conservar)
DELETE FROM conocimiento_jhon WHERE creado_por = 'admin' AND veces_usada = 0;

INSERT INTO conocimiento_jhon (pregunta_clave, respuesta_oficial, categoria, creado_por) VALUES

-- ============================================================
-- CATEGORÍA: PAGOS
-- ============================================================
('qué métodos de pago aceptan',
 'Aceptamos: 💳 Tarjeta débito/crédito (Wompi), PSE, Nequi, Daviplata, Efecty, Baloto y financiación con Addi (hasta 36 cuotas sin tarjeta). Escríbenos al WhatsApp +57 3133082905 para más info.',
 'PAGOS', 'admin'),

('puedo pagar con nequi o daviplata',
 '¡Sí! Aceptamos Nequi y Daviplata. Al finalizar tu compra selecciona esa opción o escríbenos por WhatsApp +57 3133082905 para coordinar el pago directamente.',
 'PAGOS', 'admin'),

('aceptan tarjeta de crédito',
 'Sí, aceptamos tarjetas débito y crédito a través de Wompi, con cifrado SSL seguro. También puedes pagar en cuotas con Addi sin necesidad de tarjeta de crédito.',
 'PAGOS', 'admin'),

('puedo pagar en cuotas',
 'Sí, con Addi puedes financiar tu compra en hasta 36 cuotas sin tarjeta de crédito. Solo necesitas tu cédula y un celular. ¡Pre-aprobación en minutos! También manejamos cuotas con tarjeta de crédito según tu banco.',
 'PAGOS', 'admin'),

('aceptan pago contra entrega',
 'No manejamos pago contra entrega. Los métodos disponibles son: tarjeta, PSE, Nequi, Daviplata, Efecty, Baloto y Addi cuotas. Escríbenos por WhatsApp +57 3133082905.',
 'PAGOS', 'admin'),

('es seguro comprar en la tienda online',
 '¡Totalmente seguro! Usamos Wompi como pasarela de pagos, con cifrado SSL y respaldo bancario. Somos una empresa colombiana registrada, con cientos de clientes satisfechos. También somos consultores ISO 27001 en seguridad de la información.',
 'PAGOS', 'admin'),

('aceptan efectivo',
 'Puedes pagar en efectivo a través de Efecty o Baloto en cualquier punto de Colombia. Una vez confirmado el pago, procesamos tu pedido.',
 'PAGOS', 'admin'),

('puedo pagar con pse',
 'Sí, aceptamos PSE para transferencias desde cualquier banco colombiano. Selecciona PSE al finalizar la compra en nuestra tienda.',
 'PAGOS', 'admin'),

-- ============================================================
-- CATEGORÍA: ENVÍOS
-- ============================================================
('cuánto demora el envío',
 'El envío tarda entre 1 y 3 días hábiles a cualquier ciudad de Colombia. A Bogotá, Medellín y Cali generalmente llega en 1-2 días hábiles. Te enviamos el número de guía por correo para que hagas seguimiento.',
 'ENVIOS', 'admin'),

('hacen envíos a toda colombia',
 '¡Sí! Enviamos a cualquier municipio de Colombia. Trabajamos con las principales transportadoras. El tiempo de entrega es 1 a 3 días hábiles según la ciudad.',
 'ENVIOS', 'admin'),

('cuánto cuesta el envío',
 'El costo de envío varía según la ciudad y el peso del paquete. Se calcula automáticamente al ingresar tu dirección en el checkout. Escríbenos por WhatsApp +57 3133082905 para consultar el valor exacto a tu ciudad.',
 'ENVIOS', 'admin'),

('hacen envíos a medellín',
 'Sí, enviamos a Medellín. El tiempo de entrega es generalmente 1-2 días hábiles y el costo se calcula al hacer el pedido.',
 'ENVIOS', 'admin'),

('hacen envíos a cali',
 'Sí, enviamos a Cali. El tiempo de entrega es 1-2 días hábiles y el costo se calcula al hacer el pedido.',
 'ENVIOS', 'admin'),

('hacen envíos a barranquilla',
 'Sí, enviamos a Barranquilla y a toda la Costa Caribe. El tiempo de entrega es 2-3 días hábiles.',
 'ENVIOS', 'admin'),

('cómo hago seguimiento a mi pedido',
 'Una vez despachado tu pedido, te enviamos el número de guía por correo a contactanos@outiltech.co. También puedes consultarnos por WhatsApp +57 3133082905 con tu número de pedido.',
 'ENVIOS', 'admin'),

('aseguran los productos durante el envío',
 'Sí, todos nuestros envíos se realizan con embalaje protegido. En caso de daño durante el transporte, contáctanos de inmediato por WhatsApp +57 3133082905 o contactanos@outiltech.co.',
 'ENVIOS', 'admin'),

-- ============================================================
-- CATEGORÍA: GARANTÍAS
-- ============================================================
('qué garantía tienen los iphones',
 'Los iPhones nuevos tienen 1 año de garantía Apple. Los modelos Exhibición tienen 4 meses de garantía Outiltech. Los CPO (Certified Pre-Owned) tienen 6 meses. Todos los defectos de fábrica están cubiertos.',
 'GARANTIAS', 'admin'),

('qué garantía tienen los samsung',
 'Todos los Samsung tienen 1 año de garantía Samsung. Cubre defectos de fábrica. No cubre daños físicos, golpes o líquidos.',
 'GARANTIAS', 'admin'),

('qué garantía tienen los macbook',
 'Los MacBook nuevos tienen 1 año de garantía Apple. Es una de las mejores garantías del mercado con soporte técnico especializado.',
 'GARANTIAS', 'admin'),

('qué diferencia hay entre iphone nuevo cpo y exhibición',
 '• Nuevo: sellado de fábrica, 1 año garantía Apple.\n• CPO (Certified Pre-Owned): revisado y certificado, 6 meses garantía.\n• Exhibición: como nuevo pero fue usado como display, 4 meses garantía Outiltech. Es la opción más económica.',
 'GARANTIAS', 'admin'),

('la garantía cubre daños físicos',
 'No, la garantía cubre solo defectos de fábrica (problemas de software, hardware sin daño externo). Los daños físicos, golpes, líquidos o mal uso no están cubiertos por la garantía.',
 'GARANTIAS', 'admin'),

('cómo reclamo la garantía',
 'Escríbenos por WhatsApp +57 3133082905 o a contactanos@outiltech.co con tu número de pedido y descripción del problema. Evaluamos el caso y coordinamos la revisión del equipo.',
 'GARANTIAS', 'admin'),

('qué garantía tienen las patinetas segway',
 'Las patinetas eléctricas Segway tienen 6 meses de garantía de fábrica. Cubre defectos de fabricación del motor y la batería.',
 'GARANTIAS', 'admin'),

-- ============================================================
-- CATEGORÍA: DEVOLUCIONES
-- ============================================================
('cuál es la política de devolución',
 'Aceptamos devoluciones dentro de los 3 días hábiles siguientes a la entrega, siempre que el producto esté en perfectas condiciones, sin abrir o con defecto de fábrica comprobado. El envío de devolución puede tener costo adicional.',
 'DEVOLUCIONES', 'admin'),

('en cuántos días puedo devolver un producto',
 'Tienes 3 días hábiles desde la entrega para solicitar una devolución. El producto debe estar en su empaque original y sin señales de uso. Contáctanos por WhatsApp +57 3133082905 para iniciar el proceso.',
 'DEVOLUCIONES', 'admin'),

('cuánto tarda el reembolso',
 'Una vez recibido y verificado el producto devuelto, el reembolso se procesa entre 5 y 10 días hábiles según el método de pago original.',
 'DEVOLUCIONES', 'admin'),

('puedo cambiar un producto por otro',
 'Sí, puedes cambiar por otro modelo si el producto está en perfectas condiciones y dentro de los 3 días hábiles. El cambio está sujeto a disponibilidad de stock. Escríbenos al WhatsApp +57 3133082905.',
 'DEVOLUCIONES', 'admin'),

-- ============================================================
-- CATEGORÍA: PRODUCTOS — IPHONE
-- ============================================================
('qué iphones tienen disponibles',
 'Tenemos iPhones desde $850.000 COP en 3 categorías:\n• Exhibición (más económicos): iPhone 11 desde $850.000 hasta iPhone 17 Pro Max $5.100.000\n• CPO certificados: iPhone 12 CPO $1.600.000, iPhone 13 CPO $2.000.000\n• Nuevos: iPhone 13 $2.200.000, iPhone 15 $2.600.000, iPhone 16 $2.950.000, iPhone 17 $3.750.000\n\nEscríbenos por WhatsApp para asesorarte.',
 'PRODUCTOS', 'admin'),

('tienen iphone 15',
 'Sí tenemos iPhone 15 disponible. Exhibición 128GB desde $2.150.000 COP. Nuevo 128GB: $2.600.000 COP. También tenemos iPhone 15 Plus y iPhone 15 Pro Max. ¿Cuál te interesa?',
 'PRODUCTOS', 'admin'),

('tienen iphone 16',
 'Sí tenemos iPhone 16 disponible. Exhibición 128GB desde $2.550.000 COP. Nuevo 128GB: $2.950.000 COP. iPhone 16 Pro Max 256GB: $4.900.000 COP. ¿Cuál te interesa?',
 'PRODUCTOS', 'admin'),

('tienen iphone 17',
 'Sí tenemos iPhone 17. Exhibición 256GB: $3.450.000 COP. Nuevo 256GB: $3.750.000 COP. iPhone 17 Pro Max: desde $5.100.000 COP. ¡El más reciente de Apple disponible ahora!',
 'PRODUCTOS', 'admin'),

('cuál iphone me recomiendan',
 '• Si buscas el más económico: iPhone 11 Exhibición desde $850.000 COP.\n• Mejor relación precio-calidad: iPhone 13 desde $2.000.000 (CPO) o $2.200.000 (nuevo).\n• Lo último de Apple: iPhone 17 desde $3.750.000 (nuevo).\n¿Cuál es tu presupuesto? Te ayudo a elegir.',
 'PRODUCTOS', 'admin'),

-- ============================================================
-- CATEGORÍA: PRODUCTOS — SAMSUNG
-- ============================================================
('qué samsung tienen disponibles',
 'Tenemos Samsung Galaxy disponibles:\n• A07 128GB: $650.000 COP\n• A17 128GB: $850.000 COP\n• A56 256GB: $1.550.000 COP\n• Z Flip 7 FE: $3.150.000 COP\n• Z Fold 3 256GB: $3.200.000 COP\n• S26 Ultra 512GB: $5.300.000 COP\nTodos con 1 año de garantía Samsung.',
 'PRODUCTOS', 'admin'),

('cuál es el samsung más económico',
 'El Samsung más económico que tenemos es el Samsung A07 128GB a $650.000 COP con 1 año de garantía Samsung. Excelente opción de entrada. ¿Te interesa?',
 'PRODUCTOS', 'admin'),

('tienen samsung s26 ultra',
 'Sí, tenemos el Samsung S26 Ultra 512GB a $5.300.000 COP con 1 año de garantía Samsung. Es el Samsung más potente del mercado con cámara de 200MP y S Pen incluido.',
 'PRODUCTOS', 'admin'),

('tienen samsung plegable',
 'Sí, tenemos Samsung plegables. Z Flip 7 FE: $3.150.000 COP y Z Fold 3 256GB: $3.200.000 COP. Ambos con 1 año de garantía Samsung. ¿Cuál te llama más la atención?',
 'PRODUCTOS', 'admin'),

-- ============================================================
-- CATEGORÍA: PRODUCTOS — MACBOOK Y MAC
-- ============================================================
('qué macbooks tienen disponibles',
 'Tenemos MacBook disponibles:\n• MacBook Neo 256GB Azul: $2.850.000 COP\n• MacBook Air M1 256GB: $2.950.000 COP\n• MacBook Neo 512GB Blanca: $3.300.000 COP\n• MacBook Air M4 15" 256GB: $4.700.000 COP\n• MacBook Air M5 512GB: $5.200.000 COP\n• MacBook Pro 14" M5 512GB: $6.400.000 COP\nTodos con 1 año de garantía Apple.',
 'PRODUCTOS', 'admin'),

('cuál macbook me recomiendan para estudiar',
 'Para estudiar te recomendamos el MacBook Neo 256GB desde $2.850.000 COP o el MacBook Air M1 256GB a $2.950.000 COP. Son potentes, livianos y con 1 año de garantía Apple. ¿Para qué carrera o uso los necesitas?',
 'PRODUCTOS', 'admin'),

('cuál laptop me recomiendan para programar',
 'Para programación te recomendamos el MacBook Air M4 512GB a $4.700.000 COP o el MacBook Pro 14" M5 512GB a $6.400.000 COP. Son las mejores opciones para desarrollo de software por su rendimiento y autonomía de batería.',
 'PRODUCTOS', 'admin'),

-- ============================================================
-- CATEGORÍA: PRODUCTOS — ANDROID (REDMI, INFINIX, TECNO, ETC.)
-- ============================================================
('qué celulares android económicos tienen',
 'Tenemos Android económicos:\n• Redmi A5: $500.000 COP\n• Tecno Spark GO 3 64GB: $505.000 COP\n• Tecno Spark GO 3 128GB: $550.000 COP\n• ZTE Blade V70 Max: $620.000 COP\n• Redmi Note 14 256GB: $850.000 COP\nTodos con 1 año de garantía.',
 'PRODUCTOS', 'admin'),

('tienen redmi note 14',
 'Sí, tenemos Redmi Note 14 256GB a $850.000 COP con 1 año de garantía. Excelente relación precio-rendimiento con pantalla AMOLED y cámara de 50MP.',
 'PRODUCTOS', 'admin'),

('tienen infinix',
 'Sí, tenemos Infinix disponibles:\n• Infinix Hot 60 Pro+: $880.000 COP\n• Infinix Note 50 Pro: $1.170.000 COP\n• Infinix GT 30: $1.200.000 COP\nTodos con 1 año de garantía.',
 'PRODUCTOS', 'admin'),

-- ============================================================
-- CATEGORÍA: PRODUCTOS — PATINETAS
-- ============================================================
('tienen patinetas eléctricas',
 'Sí tenemos patinetas eléctricas Segway disponibles:\n• Segway C2 PRO: $1.280.000 COP — ideal para ciudad\n• Segway ES2: $1.580.000 COP — mayor autonomía\n• Segway ES3: $1.630.000 COP\n• Segway E2: $1.700.000 COP — más robusta\nTodas con 6 meses de garantía. ¿Cuál se adapta a tu uso?',
 'PRODUCTOS', 'admin'),

('cuál patineta me recomiendan',
 'Para uso diario en ciudad te recomendamos la Segway C2 PRO a $1.280.000 COP (la más económica). Si necesitas más autonomía y velocidad, la Segway ES2 a $1.580.000 COP es ideal. ¿Cuántos kilómetros recorres al día?',
 'PRODUCTOS', 'admin'),

-- ============================================================
-- CATEGORÍA: PRODUCTOS — IPAD Y WATCH
-- ============================================================
('tienen ipad disponible',
 'Sí, tenemos iPads disponibles:\n• iPad 5th Gen 32GB (Exhibición): $650.000 COP\n• iPad A16 128GB: $1.600.000 COP (1 año garantía Apple)\n• iPad 11 Pro M5 256GB: $3.950.000 COP\n• iPad Pro 13" M5 256GB: $5.100.000 COP\n¿Para qué uso necesitas el iPad?',
 'PRODUCTOS', 'admin'),

('tienen apple watch',
 'Sí, tenemos Apple Watch:\n• Watch SE Gen2 44mm: $1.250.000 COP\n• Watch Series 11 42mm Rosa: $1.750.000 COP\n• Watch Series 11 46mm GPS: $1.800.000 COP\n• Watch Ultra 3: desde $3.150.000 COP\nTodos con 1 año de garantía Apple.',
 'PRODUCTOS', 'admin'),

('tienen airpods',
 'Sí, tenemos AirPods:\n• AirPods Pro 2 Réplica: $260.000 COP (sin garantía)\n• AirPods 4 Réplica: $260.000 COP (sin garantía)\n• AirPods Pro 3 Original: $1.400.000 COP (1 año garantía Apple)\n¿Prefieres originales o réplica?',
 'PRODUCTOS', 'admin'),

-- ============================================================
-- CATEGORÍA: SERVICIOS DE SOFTWARE
-- ============================================================
('desarrollan software a la medida',
 'Sí, desarrollamos software personalizado para empresas y emprendedores. Creamos aplicaciones web, móviles (PWA), sistemas de gestión, e-commerce, dashboards y más. Tarifa desde $30.000 COP/hora. Primera consulta GRATIS. Escríbenos a contactanos@outiltech.co',
 'SOFTWARE', 'admin'),

('cuánto cuesta desarrollar una app o sistema',
 'El costo depende del alcance del proyecto. Nuestra tarifa base es $30.000 COP/hora. La primera consulta es completamente GRATIS para revisar tu proyecto y darte un estimado. Escríbenos a contactanos@outiltech.co o WhatsApp +57 3133082905.',
 'SOFTWARE', 'admin'),

('qué es iso 27001',
 'ISO 27001 es la norma internacional de seguridad de la información. Nosotros en Outiltech ofrecemos consultoría para que tu empresa implemente y certifique este estándar, protegiendo tus datos y los de tus clientes. Primera consulta GRATIS.',
 'SOFTWARE', 'admin'),

('crean chatbots con inteligencia artificial',
 'Sí, somos especialistas en chatbots con IA como Jhon (con quien estás hablando ahora). Creamos chatbots personalizados para empresas con integración a WhatsApp, sitio web, Claude AI, Groq y más. Primera consulta GRATIS. Escríbenos a contactanos@outiltech.co',
 'SOFTWARE', 'admin'),

('qué es la forensia digital',
 'La forensia digital es la recuperación y análisis de evidencia electrónica. Ofrecemos recuperación de datos eliminados, análisis forense de dispositivos, peritaje digital para procesos legales y auditorías de seguridad. Escríbenos a contactanos@outiltech.co',
 'SOFTWARE', 'admin'),

('hacen páginas web o tiendas online',
 'Sí, desarrollamos páginas web, tiendas e-commerce, PWA (apps web progresivas) y sistemas de gestión. Tecnologías: Angular, React, .NET, Node.js, Supabase. Primera consulta GRATIS. contactanos@outiltech.co',
 'SOFTWARE', 'admin'),

('tienen servicio de devops o servidores',
 'Sí, ofrecemos servicios de DevOps: configuración de servidores, Docker, CI/CD, despliegue en la nube (AWS, Cloudflare, Hetzner). Escríbenos a contactanos@outiltech.co con tu necesidad.',
 'SOFTWARE', 'admin'),

-- ============================================================
-- CATEGORÍA: EMPRESA / CONTACTO
-- ============================================================
('cuál es el horario de atención',
 'Nuestro horario es: Lunes a Viernes de 8:00am a 5:00pm y Sábados de 9:00am a 1:00pm. Fuera de horario puedes dejarnos un mensaje por WhatsApp +57 3133082905 y te respondemos a la brevedad.',
 'EMPRESA', 'admin'),

('cuál es el número de whatsapp',
 'Nuestro WhatsApp es +57 3133082905. Puedes escribirnos en cualquier momento, respondemos en horario Lunes a Viernes 8am-5pm y Sábados 9am-1pm.',
 'EMPRESA', 'admin'),

('cuál es el correo electrónico',
 'Puedes escribirnos a contactanos@outiltech.co para consultas, soporte técnico o proyectos de software. También por WhatsApp +57 3133082905.',
 'EMPRESA', 'admin'),

('tienen tienda física',
 'Somos una tienda principalmente online en outiltech.co con envíos a toda Colombia. Para compras presenciales o demostraciones, contáctanos por WhatsApp +57 3133082905 para coordinar.',
 'EMPRESA', 'admin'),

('dónde están ubicados',
 'Somos una empresa colombiana que opera principalmente online, con envíos a toda Colombia en 1-3 días hábiles. Para atención presencial escríbenos por WhatsApp +57 3133082905.',
 'EMPRESA', 'admin'),

-- ============================================================
-- CATEGORÍA: COMPARACIONES Y RECOMENDACIONES
-- ============================================================
('cuál celular me recomiendan para fotografía',
 'Para fotografía profesional te recomendamos:\n• iPhone 16 Pro (exhibición $3.200.000 o nuevo $4.500.000+) — mejor cámara del mercado.\n• Samsung S26 Ultra ($5.300.000) — cámara de 200MP con zoom óptico.\n• Para presupuesto medio: iPhone 13 ($2.000.000) excelente cámara por el precio.',
 'RECOMENDACIONES', 'admin'),

('cuál es el mejor celular económico',
 'Los mejores económicos que tenemos:\n• Samsung A07 128GB: $650.000 COP — el más barato Samsung con garantía.\n• Redmi A5: $500.000 COP — ideal para uso básico.\n• Tecno Spark GO 3: desde $505.000 COP.\n¿Cuál es tu uso principal?',
 'RECOMENDACIONES', 'admin'),

('qué diferencia hay entre iphone y samsung',
 'iPhone usa iOS (ecosistema Apple, actualizaciones largas, más seguro). Samsung usa Android (más personalizable, mayor variedad de precios). iPhone tiene mejor integración si ya usas Mac, iPad o AirPods. Samsung tiene más opciones de precio. ¿Cuál usas actualmente?',
 'RECOMENDACIONES', 'admin'),

('cuál es el mejor celular para gaming',
 'Para gaming te recomendamos:\n• Infinix GT 30: $1.200.000 COP — diseñado específicamente para gaming.\n• iPhone 16: mejor procesador del mercado para juegos.\n• Samsung S26 Ultra: excelente para gaming con pantalla de 120Hz.',
 'RECOMENDACIONES', 'admin'),

('tienen productos de segunda mano',
 'Sí, manejamos iPhones Exhibición (usados como display en tienda, como nuevos) con 4 meses de garantía Outiltech, y CPO (Certified Pre-Owned): revisados y certificados con 6 meses de garantía. Son la opción más económica con respaldo de garantía.',
 'PRODUCTOS', 'admin'),

('aceptan celulares usados como parte de pago',
 'Por el momento no manejamos compra de equipos usados como parte de pago. Puedes vender tu equipo aparte y usar ese dinero para comprar el tuyo aquí. Escríbenos por WhatsApp +57 3133082905 si tienes dudas.',
 'PAGOS', 'admin'),

('ofrecen descuentos o promociones',
 'Tenemos descuentos periódicos que publicamos en nuestra tienda outiltech.co. Para compras de volumen empresarial o varios productos, escríbenos por WhatsApp +57 3133082905 y buscamos una opción especial para ti.',
 'EMPRESA', 'admin'),

('pueden facturar a nombre de empresa',
 'Sí, generamos factura electrónica a nombre de empresa (persona jurídica). Al hacer tu pedido o por WhatsApp +57 3133082905 indícanos el NIT y razón social.',
 'EMPRESA', 'admin')

ON CONFLICT (pregunta_clave) DO UPDATE SET
  respuesta_oficial = EXCLUDED.respuesta_oficial,
  categoria         = EXCLUDED.categoria,
  activo            = TRUE;

-- Verificar cuántas entradas quedaron
SELECT COUNT(*) AS total_entradas, COUNT(*) FILTER (WHERE creado_por='admin') AS por_admin
FROM conocimiento_jhon WHERE activo = TRUE;
