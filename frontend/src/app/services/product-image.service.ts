import { Injectable } from '@angular/core';
import { UnsplashService } from './unsplash.service';

/**
 * Sistema de imágenes por capas para productos y marcas de OutilTech.
 *
 * Prioridad (de mayor a menor calidad):
 *  1. Imagen actual del producto si ya es válida (celudmovil CDN, Unsplash estático)
 *  2. Wikipedia Commons  — paths verificados, sin hotlink protection
 *  3. Unsplash API       — búsqueda específica por modelo y marca
 *  4. Fallback genérico  — solo si todo lo demás falla
 *
 * NOTA: No se hacen peticiones HEAD para verificar URLs porque CORS en modo no-cors
 * siempre devuelve status 0 y no permite distinguir 200 de 404.
 * Los paths de Wikipedia son verificados estáticamente, no generados dinámicamente.
 */
@Injectable({ providedIn: 'root' })
export class ProductImageService {

  private cache = new Map<string, string>();
  // Solicitudes en vuelo para evitar duplicados
  private pending = new Map<string, Promise<string>>();

  private readonly WK = 'https://upload.wikimedia.org/wikipedia/commons/thumb/';
  private readonly FALLBACK = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80';

  // ── Tabla de URLs directas por modelo exacto (Falabella CDN o Wikipedia) ────
  // Las imágenes de Falabella son fotos reales verificadas del producto.
  // Las de Wikipedia son la imagen más cercana disponible en Commons.
  private readonly modelMap: Record<string, string | { direct: string }> = {
    // Redmi — Falabella Colombia CDN
    'Redmi Note 14 256GB': { direct: 'https://media.falabella.com.co/falabellaCO/140207192_01/width=400,height=400,quality=80,format=webp,fit=pad' },
    'Redmi A5':            { direct: 'https://media.falabella.com.co/falabellaCO/143032459_01/width=400,height=400,quality=80,format=webp,fit=pad' },
    // Infinix — Falabella Colombia CDN
    'Infinix Hot 60 Pro+': { direct: 'https://media.falabella.com.co/falabellaCO/73378495_1/width=400,height=400,quality=80,format=webp,fit=pad' },
    'Infinix Note 50 Pro': { direct: 'https://media.falabella.com.co/falabellaCO/148118246_01/width=400,height=400,quality=80,format=webp,fit=pad' },
    'Infinix GT 30':       { direct: 'https://media.falabella.com.co/falabellaCO/73448846_1/width=400,height=400,quality=80,format=webp,fit=pad' },
    // ZTE — Falabella Colombia CDN
    'ZTE Blade V70 Max':   { direct: 'https://media.falabella.com.co/falabellaCO/151099079_01/width=400,height=400,quality=80,format=webp,fit=pad' },
    // Tecno — Falabella Colombia CDN
    'Tecno Spark 40':         { direct: 'https://media.falabella.com.co/falabellaCO/147860655_01/width=400,height=400,quality=80,format=webp,fit=pad' },
    'Tecno Spark GO 3 64GB':  { direct: 'https://media.falabella.com.co/falabellaCO/152106393_01/width=400,height=400,quality=80,format=webp,fit=pad' },
    'Tecno Spark GO 3 128GB': { direct: 'https://media.falabella.com.co/falabellaCO/152106929_01/width=400,height=400,quality=80,format=webp,fit=pad' },
    'Tecno Spark 50 5G 256GB':{ direct: 'https://media.falabella.com.co/falabellaCO/152339168_01/width=400,height=400,quality=80,format=webp,fit=pad' },
    // Oppo — Reno 12 desde Falabella; A-series desde Wikipedia (A78 misma generación)
    'Oppo Reno 12 5G': { direct: 'https://media.falabella.com.co/falabellaCO/144473297_01/width=400,height=400,quality=80,format=webp,fit=pad' },
    'Oppo A79': '8/87/Oppo_A78.jpg/400px-Oppo_A78.jpg',
    'Oppo A80': '8/87/Oppo_A78.jpg/400px-Oppo_A78.jpg',
    'Oppo A58': '8/87/Oppo_A78.jpg/400px-Oppo_A78.jpg',
  };

