import { Injectable } from '@angular/core';

export interface ProductoVariante {
  storage?: string; color?: string; precio: number; stock: number;
}
export interface Producto {
  id: string; nombre: string; marca: string; categoria: string;
  subcategoria: string; precio: number; precioOriginal?: number;
  imagen: string; imagenes: string[]; descripcion: string;
  specs: { label: string; value: string }[]; variantes?: ProductoVariante[];
  garantia: string; badge?: string; badgeColor?: string;
  destacado: boolean; nuevo: boolean; oferta: boolean; agotado?: boolean; slug: string;
}

// CDN shortcuts
const UN = 'https://images.unsplash.com/photo-';
// Celudmovil CDN — tienda colombiana, imágenes reales de producto verificadas
const C = 'https://www.celudmovil.com.co/cdn/shop/files/';
// Proxy weserv.nl — para WordPress (Segway). GSMarena bloquea este proxy.
const W = 'https://images.weserv.nl/?url=';
// Wikipedia Commons — CDN público, sin hotlink protection, imágenes reales verificadas
const WK = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';

const I: Record<string, string> = {
  // ── iPhones (Celudmovil CDN — imágenes reales por modelo) ─
  iph17:        C + '17_pro_max_1.png?v=1767106364',
  iph17pro:     C + 'pro_m2_44.webp?v=1763754958',
  iph17promax:  C + 'pro_m2_42.webp?v=1763754958',
  iph16:        C + '16_9.webp?v=1747334811',
  iph16promax:  C + '16_pro_max_1_f40bb95c-ed2b-416b-8d03-f60c60cf243a.webp?v=1747509854',
  iph15:        C + '15todos.webp?v=1734530451',
  iph15plus:    C + '15_rosa.webp?v=1746647732',
  iph15promax:  C + '16_pro_max_1_f40bb95c-ed2b-416b-8d03-f60c60cf243a.webp?v=1747509854',
  iph14:        C + '15_negro.webp?v=1746647732',
  iph14plus:    C + '15_negro.webp?v=1746647732',
  iph14pro:     C + '16_pro_max_1_f40bb95c-ed2b-416b-8d03-f60c60cf243a.webp?v=1747509854',
  iph14promax:  C + '16_pro_max_1_f40bb95c-ed2b-416b-8d03-f60c60cf243a.webp?v=1747509854',
  iph13:        C + 'iphone2_990a877b-3624-4d5a-8634-63e3d2d929fd.webp?v=1696443353',
  iph13mini:    C + 'iphone1_555da148-c35c-4b22-bf5f-3e4bbff34b38.webp?v=1696443353',
  iph13pro:     C + 'iphone2_990a877b-3624-4d5a-8634-63e3d2d929fd.webp?v=1696443353',
  iph13promax:  C + 'iphone2_990a877b-3624-4d5a-8634-63e3d2d929fd.webp?v=1696443353',
  iph12:        C + 'iphone1_555da148-c35c-4b22-bf5f-3e4bbff34b38.webp?v=1696443353',
  iph12mini:    C + 'iphone1_555da148-c35c-4b22-bf5f-3e4bbff34b38.webp?v=1696443353',
  iph12pro:     C + 'iphone2_990a877b-3624-4d5a-8634-63e3d2d929fd.webp?v=1696443353',
  iph12promax:  C + 'iphone2_990a877b-3624-4d5a-8634-63e3d2d929fd.webp?v=1696443353',
  iph11:        C + 'iphone1_555da148-c35c-4b22-bf5f-3e4bbff34b38.webp?v=1696443353',
  iph11pro:     C + 'iphone2_990a877b-3624-4d5a-8634-63e3d2d929fd.webp?v=1696443353',
  iph11promax:  C + 'iphone2_990a877b-3624-4d5a-8634-63e3d2d929fd.webp?v=1696443353',
  // ── MacBooks (Celudmovil CDN — imágenes reales) ────────────
  mbpro14:      C + 'm5_1.png?v=1763046141',
  mbneo:        C + 'macbook_m4.webp?v=1773856641',
  mbneo2:       C + 'macbook_m4.webp?v=1773856641',
  mbairM5:      C + 'macbook_m4.webp?v=1773856641',
  mbairM4:      C + 'macbook_m4.webp?v=1773856641',
  mbairM4_15:   C + 'silver_1.webp?v=1773856641',
  mbairM1:      UN + '1517336714731-489689fd1ca8?w=400&q=80',
  // ── iPads (Celudmovil CDN para A16; Unsplash para Pro M5) ──
  ipadA16:      C + 'chip_a16_6.webp?v=1764013976',
  ipadPro13:    UN + '1588872657578-7efd1f1555ed?w=400&q=80',
  ipadPro11:    UN + '1561154464-02ce557b5f1a?w=400&q=80',
  ipad5gen:     UN + '1544244015-0df4b3ffc6b0?w=400&q=80',
  // ── Apple Watch (Celudmovil CDN — imágenes reales) ─────────
  watchS11:     C + 'AppWTCHN21_8449e0bd-ceb7-434d-8afe-48b5ab748711.webp?v=1700332105',
  watchS9:      C + 'SERIE945MMRosado_60cb8631-6aa7-4cb6-992d-01e0255f7ce0.webp?v=1709649508',
  watchS7:      UN + '1523275335684-37898b6baf30?w=400&q=80',
  watchSE:      C + 'starlight-Serie9-41mm-PG_a5fc5f01-b4ab-401a-bfd8-2d8a5281481e.webp?v=1700334036',
  watchUltra:   C + 'ultra_3_2bfca2a6-17fa-471f-8441-09eb44a2add8.png?v=1765990350',
  // ── AirPods (Celudmovil CDN — imágenes reales) ─────────────
  airpodsPro3:  C + 'prom2_48_4e50ca20-201b-46b5-8b10-51a5b8befdef.webp?v=1757533597',
  airpods4:     C + 'pro_m2_47.webp?v=1757533406',
  // ── Apple Pencil (Celudmovil CDN — imágenes reales) ───────
  pencil2:      C + 'LL_7.png?v=1732205743',
  pencilPro:    C + 'PENCILPRO.png?v=1729719804',
  // ── Accesorios ─────────────────────────────────────────────
  cable:        UN + '1583863788434-41f6b11b0b9e?w=400&q=80',
  cube:         UN + '1605773527852-c546a8584ea3?w=400&q=80',
  // ── Segway (proxy weserv.nl → tienda.segway.center, imágenes reales) ──────
  segES2:   W + 'tienda.segway.center/wp-content/uploads/2025/06/E2-PLUS-II-segway-center.png',
  segES3:   W + 'tienda.segway.center/wp-content/uploads/2025/06/E3-PRO-segway-center.png',
  segE2:    W + 'tienda.segway.center/wp-content/uploads/2025/06/E2-PLUS-II-segway-center.png',
  segC2pro: W + 'tienda.segway.center/wp-content/uploads/2025/11/C2PRO-SEGWAY-CENTER.jpg',
  segway:   W + 'tienda.segway.center/wp-content/uploads/2025/11/C2PRO-SEGWAY-CENTER.jpg',
  // ── Samsung (Celudmovil CDN — imágenes reales) ─────────────
  samS26:       C + 'S26ULTRAPNG.png?v=1772545758',
  samZFlip7:    C + 'Disenosintitulo_2_d9a0db1b-48df-4ad7-a6d7-de999886a676.jpg?v=1774984341',
  samZFold3:    WK + '7/7e/Samsung_Galaxy_Z_Fold3.jpg/400px-Samsung_Galaxy_Z_Fold3.jpg',
  samA07:       'https://media.falabella.com.co/falabellaCO/148449030_01/width=400,height=400,quality=80,format=webp,fit=pad',
  samA17:       'https://media.falabella.com.co/falabellaCO/150322231_01/width=400,height=400,quality=80,format=webp,fit=pad',
  samA56:       C + 'silver_6.webp?v=1743454981',
  samChar45:    UN + '1605773527852-c546a8584ea3?w=400&q=80',
  samChar25:    UN + '1605773527852-c546a8584ea3?w=400&q=80',
  // ── Android otros (Falabella Colombia CDN — fotos reales de producto verificadas) ──
  // Redmi
  android:      'https://media.falabella.com.co/falabellaCO/140207192_01/width=400,height=400,quality=80,format=webp,fit=pad',  // Redmi Note 14 256GB Negro
  android2:     'https://media.falabella.com.co/falabellaCO/143032459_01/width=400,height=400,quality=80,format=webp,fit=pad',  // Redmi A5 128GB Negro
  // Infinix
  android3:     'https://media.falabella.com.co/falabellaCO/73378495_1/width=400,height=400,quality=80,format=webp,fit=pad',    // Infinix HOT 60 Pro+ 4G 256GB
  infinixNote:  'https://media.falabella.com.co/falabellaCO/148118246_01/width=400,height=400,quality=80,format=webp,fit=pad',  // Infinix Note 50 Pro 256GB Gris
  infinixGT:    'https://media.falabella.com.co/falabellaCO/73448846_1/width=400,height=400,quality=80,format=webp,fit=pad',    // Infinix GT 30 5G 256GB
  // ZTE
  zte:          WK + 'e/e0/5G_phone_-_ZTE_Axon_10_Pro_5G_%282%29.jpg/400px-5G_phone_-_ZTE_Axon_10_Pro_5G_%282%29.jpg',
  zteV70max:    'https://media.falabella.com.co/falabellaCO/151099079_01/width=400,height=400,quality=80,format=webp,fit=pad',  // ZTE Blade V70 Max 256GB Dorado
  // Tecno
  tecno:        'https://media.falabella.com.co/falabellaCO/147860655_01/width=400,height=400,quality=80,format=webp,fit=pad',  // Tecno Spark 40 256GB Negro
  tecnoGO64:    'https://media.falabella.com.co/falabellaCO/152106393_01/width=400,height=400,quality=80,format=webp,fit=pad',  // Tecno Spark GO 3 64GB
  tecnoGO128:   'https://media.falabella.com.co/falabellaCO/152106929_01/width=400,height=400,quality=80,format=webp,fit=pad',  // Tecno Spark GO 3 128GB
  tecno5G:      'https://media.falabella.com.co/falabellaCO/152339168_01/width=400,height=400,quality=80,format=webp,fit=pad',  // Tecno Spark 50 5G 256GB
  // Oppo — Reno12 desde Falabella; A-series desde Wikipedia (A78 generación similar)
  oppoReno:     'https://media.falabella.com.co/falabellaCO/144473297_01/width=400,height=400,quality=80,format=webp,fit=pad',  // Oppo Reno 12 5G 512GB Gris
  oppoA79:      WK + '8/87/Oppo_A78.jpg/400px-Oppo_A78.jpg',   // Oppo A78 (misma gen A79)
  oppoA80:      WK + '8/87/Oppo_A78.jpg/400px-Oppo_A78.jpg',   // Oppo A78 (misma gen A80)
  oppoA58:      WK + '8/87/Oppo_A78.jpg/400px-Oppo_A78.jpg',   // Oppo A78 (serie A similar)
};

