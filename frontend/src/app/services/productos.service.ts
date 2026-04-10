import { Injectable } from '@angular/core';

export interface ProductoVariante {
  storage?: string;
  color?: string;
  precio: number;
  stock: number;
}

export interface Producto {
  id: string;
  nombre: string;
  marca: string;
  categoria: string;
  subcategoria: string;
  precio: number;
  precioOriginal?: number;
  imagen: string;
  imagenes: string[];
  descripcion: string;
  specs: { label: string; value: string }[];
  variantes?: ProductoVariante[];
  garantia: string;
  badge?: string;
  destacado: boolean;
  nuevo: boolean;
  oferta: boolean;
  slug: string;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private productos: Producto[] = [
    // ===== IPHONES NUEVOS =====
    {
      id: 'iph17-256', nombre: 'iPhone 17 256GB', marca: 'Apple', categoria: 'iPhone',
      subcategoria: 'iPhone Nuevos', precio: 3550000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-17-finish-select-202509-6-9inch_GEO_CO?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-17-finish-select-202509-6-9inch_GEO_CO?wid=800'],
      descripcion: 'iPhone 17 con chip A19, cámara de 48MP, pantalla Super Retina XDR de 6.1 pulgadas. Sim Física con 1 año de garantía Apple.',
      specs: [{ label: 'Almacenamiento', value: '256GB' }, { label: 'Pantalla', value: '6.1" Super Retina XDR' }, { label: 'Chip', value: 'A19 Bionic' }, { label: 'Cámara', value: '48MP' }, { label: 'Garantía', value: '1 año Apple' }],
      garantia: '1 año Apple', badge: 'NUEVO', destacado: true, nuevo: true, oferta: false,
      slug: 'iphone-17-256gb',
      variantes: [{ storage: '256GB - Sim Física - 1 Año garantía', precio: 3550000, stock: 5 }, { storage: '256GB - Activos 11 meses garantía', precio: 3350000, stock: 3 }]
    },
    {
      id: 'iph17pro-256', nombre: 'iPhone 17 Pro 256GB', marca: 'Apple', categoria: 'iPhone',
      subcategoria: 'iPhone Nuevos', precio: 4800000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-3inch_GEO_CO?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-3inch_GEO_CO?wid=800'],
      descripcion: 'iPhone 17 Pro con chip A19 Pro, sistema de cámara Pro de 48MP, pantalla ProMotion de 6.3 pulgadas. Color Naranja. Pago en efectivo.',
      specs: [{ label: 'Almacenamiento', value: '256GB' }, { label: 'Pantalla', value: '6.3" ProMotion' }, { label: 'Chip', value: 'A19 Pro' }, { label: 'Cámara', value: '48MP Triple' }, { label: 'Color', value: 'Naranja' }],
      garantia: '1 año Apple', badge: 'NUEVO', destacado: true, nuevo: true, oferta: false,
      slug: 'iphone-17-pro-256gb',
      variantes: [{ storage: '256GB Naranja - Efectivo', precio: 4800000, stock: 2 }]
    },
    {
      id: 'iph17promax-256', nombre: 'iPhone 17 Pro Max 256GB', marca: 'Apple', categoria: 'iPhone',
      subcategoria: 'iPhone Nuevos', precio: 5350000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch_GEO_CO?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-17-pro-finish-select-202509-6-9inch_GEO_CO?wid=800'],
      descripcion: 'iPhone 17 Pro Max, la experiencia iPhone más avanzada. Pantalla de 6.9 pulgadas, chip A19 Pro.',
      specs: [{ label: 'Almacenamiento', value: '256GB / 2TB' }, { label: 'Pantalla', value: '6.9" ProMotion' }, { label: 'Chip', value: 'A19 Pro' }, { label: 'Batería', value: 'Mayor batería' }],
      garantia: '1 año Apple', badge: 'NUEVO', destacado: true, nuevo: true, oferta: false,
      slug: 'iphone-17-pro-max-256gb',
      variantes: [{ storage: '256GB Naranja', precio: 5350000, stock: 3 }, { storage: '256GB Azul', precio: 5350000, stock: 2 }, { storage: '256GB Blanco', precio: 5350000, stock: 2 }, { storage: '2TB', precio: 8500000, stock: 1 }]
    },
    {
      id: 'iph16-128', nombre: 'iPhone 16 128GB', marca: 'Apple', categoria: 'iPhone',
      subcategoria: 'iPhone Nuevos', precio: 2650000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch_GEO_CO?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-finish-select-202409-6-1inch_GEO_CO?wid=800'],
      descripcion: 'iPhone 16 con chip A18, botón de Acción y botón Control de Cámara. Sim Física con garantía Apple.',
      specs: [{ label: 'Almacenamiento', value: '128GB' }, { label: 'Pantalla', value: '6.1" Super Retina XDR' }, { label: 'Chip', value: 'A18' }, { label: 'Cámara', value: '48MP Fusion' }],
      garantia: '11 meses', badge: 'NUEVO', destacado: true, nuevo: true, oferta: false,
      slug: 'iphone-16-128gb',
      variantes: [{ storage: '128GB SIM Física - 11 meses garantía', precio: 2650000, stock: 5 }, { storage: '128GB - 1 Año garantía', precio: 2750000, stock: 3 }]
    },
    {
      id: 'iph16promax-256', nombre: 'iPhone 16 Pro Max 256GB', marca: 'Apple', categoria: 'iPhone',
      subcategoria: 'iPhone Nuevos', precio: 4700000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch_GEO_CO?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-16-pro-finish-select-202409-6-9inch_GEO_CO?wid=800'],
      descripcion: 'iPhone 16 Pro Max con pantalla de 6.9 pulgadas, chip A18 Pro y sistema de cámara Pro.',
      specs: [{ label: 'Almacenamiento', value: '256GB' }, { label: 'Pantalla', value: '6.9" ProMotion' }, { label: 'Chip', value: 'A18 Pro' }],
      garantia: '1 año Apple', badge: 'NUEVO', destacado: false, nuevo: true, oferta: false,
      slug: 'iphone-16-pro-max-256gb',
      variantes: [{ storage: '256GB', precio: 4700000, stock: 3 }]
    },
    {
      id: 'iph15-128', nombre: 'iPhone 15 128GB', marca: 'Apple', categoria: 'iPhone',
      subcategoria: 'iPhone Nuevos', precio: 2400000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-pink?wid=800'],
      descripcion: 'iPhone 15 con Dynamic Island, cámara principal de 48MP y conector USB-C.',
      specs: [{ label: 'Almacenamiento', value: '128GB / 512GB' }, { label: 'Pantalla', value: '6.1" Super Retina XDR' }, { label: 'Chip', value: 'A16 Bionic' }, { label: 'Cámara', value: '48MP' }],
      garantia: '1 año Apple', badge: 'NUEVO', destacado: true, nuevo: false, oferta: false,
      slug: 'iphone-15-128gb',
      variantes: [{ storage: '128GB', precio: 2400000, stock: 4 }, { storage: '512GB', precio: 2750000, stock: 2 }]
    },
    {
      id: 'iph13-128', nombre: 'iPhone 13 128GB', marca: 'Apple', categoria: 'iPhone',
      subcategoria: 'iPhone Nuevos', precio: 2000000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pink-select-2021?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-pink-select-2021?wid=800'],
      descripcion: 'iPhone 13 con chip A15 Bionic, sistema de cámara dual de 12MP y pantalla Super Retina XDR.',
      specs: [{ label: 'Almacenamiento', value: '128GB' }, { label: 'Pantalla', value: '6.1" Super Retina XDR' }, { label: 'Chip', value: 'A15 Bionic' }],
      garantia: '1 año', badge: 'NUEVO', destacado: false, nuevo: false, oferta: true,
      slug: 'iphone-13-128gb',
      variantes: [{ storage: '128GB', precio: 2000000, stock: 5 }]
    },
    // ===== IPHONES CPO =====
    {
      id: 'iph15promax-512-cpo', nombre: 'iPhone 15 Pro Max 512GB CPO', marca: 'Apple', categoria: 'iPhone',
      subcategoria: 'iPhone CPO', precio: 3700000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=800'],
      descripcion: 'iPhone 15 Pro Max CPO certificado. 6 meses de garantía. Equipo probado 100% funcional.',
      specs: [{ label: 'Almacenamiento', value: '512GB' }, { label: 'Pantalla', value: '6.7" ProMotion' }, { label: 'Chip', value: 'A17 Pro' }, { label: 'Garantía', value: '6 meses' }],
      garantia: '6 meses', badge: 'CPO', destacado: true, nuevo: false, oferta: true,
      slug: 'iphone-15-pro-max-512gb-cpo',
      variantes: [{ storage: '512GB', precio: 3700000, stock: 2 }, { storage: '1TB', precio: 3800000, stock: 1 }]
    },
    {
      id: 'iph12-128-cpo', nombre: 'iPhone 12 128GB CPO', marca: 'Apple', categoria: 'iPhone',
      subcategoria: 'iPhone CPO', precio: 1400000,
      imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-blue-select-2020?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-12-blue-select-2020?wid=800'],
      descripcion: 'iPhone 12 CPO certificado. 6 meses de garantía. Equipo probado 100% funcional.',
      specs: [{ label: 'Almacenamiento', value: '128GB' }, { label: 'Pantalla', value: '6.1" Super Retina XDR' }, { label: 'Chip', value: 'A14 Bionic' }],
      garantia: '6 meses', badge: 'CPO', destacado: false, nuevo: false, oferta: true,
      slug: 'iphone-12-128gb-cpo',
      variantes: [{ storage: '128GB', precio: 1400000, stock: 3 }]
    },
    // ===== MACBOOKS =====
    {
      id: 'mbpro14-m5-512', nombre: 'MacBook Pro 14" M5 512GB', marca: 'Apple', categoria: 'Mac',
      subcategoria: 'MacBook Pro', precio: 6200000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202410?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp14-spaceblack-select-202410?wid=800'],
      descripcion: 'MacBook Pro 14 pulgadas con chip M5. Rendimiento profesional excepcional, pantalla Liquid Retina XDR.',
      specs: [{ label: 'Chip', value: 'Apple M5' }, { label: 'Almacenamiento', value: '512GB / 1TB' }, { label: 'Pantalla', value: '14.2" Liquid Retina XDR' }, { label: 'RAM', value: '16GB' }],
      garantia: '1 año Apple', badge: 'NUEVO', destacado: true, nuevo: true, oferta: false,
      slug: 'macbook-pro-14-m5-512gb',
      variantes: [{ storage: '512GB', precio: 6200000, stock: 2 }, { storage: '1TB', precio: 7000000, stock: 1 }]
    },
    {
      id: 'mbair-m4-512', nombre: 'MacBook Air M4 512GB', marca: 'Apple', categoria: 'Mac',
      subcategoria: 'MacBook Air', precio: 4500000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=800'],
      descripcion: 'MacBook Air con chip M4. El portátil más delgado y ligero de Apple con batería de hasta 18 horas.',
      specs: [{ label: 'Chip', value: 'Apple M4' }, { label: 'Almacenamiento', value: '512GB' }, { label: 'Pantalla', value: '13.6" Liquid Retina' }, { label: 'RAM', value: '16GB' }],
      garantia: '1 año Apple', badge: 'NUEVO', destacado: true, nuevo: true, oferta: false,
      slug: 'macbook-air-m4-512gb',
      variantes: [{ storage: '512GB 13"', precio: 4500000, stock: 3 }, { storage: '256GB 15"', precio: 4500000, stock: 2 }]
    },
    {
      id: 'mbair-m1-256', nombre: 'MacBook Air M1 256GB', marca: 'Apple', categoria: 'Mac',
      subcategoria: 'MacBook Air', precio: 2750000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-gold-select-202005?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-gold-select-202005?wid=800'],
      descripcion: 'MacBook Air con chip M1. Rendimiento revolucionario con batería de hasta 18 horas.',
      specs: [{ label: 'Chip', value: 'Apple M1' }, { label: 'Almacenamiento', value: '256GB' }, { label: 'Pantalla', value: '13.3" Retina' }, { label: 'RAM', value: '8GB' }],
      garantia: '1 año Apple', badge: 'OFERTA', destacado: false, nuevo: false, oferta: true,
      slug: 'macbook-air-m1-256gb',
      variantes: [{ storage: '256GB', precio: 2750000, stock: 2 }]
    },
    // ===== IPADS =====
    {
      id: 'ipad-a16-128', nombre: 'iPad A16 128GB', marca: 'Apple', categoria: 'iPad',
      subcategoria: 'iPad', precio: 1400000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue-wifi_AV1?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue-wifi_AV1?wid=800'],
      descripcion: 'iPad con chip A16, pantalla Liquid Retina de 10.9 pulgadas. Compatible con Apple Pencil.',
      specs: [{ label: 'Chip', value: 'A16' }, { label: 'Almacenamiento', value: '128GB' }, { label: 'Pantalla', value: '10.9" Liquid Retina' }],
      garantia: '1 año Apple', badge: 'NUEVO', destacado: true, nuevo: true, oferta: false,
      slug: 'ipad-a16-128gb',
      variantes: [{ storage: '128GB WiFi', precio: 1400000, stock: 4 }]
    },
    {
      id: 'ipadpro13-m5-256', nombre: 'iPad Pro 13" M5 256GB', marca: 'Apple', categoria: 'iPad',
      subcategoria: 'iPad Pro', precio: 4900000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202405?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-13-select-wifi-spacegray-202405?wid=800'],
      descripcion: 'iPad Pro 13 pulgadas con chip M5, pantalla Ultra Retina XDR y soporte Apple Pencil Pro.',
      specs: [{ label: 'Chip', value: 'Apple M5' }, { label: 'Almacenamiento', value: '256GB' }, { label: 'Pantalla', value: '13" Ultra Retina XDR' }],
      garantia: '1 año Apple', badge: 'NUEVO', destacado: false, nuevo: true, oferta: false,
      slug: 'ipad-pro-13-m5-256gb',
      variantes: [{ storage: '256GB', precio: 4900000, stock: 2 }]
    },
    // ===== APPLE WATCH =====
    {
      id: 'aw-s11-42-rosa', nombre: 'Apple Watch Serie 11 42mm Rosa', marca: 'Apple', categoria: 'Watch',
      subcategoria: 'Apple Watch', precio: 1550000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s10-hero-select-202409_GEO_CO?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s10-hero-select-202409_GEO_CO?wid=800'],
      descripcion: 'Apple Watch Serie 11 de 42mm en color Rosa. Monitoreo de salud avanzado y GPS.',
      specs: [{ label: 'Caja', value: '42mm' }, { label: 'Color', value: 'Rosa' }, { label: 'Conectividad', value: 'GPS' }],
      garantia: '1 año Apple', badge: 'NUEVO', destacado: true, nuevo: true, oferta: false,
      slug: 'apple-watch-serie-11-42mm-rosa',
      variantes: [{ storage: '42mm Rosa GPS', precio: 1550000, stock: 3 }, { storage: '46mm GPS', precio: 1600000, stock: 2 }]
    },
    {
      id: 'aw-ultra3-negro', nombre: 'Apple Watch Ultra 3 Negro', marca: 'Apple', categoria: 'Watch',
      subcategoria: 'Apple Watch Ultra', precio: 2950000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra-2-hero-select-202309_GEO_CO?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-ultra-2-hero-select-202309_GEO_CO?wid=800'],
      descripcion: 'Apple Watch Ultra 3, el más resistente y capaz. Titanio negro, batería de hasta 60 horas.',
      specs: [{ label: 'Caja', value: '49mm Titanio' }, { label: 'Color', value: 'Negro' }, { label: 'Batería', value: 'Hasta 60 horas' }],
      garantia: '1 año Apple', badge: 'NUEVO', destacado: true, nuevo: true, oferta: false,
      slug: 'apple-watch-ultra-3-negro',
      variantes: [{ storage: 'Negro', precio: 2950000, stock: 2 }, { storage: 'Manilla Metálica', precio: 3100000, stock: 1 }]
    },
    // ===== AIRPODS =====
    {
      id: 'airpods-pro3', nombre: 'AirPods Pro 3 Original', marca: 'Apple', categoria: 'AirPods',
      subcategoria: 'AirPods', precio: 1200000, imagen: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-hero-select-202409_GEO_CO?wid=400',
      imagenes: ['https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/airpods-pro-2-hero-select-202409_GEO_CO?wid=800'],
      descripcion: 'AirPods Pro 3 originales con cancelación activa de ruido y audio espacial personalizado.',
      specs: [{ label: 'Tipo', value: 'In-ear' }, { label: 'ANC', value: 'Sí' }, { label: 'Batería', value: '6 horas' }],
      garantia: '1 año Apple', badge: 'ORIGINAL', destacado: true, nuevo: true, oferta: false,
      slug: 'airpods-pro-3-original',
      variantes: [{ storage: 'Original', precio: 1200000, stock: 5 }, { storage: 'Réplica Pro 2', precio: 60000, stock: 10 }, { storage: 'Réplica Serie 4', precio: 60000, stock: 10 }]
    },
    // ===== SAMSUNG =====
    {
      id: 'sam-s26ultra-512', nombre: 'Samsung S26 Ultra 512GB', marca: 'Samsung', categoria: 'Android',
      subcategoria: 'Samsung', precio: 5100000, imagen: 'https://images.samsung.com/is/image/samsung/p6pim/co/2501/gallery/co-galaxy-s25-ultra-sm-s938-sm-s938bzekeoo-543227438?$650_519_PNG$',
      imagenes: ['https://images.samsung.com/is/image/samsung/p6pim/co/2501/gallery/co-galaxy-s25-ultra-sm-s938-sm-s938bzekeoo-543227438?$650_519_PNG$'],
      descripcion: 'Samsung Galaxy S26 Ultra con S Pen integrado, cámara de 200MP y chip Snapdragon de última generación.',
      specs: [{ label: 'Almacenamiento', value: '512GB' }, { label: 'Pantalla', value: '6.9" Dynamic AMOLED' }, { label: 'Cámara', value: '200MP' }, { label: 'RAM', value: '12GB' }],
      garantia: '1 año Samsung', badge: 'NUEVO', destacado: true, nuevo: true, oferta: false,
      slug: 'samsung-s26-ultra-512gb',
      variantes: [{ storage: '512GB', precio: 5100000, stock: 3 }]
    },
    {
      id: 'sam-zflip7fe', nombre: 'Samsung Z Flip 7 FE', marca: 'Samsung', categoria: 'Android',
      subcategoria: 'Samsung', precio: 2950000, imagen: 'https://images.samsung.com/is/image/samsung/p6pim/co/feature/195282540/co-feature-galaxy-z-flip6-highlight-527322282?$FB_TYPE_A_JPG$',
      imagenes: ['https://images.samsung.com/is/image/samsung/p6pim/co/feature/195282540/co-feature-galaxy-z-flip6-highlight-527322282?$FB_TYPE_A_JPG$'],
      descripcion: 'Samsung Galaxy Z Flip 7 FE, teléfono plegable compacto con pantalla Flex de 6.7 pulgadas.',
      specs: [{ label: 'Pantalla', value: '6.7" Flex AMOLED' }, { label: 'Tipo', value: 'Plegable' }, { label: 'Cámara', value: '50MP' }],
      garantia: '1 año Samsung', badge: 'NUEVO', destacado: true, nuevo: true, oferta: false,
      slug: 'samsung-z-flip-7-fe',
      variantes: [{ storage: 'Z Flip 7 FE', precio: 2950000, stock: 2 }]
    },
    {
      id: 'sam-a56-256', nombre: 'Samsung A56 256GB', marca: 'Samsung', categoria: 'Android',
      subcategoria: 'Samsung', precio: 1350000, imagen: 'https://images.samsung.com/is/image/samsung/p6pim/co/sm-a556ezaecoo/gallery/co-galaxy-a55-5g-sm-a556-498490-sm-a556ezaecoo-540299218?$650_519_PNG$',
      imagenes: ['https://images.samsung.com/is/image/samsung/p6pim/co/sm-a556ezaecoo/gallery/co-galaxy-a55-5g-sm-a556-498490-sm-a556ezaecoo-540299218?$650_519_PNG$'],
      descripcion: 'Samsung Galaxy A56 con pantalla Super AMOLED de 6.7 pulgadas y cámara de 50MP.',
      specs: [{ label: 'Almacenamiento', value: '256GB' }, { label: 'Pantalla', value: '6.7" Super AMOLED' }, { label: 'Cámara', value: '50MP' }],
      garantia: '1 año Samsung', badge: 'NUEVO', destacado: false, nuevo: true, oferta: true,
      slug: 'samsung-a56-256gb',
      variantes: [{ storage: '256GB', precio: 1350000, stock: 5 }]
    },
    // ===== PATINETAS =====
    {
      id: 'segway-es2', nombre: 'Patineta SEGWAY ES2', marca: 'SEGWAY', categoria: 'Accesorios',
      subcategoria: 'Patinetas', precio: 1380000, imagen: 'https://segway.com/wp-content/uploads/2021/10/es2-1.jpg',
      imagenes: ['https://segway.com/wp-content/uploads/2021/10/es2-1.jpg'],
      descripcion: 'Patineta eléctrica SEGWAY ES2. Velocidad máxima 25km/h, autonomía 25km, peso máximo 100kg.',
      specs: [{ label: 'Velocidad', value: '25 km/h' }, { label: 'Autonomía', value: '25 km' }, { label: 'Peso máx', value: '100 kg' }, { label: 'Motor', value: '300W' }],
      garantia: '6 meses', badge: 'PROMO', destacado: false, nuevo: false, oferta: true,
      slug: 'patineta-segway-es2',
      variantes: [{ storage: 'ES2', precio: 1380000, stock: 3 }, { storage: 'ES3', precio: 1430000, stock: 2 }, { storage: 'E2', precio: 1500000, stock: 2 }, { storage: 'C2 PRO', precio: 1080000, stock: 4 }]
    }
  ];

  getProductos(): Producto[] { return this.productos; }

  getProductoBySlug(slug: string): Producto | undefined {
    return this.productos.find(p => p.slug === slug);
  }

  getDestacados(): Producto[] {
    return this.productos.filter(p => p.destacado).slice(0, 8);
  }

  getPorCategoria(categoria: string): Producto[] {
    return this.productos.filter(p => p.categoria === categoria);
  }

  getCategorias(): string[] {
    return [...new Set(this.productos.map(p => p.categoria))];
  }
}