  // ── Tabla de fallback por marca (cuando no hay match exacto por modelo) ─────
  private readonly brandMap: Record<string, string> = {
    Redmi:    'f/f2/Redmi_13_Product_photography_09.jpg/400px-Redmi_13_Product_photography_09.jpg',
    Infinix:  '8/81/Infinix_Note_50_Pro_4G.jpg/400px-Infinix_Note_50_Pro_4G.jpg',
    ZTE:      'e/e0/5G_phone_-_ZTE_Axon_10_Pro_5G_%282%29.jpg/400px-5G_phone_-_ZTE_Axon_10_Pro_5G_%282%29.jpg',
    Tecno:    '1/17/Tecno_Spark_20.png/400px-Tecno_Spark_20.png',
    Oppo:     '8/87/Oppo_A78.jpg/400px-Oppo_A78.jpg',
    Motorola: '0/0e/Motorola_Edge_50_Neo.jpg/400px-Motorola_Edge_50_Neo.jpg',
    Huawei:   '6/6d/Huawei_Pura_80_Pro_Glazed_Red.jpg/400px-Huawei_Pura_80_Pro_Glazed_Red.jpg',
    Segway:   '9/9e/Black_x2_and_white_i2.jpg/400px-Black_x2_and_white_i2.jpg',
    Android:  'a/a4/Android_2023_3D_logo_and_wordmark.svg/330px-Android_2023_3D_logo_and_wordmark.svg.png',
  };

  constructor(private unsplash: UnsplashService) {}

  /**
   * Devuelve la mejor imagen disponible para un producto.
   * Respeta la imagen actual si ya es válida (no genérica).
   */
  async getBestImage(product: { nombre: string; marca: string; imagen?: string }): Promise<string> {
    const key = `${product.marca}|${product.nombre}`;
    if (this.cache.has(key)) return this.cache.get(key)!;
    if (this.pending.has(key)) return this.pending.get(key)!;

    const promise = this._resolve(product);
    this.pending.set(key, promise);
    const url = await promise;
    this.pending.delete(key);
    this.cache.set(key, url);
    return url;
  }

  /**
   * Devuelve la mejor URL disponible para una marca/modelo.
   * Primero busca en modelMap (Falabella CDN o Wikipedia por modelo exacto),
   * luego en brandMap (Wikipedia fallback por marca).
   * Null si no hay entrada.
   */
  getModelUrl(marca: string, nombre?: string): string | null {
    if (nombre) {
      const entry = this.modelMap[nombre];
      if (entry) {
        if (typeof entry === 'object' && 'direct' in entry) return entry.direct;
        return this.WK + entry;
      }
    }
    if (this.brandMap[marca]) return this.WK + this.brandMap[marca];
    return null;
  }

  /** @deprecated Use getModelUrl instead */
  getWikipediaUrl(marca: string, nombre?: string): string | null {
    return this.getModelUrl(marca, nombre);
  }

  /** Devuelve true si la URL es una de las imágenes genéricas conocidas */
  isGenericUrl(url: string): boolean {
    const GENERIC_FRAGMENTS = [
      '1598327105666-5b89351aff97',  // celular blanco de Unsplash
      '1511707171634-5f897ff02aa9',  // otro genérico
    ];
    return GENERIC_FRAGMENTS.some(f => url.includes(f));
  }

  private async _resolve(product: { nombre: string; marca: string; imagen?: string }): Promise<string> {
    // Capa 1: imagen actual si ya es válida (celudmovil CDN, Wikipedia, Unsplash específico)
    if (product.imagen
      && !this.isGenericUrl(product.imagen)
      && !product.imagen.includes('fdn2.gsmarena.com')) {
      return product.imagen;
    }

    // Capa 2: Falabella CDN o Wikipedia Commons según modelMap
    const modelUrl = this.getModelUrl(product.marca, product.nombre);
    if (modelUrl) {
      console.log(`📸 [${product.nombre}] CDN verificado`);
      return modelUrl;
    }

    // Capa 3: Unsplash API con query específica
    try {
      const unsplashUrl = await this.unsplash.getImageUrlForProduct(product.nombre, product.marca);
      if (unsplashUrl && !this.isGenericUrl(unsplashUrl)) {
        console.log(`📸 [${product.nombre}] Unsplash API`);
        return unsplashUrl;
      }
    } catch (e) {
      console.warn('[ProductImageService] Unsplash falló para', product.nombre);
    }

    // Capa 4: Fallback genérico
    console.warn(`⚠️ [${product.nombre}] Sin imagen específica → fallback genérico`);
    return this.FALLBACK;
  }
}
