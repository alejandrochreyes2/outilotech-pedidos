import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ProductosService, Producto } from '../../services/productos.service';
import { UnsplashService } from '../../services/unsplash.service';
import { ProductImageService } from '../../services/product-image.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NavbarComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  r2BaseUrl = environment.r2VideoBaseUrl;

  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('filtrosScroll') filtrosScrollRef!: ElementRef<HTMLDivElement>;

  // ── Carrito ──────────────────────────────────────────────
  cantidades: { [key: string]: number } = {};
  getCantidad(id: string): number { return this.cantidades[id] || 1; }
  cambiarCantidad(id: string, delta: number) {
    this.cantidades[id] = Math.max(1, (this.cantidades[id] || 1) + delta);
  }
  agregarAlCarrito(producto: Producto) {
    if (producto.agotado) return;
    this.cartService.agregarItem(producto, undefined, this.getCantidad(producto.id));
  }
  formatPrecio(n: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);
  }

  // ── Hero Slider ──────────────────────────────────────────
  currentSlide = 0;
  isPlaying = true;
  private autoplayInterval: any;
  private readonly INTERVAL_MS = 6000;
  slides = [0, 1, 2, 3, 4, 5, 6, 7];

  heroProducts = [
    { id: 'macbook-hero',     brand: 'Apple',   name: 'Macbook Pro',         priceNum: 2799000, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80' },
    { id: 'macbook-m5-hero',  brand: 'Apple',   name: 'MacBook Pro M5',      priceNum: 6200000, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80' },
    { id: 'iphone-air-hero',  brand: 'Apple',   name: 'iPhone 17',           priceNum: 3550000, img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80' },
    { id: 'watch-ultra-hero', brand: 'Apple',   name: 'Apple Watch Ultra 3', priceNum: 2950000, img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80' },
    { id: 'airpods-hero',     brand: 'Apple',   name: 'AirPods Pro 3',       priceNum: 1200000, img: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500&q=80' },
    { id: 'galaxy-s26-hero',  brand: 'Samsung', name: 'Galaxy S26 Ultra',    priceNum: 5100000, img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80' },
  ];

  addHeroProduct(index: number) {
    if (index >= this.heroProducts.length) return;
    const h = this.heroProducts[index];
    const prod: any = {
      id: h.id, nombre: h.name, marca: h.brand, precio: h.priceNum,
      imagen: h.img, categoria: 'Promoción', subcategoria: '', imagenes: [h.img],
      descripcion: '', specs: [], garantia: '', destacado: false, nuevo: false, oferta: true, slug: h.id
    };
    this.cartService.agregarItem(prod, undefined, 1);
  }

  // ── Filtro de Productos ──────────────────────────────────
  filtroActivo = 'Todos';

  filtros = [
    { key: 'Todos',      label: 'Todos',       icon: '🛍️' },
    { key: 'Nuevo',      label: 'Nuevo',       icon: '🆕' },
    { key: 'Apple',      label: 'Apple',       icon: '🍎' },
    { key: 'iPhone',     label: 'iPhone',      icon: '📱' },
    { key: 'Mac',        label: 'Mac',         icon: '💻' },
    { key: 'iPad',       label: 'iPad',        icon: '📲' },
    { key: 'Watch',      label: 'Watch',       icon: '⌚' },
    { key: 'AirPods',    label: 'AirPods',     icon: '🎧' },
    { key: 'Samsung',    label: 'Samsung',     icon: '📡' },
    { key: 'Android',    label: 'Android',     icon: '🤖' },
    { key: 'Redmi',      label: 'Redmi',       icon: '📱' },
    { key: 'Infinix',    label: 'Infinix',     icon: '📱' },
    { key: 'ZTE',        label: 'ZTE',         icon: '📱' },
    { key: 'Tecno',      label: 'Tecno',       icon: '📱' },
    { key: 'Oppo',       label: 'Oppo',        icon: '📱' },
    { key: 'Motorola',   label: 'Motorola',    icon: '📱' },
    { key: 'Huawei',     label: 'Huawei',      icon: '📱' },
    { key: 'Exhibición', label: 'Exhibición',  icon: '🏪' },
    { key: 'Accesorios', label: 'Accesorios',  icon: '🔌' },
    { key: 'Patinetas',  label: 'Patinetas',   icon: '🛴' },
  ];

  // Fila 1 (índices 0-7): Apple, Samsung, iPhone, Mac, iPad, Watch, AirPods, Redmi
  // Fila 2 (índices 8-15): Infinix, ZTE, Tecno, Oppo, Motorola, Huawei, Segway, Android
  // Fila 3 (índices 16-18): Accesorios, Exhibición, Patinetas
  // NOTA: celudmovil.com.co y unsplash.com no bloquean hotlinking.
  //       GSMarena bloquea weserv.nl → se usan placehold.co con colores de marca
  //       hasta tener CDN propio o permiso de la fuente.
  readonly marcas = [
    /* ── Fila 1 ── */
    { label: 'Apple',      img: 'https://www.celudmovil.com.co/cdn/shop/files/17_pro_max_1.png?v=1767106364',                                                filtro: 'Apple' },
    { label: 'Samsung',    img: 'https://www.celudmovil.com.co/cdn/shop/files/S26ULTRAPNG.png?v=1772545758',                                                 filtro: 'Samsung' },
    { label: 'iPhone',     img: 'https://www.celudmovil.com.co/cdn/shop/files/16_9.webp?v=1747334811',                                                      filtro: 'iPhone' },
    { label: 'Mac',        img: 'https://www.celudmovil.com.co/cdn/shop/files/m5_1.png?v=1763046141',                                                       filtro: 'Mac' },
    { label: 'iPad',       img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300&q=80',                                                     filtro: 'iPad' },
    { label: 'Watch',      img: 'https://www.celudmovil.com.co/cdn/shop/files/ultra_3_2bfca2a6-17fa-471f-8441-09eb44a2add8.png?v=1765990350',               filtro: 'Watch' },
    { label: 'AirPods',    img: 'https://www.celudmovil.com.co/cdn/shop/files/prom2_48_4e50ca20-201b-46b5-8b10-51a5b8befdef.webp?v=1757533597',            filtro: 'AirPods' },
    { label: 'Redmi',      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Redmi_13_Product_photography_09.jpg/500px-Redmi_13_Product_photography_09.jpg',              filtro: 'Redmi' },
    /* ── Fila 2 ── */
    { label: 'Infinix',    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Infinix_Note_50_Pro_4G.jpg/500px-Infinix_Note_50_Pro_4G.jpg',                                    filtro: 'Infinix' },
    { label: 'ZTE',        img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/5G_phone_-_ZTE_Axon_10_Pro_5G_%282%29.jpg/500px-5G_phone_-_ZTE_Axon_10_Pro_5G_%282%29.jpg',    filtro: 'ZTE' },
    { label: 'Tecno',      img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Tecno_Spark_20.png/500px-Tecno_Spark_20.png',                                                   filtro: 'Tecno' },
    { label: 'Oppo',       img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Oppo_Find_X7_Ultra.jpg/500px-Oppo_Find_X7_Ultra.jpg',                                           filtro: 'Oppo' },
    { label: 'Motorola',   img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Motorola_Edge_50_Neo.jpg/500px-Motorola_Edge_50_Neo.jpg',                                    filtro: 'Motorola' },
    { label: 'Huawei',     img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Huawei_Pura_80_Pro_Glazed_Red.jpg/500px-Huawei_Pura_80_Pro_Glazed_Red.jpg',                    filtro: 'Huawei' },
    { label: 'Segway',     img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Black_x2_and_white_i2.jpg/500px-Black_x2_and_white_i2.jpg',                                     filtro: 'Patinetas' },
    { label: 'Android',    img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/OnePlus_Ace_3_Black.jpg/500px-OnePlus_Ace_3_Black.jpg',                                        filtro: 'Android' },
    /* ── Fila 3 ── */
    { label: 'Accesorios', img: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=300&q=80',                                                  filtro: 'Accesorios' },
    { label: 'Exhibición', img: 'https://www.celudmovil.com.co/cdn/shop/files/iphone2_990a877b-3624-4d5a-8634-63e3d2d929fd.webp?v=1696443353',             filtro: 'Exhibición' },
    { label: 'Patinetas',  img: 'https://images.weserv.nl/?url=tienda.segway.center/wp-content/uploads/2025/11/C2PRO-SEGWAY-CENTER.jpg',                    filtro: 'Patinetas' },
  ];

  goToCategory(filtro: string) {
    this.filtroActivo = filtro;
    setTimeout(() => {
      document.getElementById('destacados')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  get productosFiltrados(): Producto[] {
    return this.productosService.getPorCategoria(this.filtroActivo);
  }

  get conteoFiltro(): number {
    return this.productosFiltrados.length;
  }

  setFiltro(key: string) { this.filtroActivo = key; }

  // Fallback específico por categoría (productos destacados)
  private readonly fallbackImg: Record<string, string> = {
    iPhone:     'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80',
    Mac:        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    iPad:       'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&q=80',
    Watch:      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
    AirPods:    'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80',
    Samsung:    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
    Exhibición: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
    Accesorios: 'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?w=400&q=80',
  };

  /** Manejador de error de imagen: loguea y aplica fallback real (nunca texto) */
  onImgError(event: Event, label: string): void {
    const img = event.target as HTMLImageElement;
    const GENERIC = 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=80';
    const fallback = this.fallbackImg[label] ?? GENERIC;
    console.warn(`⚠️ [${label}] Falló la imagen: ${img.src}`);
    if (img.src !== fallback) img.src = fallback;
  }

  scrollFiltros(dir: 'left' | 'right') {
    const el = this.filtrosScrollRef?.nativeElement;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 220 : -220, behavior: 'smooth' });
  }

  badgeColor(badge: string | undefined): string {
    const map: Record<string, string> = {
      'NUEVO': '#FF6B00', 'CPO': '#1428A0', 'EXHIBICIÓN': '#7c3aed',
      'PROMO': '#16a34a', 'AGOTADO': '#6b7280', 'RÉPLICA': '#9f1239',
      'OFERTA': '#c20018', 'ACCESORIO': '#0891b2', 'ORIGINAL': '#FF6B00',
    };
    return map[badge ?? ''] ?? '#FF6B00';
  }

  // Marcas con imagen estática ya verificada (celudmovil CDN o Wikipedia Commons)
  // Unsplash NO se llama para estas — evita gastar rate limit y queries genéricas
  private readonly SKIP_UNSPLASH = new Set([
    'Apple', 'Samsung', 'iPhone', 'Mac', 'iPad', 'Watch', 'AirPods',
    'Redmi', 'Infinix', 'ZTE', 'Tecno', 'Oppo', 'Motorola', 'Huawei',
    'Android', 'Segway', 'Accesorios', 'Exhibición', 'Patinetas'
  ]);

  // ── Slider controls ──────────────────────────────────────
  constructor(
    private router: Router,
    public productosService: ProductosService,
    public cartService: CartService,
    private unsplash: UnsplashService,
    private productImageService: ProductImageService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.startAutoplay();
    console.log('🔍 Marcas iniciales:', this.marcas.map(m => ({ label: m.label, img: m.img.substring(0, 80) })));
    this.loadBrandImages();
  }

  /** Reemplaza las imágenes de iconos de marca mediante ProductImageService
   *  (solo para marcas sin URL estática verificada en SKIP_UNSPLASH) */
  async loadBrandImages(): Promise<void> {
    for (let i = 0; i < this.marcas.length; i++) {
      const marca = this.marcas[i];
      if (this.SKIP_UNSPLASH.has(marca.label)) continue; // ya tiene imagen verificada

      const newImg = await this.productImageService.getBestImage({
        nombre: marca.label,
        marca: marca.label,
        imagen: marca.img,
      });

      if (newImg && !this.productImageService.isGenericUrl(newImg)) {
        this.marcas[i].img = newImg;
        console.log(`✅ [${marca.label}] Imagen actualizada: ${newImg.substring(0, 100)}`);
      } else {
        console.warn(`⚠️ [${marca.label}] Sin imagen específica, manteniendo la actual`);
      }
      this.cdr.detectChanges();
    }
  }

  /** Actualiza las imágenes de productos Android usando ProductImageService (4 capas).
   *  Solo actúa sobre productos cuya imagen actual es el fallback genérico. */
  async refreshAndroidProductImages(): Promise<void> {
    const ANDROID_BRANDS = new Set(['Redmi', 'Infinix', 'ZTE', 'Tecno', 'Oppo', 'Motorola', 'Huawei']);
    const productos = this.productosService.getProductos();
    for (const prod of productos) {
      if (!ANDROID_BRANDS.has(prod.marca)) continue;
      if (!this.productImageService.isGenericUrl(prod.imagen)) continue;

      const newImg = await this.productImageService.getBestImage({
        nombre: prod.nombre,
        marca: prod.marca,
        imagen: prod.imagen,
      });
      if (!this.productImageService.isGenericUrl(newImg)) {
        prod.imagen = newImg;
        console.log(`✅ [Producto ${prod.nombre}] Imagen actualizada`);
        this.cdr.detectChanges();
      }
    }
  }
  ngAfterViewInit() { this.forceVideoPlay(); }
  ngOnDestroy() { this.stopAutoplay(); }

  forceVideoPlay() {
    const video = this.heroVideoRef?.nativeElement;
    if (!video) return;
    video.muted = true; video.autoplay = true;
    const tryPlay = () => {
      video.play().catch(() => {
        const resume = () => { video.play().catch(() => {}); document.removeEventListener('mousemove', resume); };
        document.addEventListener('mousemove', resume, { once: true });
        document.addEventListener('scroll', resume, { once: true });
      });
    };
    if (video.readyState >= 2) tryPlay();
    else { video.addEventListener('canplay', tryPlay, { once: true }); }
  }
  playVideo() {
    const v = this.heroVideoRef?.nativeElement;
    if (v) { v.muted = true; v.play().catch(() => {}); }
  }
  startAutoplay() { this.autoplayInterval = setInterval(() => this.nextSlide(), this.INTERVAL_MS); this.isPlaying = true; }
  stopAutoplay() { clearInterval(this.autoplayInterval); this.isPlaying = false; }
  nextSlide() { this.currentSlide = (this.currentSlide + 1) % this.slides.length; }
  prevSlide() { this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length; }
  goToSlide(i: number) { this.currentSlide = i; }
  goLogin() { this.router.navigate(['/login']); }
}