function p(
  id: string, nombre: string, marca: string, cat: string, sub: string,
  precio: number, img: string, garantia: string, badge: string,
  nuevo: boolean, dest: boolean, oferta: boolean, slug: string, agotado = false
): Producto {
  return {
    id, nombre, marca, categoria: cat, subcategoria: sub, precio,
    imagen: img, imagenes: [img], descripcion: nombre, specs: [],
    garantia, badge: badge || undefined, nuevo, destacado: dest,
    oferta, agotado: agotado || undefined, slug
  };
}

@Injectable({ providedIn: 'root' })
export class ProductosService {

  /** Aplica el proxy weserv.nl a URLs externas que bloquean hotlinking.
   *  Deja intactas las URLs de dominios confiables (celudmovil, unsplash, weserv). */
  private proxifyImageUrl(url: string): string {
    if (!url) return url;
    if (url.includes('images.weserv.nl')) return url;              // ya proxificada
    const safe = ['celudmovil.com.co', 'images.unsplash.com', 'upload.wikimedia.org', 'placehold.co', 'media.falabella.com.co'];
    if (safe.some(d => url.includes(d))) return url;               // dominios confiables sin hotlink
    const clean = url.replace(/^https?:\/\//, '');
    return `https://images.weserv.nl/?url=${encodeURIComponent(clean)}`;
  }

  constructor() {
    // Post-procesa todos los productos para que ninguna imagen externa quede sin proxy
    this.productos = this.productos.map(prod => {
      const img = this.proxifyImageUrl(prod.imagen);
      return { ...prod, imagen: img, imagenes: [img] };
    });
  }

  private productos: Producto[] = [
    // ═══════════════════════ SAMSUNG ═══════════════════════
    p('sam-s26u-512',    'Samsung S26 Ultra 512GB',        'Samsung','Samsung','Galaxy S Ultra',    5100000, I['samS26'],    '1 año Samsung',  'NUEVO',    true,  true,  false, 'samsung-s26-ultra-512gb'),
    // ═══════════════════════ ACCESORIOS APPLE ═══════════════════════
    p('pencil-2gen',     'Apple Pencil 2da Gen',           'Apple',  'Accesorios','Apple Pencil',   250000,  I['pencil2'],   '1 año Apple',    'NUEVO',    true,  false, false, 'apple-pencil-2da-gen'),
    p('pencil-pro',      'Apple Pencil Pro',               'Apple',  'Accesorios','Apple Pencil',   480000,  I['pencilPro'], '1 año Apple',    'NUEVO',    true,  true,  false, 'apple-pencil-pro'),
    // ═══════════════════════ MACBOOKS ═══════════════════════
    p('mbneo-256-azul',  'MacBook Neo 256GB Azul',         'Apple',  'Mac','MacBook Neo',           2650000, I['mbneo'],    '1 año Apple',    'NUEVO',    true,  true,  false, 'macbook-neo-256gb-azul'),
    p('mbneo-256-ama',   'MacBook Neo 256GB Amarilla',     'Apple',  'Mac','MacBook Neo',           2750000, I['mbneo2'],   '1 año Apple',    'NUEVO',    true,  false, false, 'macbook-neo-256gb-amarilla'),
    p('mbneo-512-bla',   'MacBook Neo 512GB Blanca',       'Apple',  'Mac','MacBook Neo',           3100000, I['mbairM4'],  '1 año Apple',    'NUEVO',    true,  true,  false, 'macbook-neo-512gb-blanca'),
    p('mbpro14-m5-512',  'MacBook Pro 14" M5 512GB',       'Apple',  'Mac','MacBook Pro',           6200000, I['mbpro14'],  '1 año Apple',    'NUEVO',    true,  true,  false, 'macbook-pro-14-m5-512gb'),
    p('mbpro14-m5-1tb',  'MacBook Pro 14" M5 1TB',         'Apple',  'Mac','MacBook Pro',           7000000, I['mbpro14'],  '1 año Apple',    'NUEVO',    true,  false, false, 'macbook-pro-14-m5-1tb'),
    p('mbair-m1-256',    'MacBook Air M1 256GB',           'Apple',  'Mac','MacBook Air',           2750000, I['mbairM1'],  '1 año Apple',    'OFERTA',   false, false, true,  'macbook-air-m1-256gb'),
    p('mbair-m4-512',    'MacBook Air M4 512GB',           'Apple',  'Mac','MacBook Air',           4500000, I['mbairM4'],  '1 año Apple',    'NUEVO',    true,  true,  false, 'macbook-air-m4-512gb'),
    p('mbair-m4-15-256', 'MacBook Air M4 15" 256GB',       'Apple',  'Mac','MacBook Air',           4500000, I['mbairM4_15'],'1 año Apple',   'NUEVO',    true,  true,  false, 'macbook-air-m4-15-256gb'),
    p('mbair-m5-512',    'MacBook Air 13" M5 512GB 16RAM', 'Apple',  'Mac','MacBook Air',           5000000, I['mbairM5'],  '1 año Apple',    'NUEVO',    true,  true,  false, 'macbook-air-13-m5-512gb'),
    // ═══════════════════════ iPADS ═══════════════════════
    p('ipad-a16-128',    'iPad A16 128GB',                 'Apple',  'iPad','iPad',                 1400000, I['ipadA16'],  '1 año Apple',    'NUEVO',    true,  true,  false, 'ipad-a16-128gb'),
    p('ipadpro13-m5-256','iPad Pro 13" M5 256GB',          'Apple',  'iPad','iPad Pro',             4900000, I['ipadPro13'],'1 año Apple',    'NUEVO',    true,  true,  false, 'ipad-pro-13-m5-256gb'),
    p('ipadpro11-m5-256','iPad 11 Pro M5 256GB',           'Apple',  'iPad','iPad Pro',             3750000, I['ipadPro11'],'1 año Apple',    'NUEVO',    true,  true,  false, 'ipad-11-pro-m5-256gb'),
    // ═══════════════════════ APPLE WATCH ═══════════════════════
    p('aw-s11-42-rosa',  'Watch Series 11 42mm Rosa',      'Apple',  'Watch','Apple Watch',         1550000, I['watchS11'], '1 año Apple',    'NUEVO',    true,  true,  false, 'apple-watch-s11-42mm-rosa'),
    p('aw-s11-46-gps',   'Watch Series 11 46mm GPS',       'Apple',  'Watch','Apple Watch',         1600000, I['watchS11'], '1 año Apple',    'NUEVO',    true,  false, false, 'apple-watch-s11-46mm-gps'),
    p('aw-se2-44-cel',   'Watch SE Gen2 44mm Cellular',    'Apple',  'Watch','Apple Watch SE',      1050000, I['watchSE'],  '1 año Apple',    'NUEVO',    true,  false, false, 'apple-watch-se-gen2-44mm'),
    p('aw-ultra3-man',   'Watch Ultra 3 Manilla Metálica', 'Apple',  'Watch','Apple Watch Ultra',   3100000, I['watchUltra'],'1 año Apple',   'NUEVO',    true,  true,  false, 'apple-watch-ultra-3-manilla'),
    p('aw-ultra3-neg',   'Watch Ultra 3 Negro',            'Apple',  'Watch','Apple Watch Ultra',   2950000, I['watchUltra'],'1 año Apple',   'NUEVO',    true,  true,  false, 'apple-watch-ultra-3-negro'),
    // ═══════════════════════ iPHONES NUEVOS ═══════════════════════
    p('iph13-128',       'iPhone 13 128GB',                'Apple',  'iPhone','iPhone Nuevo',       2000000, I['iph13'],    '1 año Apple',    'NUEVO',    false, false, false, 'iphone-13-128gb'),
    p('iph15-128',       'iPhone 15 128GB',                'Apple',  'iPhone','iPhone Nuevo',       2400000, I['iph15'],    '1 año Apple',    'NUEVO',    true,  true,  false, 'iphone-15-128gb'),
    p('iph15-512',       'iPhone 15 512GB',                'Apple',  'iPhone','iPhone Nuevo',       2750000, I['iph15'],    '1 año Apple',    'NUEVO',    true,  false, false, 'iphone-15-512gb'),
    p('iph15plus-128',   'iPhone 15 Plus 128GB',           'Apple',  'iPhone','iPhone Nuevo',       2750000, I['iph15plus'],'1 año Apple',   'NUEVO',    true,  false, false, 'iphone-15-plus-128gb'),
    p('iph16-128-11m',   'iPhone 16 128GB — 11 meses',     'Apple',  'iPhone','iPhone Nuevo',       2650000, I['iph16'],    '11 meses',       'NUEVO',    true,  true,  false, 'iphone-16-128gb-activo'),
    p('iph16-128',       'iPhone 16 128GB',                'Apple',  'iPhone','iPhone Nuevo',       2750000, I['iph16'],    '1 año Apple',    'NUEVO',    true,  true,  false, 'iphone-16-128gb'),
    p('iph16pm-256',     'iPhone 16 Pro Max 256GB',        'Apple',  'iPhone','iPhone Nuevo',       4700000, I['iph16promax'],'1 año Apple',  'NUEVO',    true,  true,  false, 'iphone-16-pro-max-256gb'),
    p('iph16pm-256-asi', 'iPhone 16 Pro Max Asis 256GB',   'Apple',  'iPhone','iPhone Nuevo',       4300000, I['iph16promax'],'1 año Apple',  'NUEVO',    true,  false, false, 'iphone-16-pro-max-asis'),
    p('iph17-256-11m',   'iPhone 17 256GB — 11 meses',     'Apple',  'iPhone','iPhone Nuevo',       3350000, I['iph17'],    '11 meses',       'NUEVO',    true,  true,  false, 'iphone-17-256gb-activo'),
    p('iph17-256',       'iPhone 17 256GB',                'Apple',  'iPhone','iPhone Nuevo',       3550000, I['iph17'],    '1 año Apple',    'NUEVO',    true,  true,  false, 'iphone-17-256gb'),
    p('iph17pro-256-nar','iPhone 17 Pro 256GB Naranja',    'Apple',  'iPhone','iPhone Nuevo',       4800000, I['iph17pro'], 'Efectivo',       'NUEVO',    true,  true,  false, 'iphone-17-pro-naranja'),
    p('iph17pm-256-nb',  'iPhone 17 Pro Max 256GB Nar/Az', 'Apple',  'iPhone','iPhone Nuevo',       5350000, I['iph17promax'],'1 año Apple',  'NUEVO',    true,  true,  false, 'iphone-17-pro-max-naranja-azul'),
    p('iph17pm-256-bla', 'iPhone 17 Pro Max 256GB Blanco', 'Apple',  'iPhone','iPhone Nuevo',       5350000, I['iph17promax'],'1 año Apple',  'NUEVO',    true,  true,  false, 'iphone-17-pro-max-blanco'),
    p('iph17pm-2tb',     'iPhone 17 Pro Max 2TB',          'Apple',  'iPhone','iPhone Nuevo',       8500000, I['iph17promax'],'1 año Apple',  'NUEVO',    true,  true,  false, 'iphone-17-pro-max-2tb'),
    // ═══════════════════════ iPHONES CPO ═══════════════════════
    p('iph12-128-cpo',   'iPhone 12 128GB CPO',            'Apple',  'iPhone','iPhone CPO',         1400000, I['iph12'],    '6 meses',        'CPO',      false, false, true,  'iphone-12-128gb-cpo'),
    p('iph13-128-cpo',   'iPhone 13 128GB CPO',            'Apple',  'iPhone','iPhone CPO',         1800000, I['iph13'],    '6 meses',        'CPO',      false, false, true,  'iphone-13-128gb-cpo'),
    p('iph15pm-512-cpo', 'iPhone 15 Pro Max 512GB CPO',    'Apple',  'iPhone','iPhone CPO',         3700000, I['iph15promax'],'6 meses',      'CPO',      false, true,  true,  'iphone-15-pro-max-512gb-cpo'),
    p('iph15pm-1tb-cpo', 'iPhone 15 Pro Max 1TB CPO',      'Apple',  'iPhone','iPhone CPO',         3800000, I['iph15promax'],'6 meses',      'CPO',      false, false, true,  'iphone-15-pro-max-1tb-cpo'),
    // ═══════════════════════ PATINETAS SEGWAY ═══════════════════════
    p('seg-es2',         'Patineta Segway ES2',            'Segway', 'Patinetas','Segway',          1380000, I['segES2'],   '6 meses',        'PROMO',    false, false, true,  'segway-es2'),
    p('seg-es3',         'Patineta Segway ES3',            'Segway', 'Patinetas','Segway',          1430000, I['segES3'],   '6 meses',        'PROMO',    false, false, true,  'segway-es3'),
    p('seg-e2',          'Patineta Segway E2',             'Segway', 'Patinetas','Segway',          1500000, I['segE2'],    '6 meses',        'PROMO',    false, false, true,  'segway-e2'),
    p('seg-c2pro',       'Patineta Segway C2 PRO',         'Segway', 'Patinetas','Segway',          1080000, I['segC2pro'], '6 meses',        'PROMO',    false, false, true,  'segway-c2-pro'),
    // ═══════════════════════ ACCESORIOS AIRPODS ═══════════════════════
    p('airpods4-rep',    'AirPods 4 Réplica',              'Apple',  'AirPods','AirPods',            60000,  I['airpods4'], 'Sin garantía',   'RÉPLICA',  false, false, true,  'airpods-4-replica'),
    p('airpodsp2-rep',   'AirPods Pro 2 Réplica',          'Apple',  'AirPods','AirPods',            60000,  I['airpodsPro3'],'Sin garantía',  'RÉPLICA',  false, false, true,  'airpods-pro-2-replica'),
    p('airpodsp3-ori',   'AirPods Pro 3 Original',         'Apple',  'AirPods','AirPods',           1200000, I['airpodsPro3'],'1 año Apple',  'NUEVO',    true,  true,  false, 'airpods-pro-3-original'),
    p('cubo-uni',        'Cubo Original Apple Unidad',     'Apple',  'Accesorios','Cargadores',      60000,  I['cube'],     '1 año Apple',    'ACCESORIO',false, false, false, 'cubo-apple-unidad'),
    p('cubo-x10',        'Cubo Original Apple Caja x10',   'Apple',  'Accesorios','Cargadores',     550000,  I['cube'],     '1 año Apple',    'ACCESORIO',false, false, false, 'cubo-apple-caja-x10'),
    p('cable-cc',        'Cable USB-C a C Original',       'Apple',  'Accesorios','Cables',          40000,  I['cable'],    '1 año Apple',    'ACCESORIO',false, false, false, 'cable-usbc-a-c'),
    p('cable-light',     'Cable Lightning Original',       'Apple',  'Accesorios','Cables',          35000,  I['cable'],    '1 año Apple',    'ACCESORIO',false, false, false, 'cable-lightning'),
    // ═══════════════════════ EXHIBICIÓN APPLE ═══════════════════════
    p('exh-ipad5-32',    'iPad 5th Gen 32GB Sim',          'Apple',  'Exhibición','iPad Exhibición', 450000, I['ipad5gen'], '4 meses',        'EXHIBICIÓN',false,false,true,  'exh-ipad-5th-gen-32gb'),
    p('exh-aws7',        'Watch Series 7 Exhibición',      'Apple',  'Exhibición','Watch Exhibición',500000, I['watchS7'],  '4 meses',        'EXHIBICIÓN',false,false,true,  'exh-watch-series-7'),
    p('exh-aws9',        'Watch Series 9 Exhibición',      'Apple',  'Exhibición','Watch Exhibición',750000, I['watchS9'],  '4 meses',        'EXHIBICIÓN',false,false,true,  'exh-watch-series-9'),
    p('exh-iph11-64',    'iPhone 11 64GB Exhibición',      'Apple',  'Exhibición','iPhone Exhibición',650000,I['iph11'],   '4 meses',        'EXHIBICIÓN',false,false,true,  'exh-iphone-11-64gb'),
    p('exh-iph11-128',   'iPhone 11 128GB Exhibición',     'Apple',  'Exhibición','iPhone Exhibición',850000,I['iph11'],   '4 meses',        'EXHIBICIÓN',false,false,true,  'exh-iphone-11-128gb'),
    p('exh-iph11p-64',   'iPhone 11 Pro 64GB Exhibición',  'Apple',  'Exhibición','iPhone Exhibición',1000000,I['iph11pro'],'4 meses',       'EXHIBICIÓN',false,false,true,  'exh-iphone-11-pro-64gb'),
    p('exh-iph11p-128',  'iPhone 11 Pro 128GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',1100000,I['iph11pro'],'4 meses',       'EXHIBICIÓN',false,false,true,  'exh-iphone-11-pro-128gb'),
    p('exh-iph11pm-256', 'iPhone 11 Pro Max 256GB Exh',    'Apple',  'Exhibición','iPhone Exhibición',1400000,I['iph11promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-11-pro-max-256gb'),
    p('exh-iph12m-64',   'iPhone 12 Mini 64GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',700000,I['iph12mini'],'4 meses',      'EXHIBICIÓN',false,false,true,  'exh-iphone-12-mini-64gb'),
    p('exh-iph12-128',   'iPhone 12 128GB Exhibición',     'Apple',  'Exhibición','iPhone Exhibición',1100000,I['iph12'],  '4 meses',        'EXHIBICIÓN',false,false,true,  'exh-iphone-12-128gb'),
    p('exh-iph12-256',   'iPhone 12 256GB Exhibición',     'Apple',  'Exhibición','iPhone Exhibición',1200000,I['iph12'],  '4 meses',        'EXHIBICIÓN',false,false,true,  'exh-iphone-12-256gb'),
    p('exh-iph12p-128',  'iPhone 12 Pro 128GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',1300000,I['iph12pro'],'4 meses',       'EXHIBICIÓN',false,false,true,  'exh-iphone-12-pro-128gb'),
    p('exh-iph12p-256',  'iPhone 12 Pro 256GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',1450000,I['iph12pro'],'4 meses',       'EXHIBICIÓN',false,false,true,  'exh-iphone-12-pro-256gb'),
    p('exh-iph12pm-128', 'iPhone 12 Pro Max 128GB Exh',    'Apple',  'Exhibición','iPhone Exhibición',1650000,I['iph12promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-12-pro-max-128gb'),
    p('exh-iph12pm-256', 'iPhone 12 Pro Max 256GB Exh',    'Apple',  'Exhibición','iPhone Exhibición',1750000,I['iph12promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-12-pro-max-256gb'),
    p('exh-iph13-128',   'iPhone 13 128GB Exhibición',     'Apple',  'Exhibición','iPhone Exhibición',1320000,I['iph13'],  '4 meses',        'EXHIBICIÓN',false,false,true,  'exh-iphone-13-128gb'),
    p('exh-iph13-256',   'iPhone 13 256GB Exhibición',     'Apple',  'Exhibición','iPhone Exhibición',0,     I['iph13'],   '4 meses',        'AGOTADO',  false, false, false, 'exh-iphone-13-256gb', true),
    p('exh-iph13p-128',  'iPhone 13 Pro 128GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',1700000,I['iph13pro'],'4 meses',       'EXHIBICIÓN',false,false,true,  'exh-iphone-13-pro-128gb'),
    p('exh-iph13p-256',  'iPhone 13 Pro 256GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',1820000,I['iph13pro'],'4 meses',       'EXHIBICIÓN',false,false,true,  'exh-iphone-13-pro-256gb'),
    p('exh-iph13p-512',  'iPhone 13 Pro 512GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',1900000,I['iph13pro'],'4 meses',       'EXHIBICIÓN',false,false,true,  'exh-iphone-13-pro-512gb'),
    p('exh-iph13pm-128', 'iPhone 13 Pro Max 128GB Exh',    'Apple',  'Exhibición','iPhone Exhibición',1900000,I['iph13promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-13-pro-max-128gb'),
    p('exh-iph13pm-256', 'iPhone 13 Pro Max 256GB Exh',    'Apple',  'Exhibición','iPhone Exhibición',2150000,I['iph13promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-13-pro-max-256gb'),
    p('exh-iph13pm-1tb', 'iPhone 13 Pro Max 1TB Exh',      'Apple',  'Exhibición','iPhone Exhibición',2450000,I['iph13promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-13-pro-max-1tb'),
    p('exh-iph14-128',   'iPhone 14 128GB Exhibición',     'Apple',  'Exhibición','iPhone Exhibición',1400000,I['iph14'],  '4 meses',        'EXHIBICIÓN',false,false,true,  'exh-iphone-14-128gb'),
    p('exh-iph14p-128',  'iPhone 14 Plus 128GB Exhibición','Apple',  'Exhibición','iPhone Exhibición',1650000,I['iph14plus'],'4 meses',      'EXHIBICIÓN',false,false,true,  'exh-iphone-14-plus-128gb'),
    p('exh-iph14p-256',  'iPhone 14 Plus 256GB Exhibición','Apple',  'Exhibición','iPhone Exhibición',1750000,I['iph14plus'],'4 meses',      'EXHIBICIÓN',false,false,true,  'exh-iphone-14-plus-256gb'),
    p('exh-iph14pro-128','iPhone 14 Pro 128GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',1900000,I['iph14pro'],'4 meses',       'EXHIBICIÓN',false,false,true,  'exh-iphone-14-pro-128gb'),
    p('exh-iph14pro-256','iPhone 14 Pro 256GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',2000000,I['iph14pro'],'4 meses',       'EXHIBICIÓN',false,false,true,  'exh-iphone-14-pro-256gb'),
    p('exh-iph14pm-128', 'iPhone 14 Pro Max 128GB Exh',    'Apple',  'Exhibición','iPhone Exhibición',2280000,I['iph14promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-14-pro-max-128gb'),
    p('exh-iph14pm-256', 'iPhone 14 Pro Max 256GB Exh',    'Apple',  'Exhibición','iPhone Exhibición',2400000,I['iph14promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-14-pro-max-256gb'),
    p('exh-iph15-128',   'iPhone 15 128GB Exhibición',     'Apple',  'Exhibición','iPhone Exhibición',1950000,I['iph15'],  '4 meses',        'EXHIBICIÓN',false,false,true,  'exh-iphone-15-128gb'),
    p('exh-iph15-256',   'iPhone 15 256GB Exhibición',     'Apple',  'Exhibición','iPhone Exhibición',2400000,I['iph15'],  '4 meses',        'EXHIBICIÓN',false,false,true,  'exh-iphone-15-256gb'),
    p('exh-iph15p-128',  'iPhone 15 Plus 128GB Exhibición','Apple',  'Exhibición','iPhone Exhibición',2000000,I['iph15plus'],'4 meses',      'EXHIBICIÓN',false,false,true,  'exh-iphone-15-plus-128gb'),
    p('exh-iph15pro-128','iPhone 15 Pro 128GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',2280000,I['iph15promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-15-pro-128gb'),
    p('exh-iph15pro-256','iPhone 15 Pro 256GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',2350000,I['iph15promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-15-pro-256gb'),
    p('exh-iph15pm-256', 'iPhone 15 Pro Max 256GB Exh',    'Apple',  'Exhibición','iPhone Exhibición',2650000,I['iph15promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-15-pro-max-256gb'),
    p('exh-iph15pm-512', 'iPhone 15 Pro Max 512GB Exh',    'Apple',  'Exhibición','iPhone Exhibición',2850000,I['iph15promax'],'4 meses',    'EXHIBICIÓN',false,false,true,  'exh-iphone-15-pro-max-512gb'),
    p('exh-iph16-128',   'iPhone 16 128GB Exhibición',     'Apple',  'Exhibición','iPhone Exhibición',2350000,I['iph16'],  '4 meses',        'EXHIBICIÓN',true, false, true,  'exh-iphone-16-128gb'),
    p('exh-iph16p-128',  'iPhone 16 Plus 128GB Exhibición','Apple',  'Exhibición','iPhone Exhibición',2700000,I['iph16'],  '4 meses',        'EXHIBICIÓN',true, false, true,  'exh-iphone-16-plus-128gb'),
    p('exh-iph16pro-128','iPhone 16 Pro 128GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',3000000,I['iph16promax'],'4 meses',    'EXHIBICIÓN',true, false, true,  'exh-iphone-16-pro-128gb'),
    p('exh-iph16pro-256','iPhone 16 Pro 256GB Exhibición', 'Apple',  'Exhibición','iPhone Exhibición',3150000,I['iph16promax'],'4 meses',    'EXHIBICIÓN',true, false, true,  'exh-iphone-16-pro-256gb'),
    p('exh-iph16pm-256', 'iPhone 16 Pro Max 256GB Exh',    'Apple',  'Exhibición','iPhone Exhibición',3500000,I['iph16promax'],'4 meses',    'EXHIBICIÓN',true, true,  true,  'exh-iphone-16-pro-max-256gb'),
    p('exh-iph17-256',   'iPhone 17 256GB Exhibición',     'Apple',  'Exhibición','iPhone Exhibición',3250000,I['iph17'],  '10 meses Apple', 'EXHIBICIÓN',true, true,  false, 'exh-iphone-17-256gb'),
    p('exh-iph17pm-256', 'iPhone 17 Pro Max 256GB Exh',    'Apple',  'Exhibición','iPhone Exhibición',4900000,I['iph17promax'],'Garantía Apple','EXHIBICIÓN',true,true, false, 'exh-iphone-17-pro-max-256gb'),
    // ═══════════════════════ SAMSUNG ANDROID ═══════════════════════
    p('sam-zflip7fe',    'Samsung Z Flip 7 FE',            'Samsung','Samsung','Galaxy Z',          2950000, I['samZFlip7'],'1 año Samsung',  'NUEVO',    true,  true,  false, 'samsung-z-flip-7-fe'),
    p('sam-zfold3-256',  'Samsung Z Fold 3 256GB',         'Samsung','Samsung','Galaxy Z',          3000000, I['samZFold3'],'1 año Samsung',  'NUEVO',    false, false, false, 'samsung-z-fold-3-256gb'),
    p('sam-a07-128',     'Samsung A07 128GB',              'Samsung','Samsung','Galaxy A',           450000, I['samA07'],  '1 año Samsung',  'NUEVO',    true,  false, false, 'samsung-a07-128gb'),
    p('sam-a17-128',     'Samsung A17 128GB',              'Samsung','Samsung','Galaxy A',           650000, I['samA17'],  '1 año Samsung',  'NUEVO',    true,  false, false, 'samsung-a17-128gb'),
    p('sam-a56-256',     'Samsung A56 256GB',              'Samsung','Samsung','Galaxy A',          1350000, I['samA56'],  '1 año Samsung',  'NUEVO',    true,  true,  false, 'samsung-a56-256gb'),
    p('sam-char45',      'Samsung Cargador 45W Original',  'Samsung','Accesorios','Cargadores',      80000, I['samChar45'],'1 año Samsung',  'ACCESORIO',true,  false, false, 'samsung-cargador-45w'),
    p('sam-char25',      'Samsung Cargador 25W Original',  'Samsung','Accesorios','Cargadores',      50000, I['samChar25'],'1 año Samsung',  'ACCESORIO',true,  false, false, 'samsung-cargador-25w'),
    // ═══════════════════════ ANDROID OTROS ═══════════════════════
    p('redmi-note14-256','Redmi Note 14 256GB',            'Redmi',  'Android','Redmi',              650000, I['android'],     '1 año',  'NUEVO',true, false,false,'redmi-note-14-256gb'),
    p('redmi-a5',        'Redmi A5',                       'Redmi',  'Android','Redmi',              300000, I['android2'],    '1 año',  'NUEVO',true, false,false,'redmi-a5'),
    p('inf-hot60pro',    'Infinix Hot 60 Pro+',            'Infinix','Android','Infinix',             680000, I['android3'],    '1 año',  'NUEVO',true, false,false,'infinix-hot-60-pro-plus'),
    p('inf-note50pro',   'Infinix Note 50 Pro',            'Infinix','Android','Infinix',             970000, I['infinixNote'], '1 año',  'NUEVO',true, false,false,'infinix-note-50-pro'),
    p('inf-gt30',        'Infinix GT 30',                  'Infinix','Android','Infinix',            1000000, I['infinixGT'],   '1 año',  'NUEVO',true, false,false,'infinix-gt-30'),
    p('zte-v70max',      'ZTE Blade V70 Max',              'ZTE',    'Android','ZTE',                 420000, I['zteV70max'],   '1 año',  'NUEVO',true, false,false,'zte-blade-v70-max'),
    p('tecno-spark40',   'Tecno Spark 40',                 'Tecno',  'Android','Tecno',               460000, I['tecno'],       '1 año',  'NUEVO',true, false,false,'tecno-spark-40'),
    p('tecno-go3-64',    'Tecno Spark GO 3 64GB',          'Tecno',  'Android','Tecno',               305000, I['tecnoGO64'],   '1 año',  'NUEVO',true, false,false,'tecno-spark-go-3-64gb'),
    p('tecno-go3-128',   'Tecno Spark GO 3 128GB',         'Tecno',  'Android','Tecno',               350000, I['tecnoGO128'],  '1 año',  'NUEVO',true, false,false,'tecno-spark-go-3-128gb'),
    p('tecno-spark50-5g','Tecno Spark 50 5G 256GB',        'Tecno',  'Android','Tecno',               850000, I['tecno5G'],     '1 año',  'NUEVO',true, false,false,'tecno-spark-50-5g'),
    p('oppo-reno12-5g',  'Oppo Reno 12 5G',               'Oppo',   'Android','Oppo',               2200000, I['oppoReno'],    '1 año',  'NUEVO',true, false,false,'oppo-reno-12-5g'),
    p('oppo-a79',        'Oppo A79',                       'Oppo',   'Android','Oppo',                840000, I['oppoA79'],     '1 año',  'NUEVO',true, false,false,'oppo-a79'),
    p('oppo-a80',        'Oppo A80',                       'Oppo',   'Android','Oppo',                860000, I['oppoA80'],     '1 año',  'NUEVO',true, false,false,'oppo-a80'),
    p('oppo-a58',        'Oppo A58',                       'Oppo',   'Android','Oppo',                660000, I['oppoA58'],     '1 año',  'NUEVO',true, false,false,'oppo-a58'),
  ];

  // ── Imágenes extra por categoría para la galería del detalle ──
  private readonly imgExtras: Record<string, string[]> = {
    iPhone: [
      UN + '1510557880182-3d4d3cba35a5?w=600&q=80',
      UN + '1511707171634-5f897ff02aa9?w=600&q=80',
      C  + '16_9.webp?v=1747334811',
      C  + '17_pro_max_1.png?v=1767106364',
    ],
    Mac: [
      UN + '1517336714731-489689fd1ca8?w=600&q=80',
      UN + '1611186871525-cd9d5e99b23a?w=600&q=80',
      UN + '1496181133206-80ce9b88a853?w=600&q=80',
      UN + '1603302529923-2c0ec7ec0451?w=600&q=80',
    ],
    iPad: [
      UN + '1544244015-0df4b3ffc6b0?w=600&q=80',
      UN + '1588872657578-7efd1f1555ed?w=600&q=80',
      UN + '1561154464-02ce557b5f1a?w=600&q=80',
      UN + '1510557880182-3d4d3cba35a5?w=600&q=80',
    ],
    Watch: [
      UN + '1579586337278-3befd40fd17a?w=600&q=80',
      UN + '1546868871-7041f2a55e12?w=600&q=80',
      UN + '1523275335684-37898b6baf30?w=600&q=80',
      UN + '1434494878577-86c23bcb06b9?w=600&q=80',
    ],
    AirPods: [
      UN + '1600294037681-c80b4cb5b434?w=600&q=80',
      UN + '1510557880182-3d4d3cba35a5?w=600&q=80',
    ],
    Samsung: [
      C  + 's25ultra.webp?v=1751993291',
      C  + 'S26ULTRAPNG.png?v=1772545758',
      UN + '1610945415295-d9bbf067e59c?w=600&q=80',
    ],
    Android: [
      WK + 'f/f2/Redmi_13_Product_photography_09.jpg/500px-Redmi_13_Product_photography_09.jpg',
      WK + '8/81/Infinix_Note_50_Pro_4G.jpg/500px-Infinix_Note_50_Pro_4G.jpg',
      WK + 'b/b2/Oppo_Find_X7_Ultra.jpg/500px-Oppo_Find_X7_Ultra.jpg',
      UN + '1511707171634-5f897ff02aa9?w=600&q=80',
    ],
    Exhibición: [
      C  + '16_9.webp?v=1747334811',
      C  + '15todos.webp?v=1734530451',
      UN + '1510557880182-3d4d3cba35a5?w=600&q=80',
      UN + '1511707171634-5f897ff02aa9?w=600&q=80',
    ],
    Accesorios: [
      UN + '1605773527852-c546a8584ea3?w=600&q=80',
      UN + '1583863788434-41f6b11b0b9e?w=600&q=80',
      UN + '1544244015-0df4b3ffc6b0?w=600&q=80',
    ],
    Patinetas: [
      W + 'tienda.segway.center/wp-content/uploads/2025/06/E2-PLUS-II-segway-center.png',
      W + 'tienda.segway.center/wp-content/uploads/2025/06/E3-PRO-segway-center.png',
      W + 'tienda.segway.center/wp-content/uploads/2025/11/C2PRO-SEGWAY-CENTER.jpg',
      W + 'tienda.segway.center/wp-content/uploads/2025/06/E3-PRO-segway-center1.png',
    ],
  };

  getProductos(): Producto[] { return this.productos; }

  getProductoBySlug(slug: string): Producto | undefined {
    const prod = this.productos.find(p => p.slug === slug);
    if (!prod) return undefined;
    const extras = (this.imgExtras[prod.categoria] ?? [])
      .map(url => this.proxifyImageUrl(url))
      .filter(url => url !== prod.imagen);
    return { ...prod, imagenes: [prod.imagen, ...extras] };
  }

  getDestacados(): Producto[] {
    return this.productos.filter(p => p.destacado);
  }

  getNuevos(): Producto[] {
    return this.productos.filter(p => p.nuevo && !p.agotado);
  }

  getPorCategoria(categoria: string): Producto[] {
    if (categoria === 'Todos') return this.productos;
    if (categoria === 'Nuevo') return this.getNuevos();
    // Filtro por marca (Apple engloba todas sus categorías; Android sub-marcas)
    const byMarca = ['Apple','Redmi','Infinix','ZTE','Tecno','Oppo','Motorola','Huawei','Segway'];
    if (byMarca.includes(categoria)) return this.productos.filter(p => p.marca === categoria);
    // Samsung ya tiene categoria='Samsung' pero también funciona por marca
    if (categoria === 'Samsung') return this.productos.filter(p => p.marca === 'Samsung');
    return this.productos.filter(p => p.categoria === categoria);
  }

  getCategorias(): string[] {
    return [...new Set(this.productos.map(p => p.categoria))];
  }

  getConteo(categoria: string): number {
    return this.getPorCategoria(categoria).length;
  }
}
