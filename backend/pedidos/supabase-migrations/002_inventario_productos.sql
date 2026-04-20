-- ============================================================
-- MIGRACIÓN 002: inventario_productos
-- Ejecutar en: Supabase SQL Editor (una sola vez)
-- Para PostgreSQL local/Hetzner se crea automáticamente en Program.cs
-- ============================================================

CREATE TABLE IF NOT EXISTS inventario_productos (
    id              SERIAL PRIMARY KEY,
    producto_id     VARCHAR(100) NOT NULL UNIQUE,
    nombre          VARCHAR(300) NOT NULL,
    marca           VARCHAR(100) NOT NULL,
    categoria       VARCHAR(100) NOT NULL,
    modelo          VARCHAR(200) NOT NULL,
    año             INTEGER NOT NULL DEFAULT 2025,
    precio          DECIMAL(12,2) NOT NULL DEFAULT 0,
    precio_anterior DECIMAL(12,2),
    unidades        INTEGER NOT NULL DEFAULT 5,
    disponibilidad  VARCHAR(2) NOT NULL DEFAULT 'Si',
    garantia        VARCHAR(100) NOT NULL DEFAULT '1 año',
    slug            VARCHAR(200) NOT NULL,
    badge           VARCHAR(50),
    creado_en       TIMESTAMP DEFAULT NOW(),
    actualizado_en  TIMESTAMP DEFAULT NOW()
);

-- Trigger para actualizar actualizado_en automáticamente
CREATE OR REPLACE FUNCTION set_actualizado_en()
RETURNS TRIGGER AS $$
BEGIN NEW.actualizado_en = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_inventario_actualizado ON inventario_productos;
CREATE TRIGGER trg_inventario_actualizado
BEFORE UPDATE ON inventario_productos
FOR EACH ROW EXECUTE FUNCTION set_actualizado_en();

