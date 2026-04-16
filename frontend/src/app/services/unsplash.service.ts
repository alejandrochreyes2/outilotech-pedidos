import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UnsplashService {
  private readonly accessKey = 'UHfIeUzyoKsYkyjdpQ6EblZNvx2hIM-WOzdTMyOyWYA';
  // Foto genérica que Unsplash devuelve cuando no hay resultados relevantes — la evitamos
  private readonly GENERIC_IDS = ['1598327105666-5b89351aff97', '1511707171634-5f897ff02aa9'];
  private readonly FALLBACK = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80';
  private cache = new Map<string, string>();

  // Queries muy específicas por marca para resultados de Unsplash más precisos
  private readonly brandQueries: Record<string, string> = {
    Redmi:     'Xiaomi Redmi Note smartphone black',
    Infinix:   'Infinix Note smartphone android budget',
    ZTE:       'ZTE Axon 5G smartphone',
    Tecno:     'Tecno Spark smartphone colorful',
    Oppo:      'Oppo Find Reno smartphone photography',
    Motorola:  'Motorola Edge 5G smartphone',
    Huawei:    'Huawei Pura Pro smartphone',
    Android:   'Android smartphone screen dark',
    Accesorios:'phone charger cable accessories tech',
    Exhibición:'used smartphone display store shelf',
    Patinetas: 'electric scooter urban city transport',
  };

  async getImageUrlForBrand(brand: string): Promise<string> {
    const cacheKey = `brand_${brand}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)!;

    const query = this.brandQueries[brand] ?? `${brand} flagship smartphone 2024`;
    const result = await this._fetchPhoto(query);
    this.cache.set(cacheKey, result);
    return result;
  }

  /** Busca imagen específica para un producto por nombre y marca */
  async getImageUrlForProduct(productName: string, brand: string): Promise<string> {
    const cacheKey = `prod_${brand}_${productName}`;
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey)!;

    // Query específica: modelo + marca + smartphone
    const query = `${brand} ${productName} smartphone official`;
    let result = await this._fetchPhoto(query);

    // Si devuelve la imagen genérica, intentar con query más simple (solo marca)
    if (this.isGeneric(result)) {
      const fallbackQuery = this.brandQueries[brand] ?? `${brand} smartphone`;
      result = await this._fetchPhoto(fallbackQuery);
    }

    this.cache.set(cacheKey, result);
    return result;
  }

  /** Precarga en paralelo todas las marcas indicadas */
  async preloadBrands(brands: string[]): Promise<string[]> {
    return Promise.all(brands.map(b => this.getImageUrlForBrand(b)));
  }

  /** Devuelve true si la URL es la imagen genérica que Unsplash da por defecto */
  isGeneric(url: string): boolean {
    return this.GENERIC_IDS.some(id => url.includes(id));
  }

  private async _fetchPhoto(query: string): Promise<string> {
    const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=squarish`;
    try {
      const response = await fetch(apiUrl, {
        headers: { 'Authorization': `Client-ID ${this.accessKey}` }
      });

      if (!response.ok) {
        console.warn(`[Unsplash] HTTP ${response.status} — query: "${query}"`);
        return this.FALLBACK;
      }

      const data = await response.json();
      if (data.results?.length > 0) {
        // Recorrer hasta encontrar una que no sea la genérica
        for (const photo of data.results) {
          const url: string = photo.urls.small;
          if (!this.isGeneric(url)) return url;
        }
        // Todas eran genéricas, devolver la primera de todas formas
        return data.results[0].urls.small;
      }
    } catch (error) {
      console.error(`[Unsplash] Error — query: "${query}":`, error);
    }
    return this.FALLBACK;
  }
}