-- ============================================================
-- INSERT 114 productos (INSERT OR IGNORE vía ON CONFLICT)
-- ============================================================
INSERT INTO inventario_productos (producto_id,nombre,marca,categoria,modelo,año,precio,precio_anterior,unidades,disponibilidad,garantia,slug,badge) VALUES
-- ═══ SAMSUNG ═══
('sam-s26u-512','Samsung S26 Ultra 512GB','Samsung','Samsung','Galaxy S Ultra',2025,5300000,5100000,5,'Si','1 año Samsung','samsung-s26-ultra-512gb','NUEVO'),
-- ═══ ACCESORIOS APPLE ═══
('pencil-2gen','Apple Pencil 2da Gen','Apple','Accesorios','Apple Pencil',2022,450000,250000,10,'Si','1 año Apple','apple-pencil-2da-gen','NUEVO'),
('pencil-pro','Apple Pencil Pro','Apple','Accesorios','Apple Pencil',2024,680000,480000,8,'Si','1 año Apple','apple-pencil-pro','NUEVO'),
-- ═══ MACBOOKS ═══
('mbneo-256-azul','MacBook Neo 256GB Azul','Apple','Mac','MacBook Neo',2025,2850000,2650000,5,'Si','1 año Apple','macbook-neo-256gb-azul','NUEVO'),
('mbneo-256-ama','MacBook Neo 256GB Amarilla','Apple','Mac','MacBook Neo',2025,2950000,2750000,5,'Si','1 año Apple','macbook-neo-256gb-amarilla','NUEVO'),
('mbneo-512-bla','MacBook Neo 512GB Blanca','Apple','Mac','MacBook Neo',2025,3300000,3100000,5,'Si','1 año Apple','macbook-neo-512gb-blanca','NUEVO'),
('mbpro14-m5-512','MacBook Pro 14" M5 512GB','Apple','Mac','MacBook Pro',2025,6400000,6200000,3,'Si','1 año Apple','macbook-pro-14-m5-512gb','NUEVO'),
('mbpro14-m5-1tb','MacBook Pro 14" M5 1TB','Apple','Mac','MacBook Pro',2025,7200000,7000000,2,'Si','1 año Apple','macbook-pro-14-m5-1tb','NUEVO'),
('mbair-m1-256','MacBook Air M1 256GB','Apple','Mac','MacBook Air',2020,2950000,2750000,3,'Si','1 año Apple','macbook-air-m1-256gb','OFERTA'),
('mbair-m4-512','MacBook Air M4 512GB','Apple','Mac','MacBook Air',2024,4700000,4500000,4,'Si','1 año Apple','macbook-air-m4-512gb','NUEVO'),
('mbair-m4-15-256','MacBook Air M4 15" 256GB','Apple','Mac','MacBook Air',2024,4700000,4500000,4,'Si','1 año Apple','macbook-air-m4-15-256gb','NUEVO'),
('mbair-m5-512','MacBook Air 13" M5 512GB 16RAM','Apple','Mac','MacBook Air',2025,5200000,5000000,3,'Si','1 año Apple','macbook-air-13-m5-512gb','NUEVO'),
-- ═══ iPADS ═══
('ipad-a16-128','iPad A16 128GB','Apple','iPad','iPad',2025,1600000,1400000,6,'Si','1 año Apple','ipad-a16-128gb','NUEVO'),
('ipadpro13-m5-256','iPad Pro 13" M5 256GB','Apple','iPad','iPad Pro',2025,5100000,4900000,3,'Si','1 año Apple','ipad-pro-13-m5-256gb','NUEVO'),
('ipadpro11-m5-256','iPad 11 Pro M5 256GB','Apple','iPad','iPad Pro',2025,3950000,3750000,4,'Si','1 año Apple','ipad-11-pro-m5-256gb','NUEVO'),
-- ═══ APPLE WATCH ═══
('aw-s11-42-rosa','Watch Series 11 42mm Rosa','Apple','Watch','Apple Watch',2025,1750000,1550000,5,'Si','1 año Apple','apple-watch-s11-42mm-rosa','NUEVO'),
('aw-s11-46-gps','Watch Series 11 46mm GPS','Apple','Watch','Apple Watch',2025,1800000,1600000,5,'Si','1 año Apple','apple-watch-s11-46mm-gps','NUEVO'),
('aw-se2-44-cel','Watch SE Gen2 44mm Cellular','Apple','Watch','Apple Watch SE',2022,1250000,1050000,5,'Si','1 año Apple','apple-watch-se-gen2-44mm','NUEVO'),
('aw-ultra3-man','Watch Ultra 3 Manilla Metálica','Apple','Watch','Apple Watch Ultra',2025,3300000,3100000,2,'Si','1 año Apple','apple-watch-ultra-3-manilla','NUEVO'),
('aw-ultra3-neg','Watch Ultra 3 Negro','Apple','Watch','Apple Watch Ultra',2025,3150000,2950000,2,'Si','1 año Apple','apple-watch-ultra-3-negro','NUEVO'),
-- ═══ iPHONES NUEVOS ═══
('iph13-128','iPhone 13 128GB','Apple','iPhone','iPhone Nuevo',2021,2200000,2000000,5,'Si','1 año Apple','iphone-13-128gb','NUEVO'),
('iph15-128','iPhone 15 128GB','Apple','iPhone','iPhone Nuevo',2023,2600000,2400000,5,'Si','1 año Apple','iphone-15-128gb','NUEVO'),
('iph15-512','iPhone 15 512GB','Apple','iPhone','iPhone Nuevo',2023,2950000,2750000,5,'Si','1 año Apple','iphone-15-512gb','NUEVO'),
('iph15plus-128','iPhone 15 Plus 128GB','Apple','iPhone','iPhone Nuevo',2023,2950000,2750000,4,'Si','1 año Apple','iphone-15-plus-128gb','NUEVO'),
('iph16-128-11m','iPhone 16 128GB — 11 meses','Apple','iPhone','iPhone Nuevo',2024,2850000,2650000,5,'Si','11 meses','iphone-16-128gb-activo','NUEVO'),
('iph16-128','iPhone 16 128GB','Apple','iPhone','iPhone Nuevo',2024,2950000,2750000,5,'Si','1 año Apple','iphone-16-128gb','NUEVO'),
('iph16pm-256','iPhone 16 Pro Max 256GB','Apple','iPhone','iPhone Nuevo',2024,4900000,4700000,4,'Si','1 año Apple','iphone-16-pro-max-256gb','NUEVO'),
('iph16pm-256-asi','iPhone 16 Pro Max Asis 256GB','Apple','iPhone','iPhone Nuevo',2024,4500000,4300000,4,'Si','1 año Apple','iphone-16-pro-max-asis','NUEVO'),
('iph17-256-11m','iPhone 17 256GB — 11 meses','Apple','iPhone','iPhone Nuevo',2025,3550000,3350000,5,'Si','11 meses','iphone-17-256gb-activo','NUEVO'),
('iph17-256','iPhone 17 256GB','Apple','iPhone','iPhone Nuevo',2025,3750000,3550000,5,'Si','1 año Apple','iphone-17-256gb','NUEVO'),
('iph17pro-256-nar','iPhone 17 Pro 256GB Naranja','Apple','iPhone','iPhone Nuevo',2025,5000000,4800000,4,'Si','Efectivo','iphone-17-pro-naranja','NUEVO'),
('iph17pm-256-nb','iPhone 17 Pro Max 256GB Nar/Az','Apple','iPhone','iPhone Nuevo',2025,5550000,5350000,4,'Si','1 año Apple','iphone-17-pro-max-naranja-azul','NUEVO'),
('iph17pm-256-bla','iPhone 17 Pro Max 256GB Blanco','Apple','iPhone','iPhone Nuevo',2025,5550000,5350000,4,'Si','1 año Apple','iphone-17-pro-max-blanco','NUEVO'),
('iph17pm-2tb','iPhone 17 Pro Max 2TB','Apple','iPhone','iPhone Nuevo',2025,8700000,8500000,2,'Si','1 año Apple','iphone-17-pro-max-2tb','NUEVO'),
-- ═══ iPHONES CPO ═══
('iph12-128-cpo','iPhone 12 128GB CPO','Apple','iPhone','iPhone CPO',2020,1600000,1400000,5,'Si','6 meses','iphone-12-128gb-cpo','CPO'),
('iph13-128-cpo','iPhone 13 128GB CPO','Apple','iPhone','iPhone CPO',2021,2000000,1800000,5,'Si','6 meses','iphone-13-128gb-cpo','CPO'),
('iph15pm-512-cpo','iPhone 15 Pro Max 512GB CPO','Apple','iPhone','iPhone CPO',2023,3900000,3700000,3,'Si','6 meses','iphone-15-pro-max-512gb-cpo','CPO'),
('iph15pm-1tb-cpo','iPhone 15 Pro Max 1TB CPO','Apple','iPhone','iPhone CPO',2023,4000000,3800000,3,'Si','6 meses','iphone-15-pro-max-1tb-cpo','CPO'),
-- ═══ PATINETAS SEGWAY ═══
('seg-es2','Patineta Segway ES2','Segway','Patinetas','Segway',2024,1580000,1380000,4,'Si','6 meses','segway-es2','PROMO'),
('seg-es3','Patineta Segway ES3','Segway','Patinetas','Segway',2024,1630000,1430000,4,'Si','6 meses','segway-es3','PROMO'),
('seg-e2','Patineta Segway E2','Segway','Patinetas','Segway',2024,1700000,1500000,3,'Si','6 meses','segway-e2','PROMO'),
('seg-c2pro','Patineta Segway C2 PRO','Segway','Patinetas','Segway',2024,1280000,1080000,4,'Si','6 meses','segway-c2-pro','PROMO'),
-- ═══ AIRPODS ═══
('airpods4-rep','AirPods 4 Réplica','Apple','AirPods','AirPods',2024,260000,60000,10,'Si','Sin garantía','airpods-4-replica','RÉPLICA'),
('airpodsp2-rep','AirPods Pro 2 Réplica','Apple','AirPods','AirPods',2023,260000,60000,10,'Si','Sin garantía','airpods-pro-2-replica','RÉPLICA'),
('airpodsp3-ori','AirPods Pro 3 Original','Apple','AirPods','AirPods',2025,1400000,1200000,5,'Si','1 año Apple','airpods-pro-3-original','NUEVO'),
-- ═══ ACCESORIOS ═══
('cubo-uni','Cubo Original Apple Unidad','Apple','Accesorios','Cargadores',2024,260000,60000,20,'Si','1 año Apple','cubo-apple-unidad','ACCESORIO'),
('cubo-x10','Cubo Original Apple Caja x10','Apple','Accesorios','Cargadores',2024,750000,550000,10,'Si','1 año Apple','cubo-apple-caja-x10','ACCESORIO'),
('cable-cc','Cable USB-C a C Original','Apple','Accesorios','Cables',2024,240000,40000,20,'Si','1 año Apple','cable-usbc-a-c','ACCESORIO'),
('cable-light','Cable Lightning Original','Apple','Accesorios','Cables',2023,235000,35000,20,'Si','1 año Apple','cable-lightning','ACCESORIO'),
-- ═══ EXHIBICIÓN ═══
('exh-ipad5-32','iPad 5th Gen 32GB Sim','Apple','Exhibición','iPad Exhibición',2017,650000,450000,2,'Si','4 meses','exh-ipad-5th-gen-32gb','EXHIBICIÓN'),
('exh-aws7','Watch Series 7 Exhibición','Apple','Exhibición','Watch Exhibición',2021,700000,500000,2,'Si','4 meses','exh-watch-series-7','EXHIBICIÓN'),
('exh-aws9','Watch Series 9 Exhibición','Apple','Exhibición','Watch Exhibición',2023,950000,750000,2,'Si','4 meses','exh-watch-series-9','EXHIBICIÓN'),
('exh-iph11-64','iPhone 11 64GB Exhibición','Apple','Exhibición','iPhone Exhibición',2019,850000,650000,3,'Si','4 meses','exh-iphone-11-64gb','EXHIBICIÓN'),
('exh-iph11-128','iPhone 11 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2019,1050000,850000,3,'Si','4 meses','exh-iphone-11-128gb','EXHIBICIÓN'),
('exh-iph11p-64','iPhone 11 Pro 64GB Exhibición','Apple','Exhibición','iPhone Exhibición',2019,1200000,1000000,2,'Si','4 meses','exh-iphone-11-pro-64gb','EXHIBICIÓN'),
('exh-iph11p-128','iPhone 11 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2019,1300000,1100000,2,'Si','4 meses','exh-iphone-11-pro-128gb','EXHIBICIÓN'),
('exh-iph11pm-256','iPhone 11 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2019,1600000,1400000,2,'Si','4 meses','exh-iphone-11-pro-max-256gb','EXHIBICIÓN'),
('exh-iph12m-64','iPhone 12 Mini 64GB Exhibición','Apple','Exhibición','iPhone Exhibición',2020,900000,700000,2,'Si','4 meses','exh-iphone-12-mini-64gb','EXHIBICIÓN'),
('exh-iph12-128','iPhone 12 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2020,1300000,1100000,3,'Si','4 meses','exh-iphone-12-128gb','EXHIBICIÓN'),
('exh-iph12-256','iPhone 12 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2020,1400000,1200000,3,'Si','4 meses','exh-iphone-12-256gb','EXHIBICIÓN'),
('exh-iph12p-128','iPhone 12 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2020,1500000,1300000,2,'Si','4 meses','exh-iphone-12-pro-128gb','EXHIBICIÓN'),
('exh-iph12p-256','iPhone 12 Pro 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2020,1650000,1450000,2,'Si','4 meses','exh-iphone-12-pro-256gb','EXHIBICIÓN'),
('exh-iph12pm-128','iPhone 12 Pro Max 128GB Exh','Apple','Exhibición','iPhone Exhibición',2020,1850000,1650000,2,'Si','4 meses','exh-iphone-12-pro-max-128gb','EXHIBICIÓN'),
('exh-iph12pm-256','iPhone 12 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2020,1950000,1750000,2,'Si','4 meses','exh-iphone-12-pro-max-256gb','EXHIBICIÓN'),
('exh-iph13-128','iPhone 13 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2021,1520000,1320000,3,'Si','4 meses','exh-iphone-13-128gb','EXHIBICIÓN'),
('exh-iph13-256','iPhone 13 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2021,0,NULL,0,'No','4 meses','exh-iphone-13-256gb','AGOTADO'),
('exh-iph13p-128','iPhone 13 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2021,1900000,1700000,2,'Si','4 meses','exh-iphone-13-pro-128gb','EXHIBICIÓN'),
('exh-iph13p-256','iPhone 13 Pro 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2021,2020000,1820000,2,'Si','4 meses','exh-iphone-13-pro-256gb','EXHIBICIÓN'),
('exh-iph13p-512','iPhone 13 Pro 512GB Exhibición','Apple','Exhibición','iPhone Exhibición',2021,2100000,1900000,2,'Si','4 meses','exh-iphone-13-pro-512gb','EXHIBICIÓN'),
('exh-iph13pm-128','iPhone 13 Pro Max 128GB Exh','Apple','Exhibición','iPhone Exhibición',2021,2100000,1900000,2,'Si','4 meses','exh-iphone-13-pro-max-128gb','EXHIBICIÓN'),
('exh-iph13pm-256','iPhone 13 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2021,2350000,2150000,2,'Si','4 meses','exh-iphone-13-pro-max-256gb','EXHIBICIÓN'),
('exh-iph13pm-1tb','iPhone 13 Pro Max 1TB Exh','Apple','Exhibición','iPhone Exhibición',2021,2650000,2450000,1,'Si','4 meses','exh-iphone-13-pro-max-1tb','EXHIBICIÓN'),
('exh-iph14-128','iPhone 14 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2022,1600000,1400000,3,'Si','4 meses','exh-iphone-14-128gb','EXHIBICIÓN'),
('exh-iph14p-128','iPhone 14 Plus 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2022,1850000,1650000,2,'Si','4 meses','exh-iphone-14-plus-128gb','EXHIBICIÓN'),
('exh-iph14p-256','iPhone 14 Plus 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2022,1950000,1750000,2,'Si','4 meses','exh-iphone-14-plus-256gb','EXHIBICIÓN'),
('exh-iph14pro-128','iPhone 14 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2022,2100000,1900000,2,'Si','4 meses','exh-iphone-14-pro-128gb','EXHIBICIÓN'),
('exh-iph14pro-256','iPhone 14 Pro 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2022,2200000,2000000,2,'Si','4 meses','exh-iphone-14-pro-256gb','EXHIBICIÓN'),
('exh-iph14pm-128','iPhone 14 Pro Max 128GB Exh','Apple','Exhibición','iPhone Exhibición',2022,2480000,2280000,2,'Si','4 meses','exh-iphone-14-pro-max-128gb','EXHIBICIÓN'),
('exh-iph14pm-256','iPhone 14 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2022,2600000,2400000,2,'Si','4 meses','exh-iphone-14-pro-max-256gb','EXHIBICIÓN'),
('exh-iph15-128','iPhone 15 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2023,2150000,1950000,3,'Si','4 meses','exh-iphone-15-128gb','EXHIBICIÓN'),
('exh-iph15-256','iPhone 15 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2023,2600000,2400000,3,'Si','4 meses','exh-iphone-15-256gb','EXHIBICIÓN'),
('exh-iph15p-128','iPhone 15 Plus 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2023,2200000,2000000,2,'Si','4 meses','exh-iphone-15-plus-128gb','EXHIBICIÓN'),
('exh-iph15pro-128','iPhone 15 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2023,2480000,2280000,2,'Si','4 meses','exh-iphone-15-pro-128gb','EXHIBICIÓN'),
('exh-iph15pro-256','iPhone 15 Pro 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2023,2550000,2350000,2,'Si','4 meses','exh-iphone-15-pro-256gb','EXHIBICIÓN'),
('exh-iph15pm-256','iPhone 15 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2023,2850000,2650000,2,'Si','4 meses','exh-iphone-15-pro-max-256gb','EXHIBICIÓN'),
('exh-iph15pm-512','iPhone 15 Pro Max 512GB Exh','Apple','Exhibición','iPhone Exhibición',2023,3050000,2850000,2,'Si','4 meses','exh-iphone-15-pro-max-512gb','EXHIBICIÓN'),
('exh-iph16-128','iPhone 16 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2024,2550000,2350000,3,'Si','4 meses','exh-iphone-16-128gb','EXHIBICIÓN'),
('exh-iph16p-128','iPhone 16 Plus 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2024,2900000,2700000,2,'Si','4 meses','exh-iphone-16-plus-128gb','EXHIBICIÓN'),
('exh-iph16pro-128','iPhone 16 Pro 128GB Exhibición','Apple','Exhibición','iPhone Exhibición',2024,3200000,3000000,2,'Si','4 meses','exh-iphone-16-pro-128gb','EXHIBICIÓN'),
('exh-iph16pro-256','iPhone 16 Pro 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2024,3350000,3150000,2,'Si','4 meses','exh-iphone-16-pro-256gb','EXHIBICIÓN'),
('exh-iph16pm-256','iPhone 16 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2024,3700000,3500000,2,'Si','4 meses','exh-iphone-16-pro-max-256gb','EXHIBICIÓN'),
('exh-iph17-256','iPhone 17 256GB Exhibición','Apple','Exhibición','iPhone Exhibición',2025,3450000,3250000,3,'Si','10 meses Apple','exh-iphone-17-256gb','EXHIBICIÓN'),
('exh-iph17pm-256','iPhone 17 Pro Max 256GB Exh','Apple','Exhibición','iPhone Exhibición',2025,5100000,4900000,2,'Si','Garantía Apple','exh-iphone-17-pro-max-256gb','EXHIBICIÓN'),
-- ═══ SAMSUNG ANDROID ═══
('sam-zflip7fe','Samsung Z Flip 7 FE','Samsung','Samsung','Galaxy Z',2025,3150000,2950000,4,'Si','1 año Samsung','samsung-z-flip-7-fe','NUEVO'),
('sam-zfold3-256','Samsung Z Fold 3 256GB','Samsung','Samsung','Galaxy Z',2021,3200000,3000000,3,'Si','1 año Samsung','samsung-z-fold-3-256gb','NUEVO'),
('sam-a07-128','Samsung A07 128GB','Samsung','Samsung','Galaxy A',2022,650000,450000,8,'Si','1 año Samsung','samsung-a07-128gb','NUEVO'),
('sam-a17-128','Samsung A17 128GB','Samsung','Samsung','Galaxy A',2024,850000,650000,8,'Si','1 año Samsung','samsung-a17-128gb','NUEVO'),
('sam-a56-256','Samsung A56 256GB','Samsung','Samsung','Galaxy A',2025,1550000,1350000,6,'Si','1 año Samsung','samsung-a56-256gb','NUEVO'),
('sam-char45','Samsung Cargador 45W Original','Samsung','Accesorios','Cargadores',2024,280000,80000,15,'Si','1 año Samsung','samsung-cargador-45w','ACCESORIO'),
('sam-char25','Samsung Cargador 25W Original','Samsung','Accesorios','Cargadores',2024,250000,50000,15,'Si','1 año Samsung','samsung-cargador-25w','ACCESORIO'),
-- ═══ ANDROID OTROS ═══
('redmi-note14-256','Redmi Note 14 256GB','Redmi','Android','Redmi',2024,850000,650000,6,'Si','1 año','redmi-note-14-256gb','NUEVO'),
('redmi-a5','Redmi A5','Redmi','Android','Redmi',2025,500000,300000,8,'Si','1 año','redmi-a5','NUEVO'),
('inf-hot60pro','Infinix Hot 60 Pro+','Infinix','Android','Infinix',2024,880000,680000,6,'Si','1 año','infinix-hot-60-pro-plus','NUEVO'),
('inf-note50pro','Infinix Note 50 Pro','Infinix','Android','Infinix',2025,1170000,970000,5,'Si','1 año','infinix-note-50-pro','NUEVO'),
('inf-gt30','Infinix GT 30','Infinix','Android','Infinix',2025,1200000,1000000,5,'Si','1 año','infinix-gt-30','NUEVO'),
('zte-v70max','ZTE Blade V70 Max','ZTE','Android','ZTE',2024,620000,420000,6,'Si','1 año','zte-blade-v70-max','NUEVO'),
('tecno-spark40','Tecno Spark 40','Tecno','Android','Tecno',2024,660000,460000,6,'Si','1 año','tecno-spark-40','NUEVO'),
('tecno-go3-64','Tecno Spark GO 3 64GB','Tecno','Android','Tecno',2025,505000,305000,8,'Si','1 año','tecno-spark-go-3-64gb','NUEVO'),
('tecno-go3-128','Tecno Spark GO 3 128GB','Tecno','Android','Tecno',2025,550000,350000,8,'Si','1 año','tecno-spark-go-3-128gb','NUEVO'),
('tecno-spark50-5g','Tecno Spark 50 5G 256GB','Tecno','Android','Tecno',2025,1050000,850000,6,'Si','1 año','tecno-spark-50-5g','NUEVO'),
('oppo-reno12-5g','Oppo Reno 12 5G','Oppo','Android','Oppo',2024,2400000,2200000,4,'Si','1 año','oppo-reno-12-5g','NUEVO'),
('oppo-a79','Oppo A79','Oppo','Android','Oppo',2023,1040000,840000,5,'Si','1 año','oppo-a79','NUEVO'),
('oppo-a80','Oppo A80','Oppo','Android','Oppo',2024,1060000,860000,5,'Si','1 año','oppo-a80','NUEVO'),
('oppo-a58','Oppo A58','Oppo','Android','Oppo',2023,860000,660000,5,'Si','1 año','oppo-a58','NUEVO')
ON CONFLICT (producto_id) DO UPDATE SET
    nombre         = EXCLUDED.nombre,
    precio         = EXCLUDED.precio,
    precio_anterior= EXCLUDED.precio_anterior,
    disponibilidad = EXCLUDED.disponibilidad,
    unidades       = EXCLUDED.unidades,
    actualizado_en = NOW();

-- Verificar resultado
SELECT COUNT(*) AS total_productos FROM inventario_productos;
