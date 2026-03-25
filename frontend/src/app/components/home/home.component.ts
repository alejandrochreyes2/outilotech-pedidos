import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

export interface Slide {
  url: string;
  videoUrl?: string;
  badge: string;
  model: string;
  tagline: string;
  cta1: string;
  cta2: string;
  link1: string;
  link2: string;
}

export interface Product {
  name: string;
  price: string;
  img: string;
  badge?: string;
  badgeColor?: string;
}

export interface Category {
  id: string;
  label: string;
  products: Product[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NavbarComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  slides: Slide[] = [
    {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=80',
      videoUrl: 'https://videos.pexels.com/video-files/3048742/3048742-hd_1920_1080_24fps.mp4',
      badge: 'NUEVO',
      model: 'iPhone 17e',
      tagline: 'Trae de todo. Toda una oportunidad. Desde $3.499.000',
      cta1: 'Comprar',
      cta2: 'Más información',
      link1: '/login',
      link2: '#catalogo'
    },
    {
      url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1920&q=80',
      badge: 'NUEVO',
      model: 'MacBook Pro M5',
      tagline: 'Rendimiento extremo — 14 pulgadas desde $9.399.000',
      cta1: 'Comprar',
      cta2: 'Ver todos los Mac',
      link1: '/login',
      link2: '#catalogo'
    },
    {
      url: 'https://images.unsplash.com/photo-1544244015-0df4592c3e1e?w=1920&q=80',
      badge: 'PREVENTA',
      model: 'MacBook Neo',
      tagline: 'La próxima generación — muy pronto desde $3.799.000',
      cta1: 'Registrar interés',
      cta2: 'Ver más',
      link1: '/login',
      link2: '#catalogo'
    },
    {
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1920&q=80',
      badge: 'OFERTA',
      model: 'Orange Days',
      tagline: 'Descuentos hasta $530.000 en iPhone Air + 50% en accesorios',
      cta1: 'Comprar ahora',
      cta2: 'Ver ofertas',
      link1: '/login',
      link2: '#catalogo'
    }
  ];

  categories: Category[] = [
    {
      id: 'iphone',
      label: 'iPhone',
      products: [
        { name: 'iPhone 17e', price: '$3.499.000', img: 'https://images.unsplash.com/photo-1512054502232-10a0a035d672?w=400&q=80', badge: 'NUEVO', badgeColor: '#FF6B00' },
        { name: 'iPhone 17 Pro', price: '$6.449.000', img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&q=80', badge: 'NUEVO', badgeColor: '#FF6B00' },
        { name: 'iPhone 17', price: '$4.699.000', img: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400&q=80', badge: 'NUEVO', badgeColor: '#FF6B00' },
        { name: 'iPhone Air', price: '$5.299.000', img: 'https://images.unsplash.com/photo-1565537222245-6584cb51b4e7?w=400&q=80', badge: 'OFERTA', badgeColor: '#c20018' }
      ]
    },
    {
      id: 'mac',
      label: 'Mac',
      products: [
        { name: 'MacBook Pro 14" M5', price: '$9.399.000', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80', badge: 'NUEVO', badgeColor: '#FF6B00' },
        { name: 'MacBook Air 15" M5', price: '$6.999.000', img: 'https://images.unsplash.com/photo-1611186871525-7b60e2c1c5ee?w=400&q=80', badge: 'NUEVO', badgeColor: '#FF6B00' },
        { name: 'MacBook Air 13" M5', price: '$5.999.000', img: 'https://images.unsplash.com/photo-1504707748692-419802cf939d?w=400&q=80', badge: 'NUEVO', badgeColor: '#FF6B00' },
        { name: 'MacBook Pro M5', price: '$8.799.000', img: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?w=400&q=80' }
      ]
    },
    {
      id: 'ipad',
      label: 'iPad',
      products: [
        { name: 'iPad Pro M4', price: '$4.999.000', img: 'https://images.unsplash.com/photo-1544244015-0df4592c3e1e?w=400&q=80', badge: 'NUEVO', badgeColor: '#FF6B00' },
        { name: 'iPad Air M2', price: '$2.999.000', img: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&q=80' },
        { name: 'iPad 10ma Gen', price: '$1.999.000', img: 'https://images.unsplash.com/photo-1520338801623-c13894f6c5fe?w=400&q=80' },
        { name: 'iPad mini M3', price: '$2.499.000', img: 'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?w=400&q=80' }
      ]
    },
    {
      id: 'watch',
      label: 'Watch',
      products: [
        { name: 'Apple Watch Ultra 2', price: '$3.299.000', img: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80', badge: 'NUEVO', badgeColor: '#FF6B00' },
        { name: 'Apple Watch Series 10', price: '$1.899.000', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80' },
        { name: 'Apple Watch SE', price: '$1.199.000', img: 'https://images.unsplash.com/photo-1617625802912-cde586faf749?w=400&q=80' }
      ]
    },
    {
      id: 'airpods',
      label: 'AirPods',
      products: [
        { name: 'AirPods Pro 2', price: '$1.199.000', img: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80', badge: 'MÁS VENDIDO', badgeColor: '#1a1a1a' },
        { name: 'AirPods 4', price: '$749.000', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80', badge: 'NUEVO', badgeColor: '#FF6B00' },
        { name: 'AirPods Max', price: '$2.199.000', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80' }
      ]
    },
    {
      id: 'tv',
      label: 'TV & Hogar',
      products: [
        { name: 'Apple TV 4K', price: '$799.000', img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80' },
        { name: 'HomePod mini', price: '$649.000', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80' },
        { name: 'HomePod 2da Gen', price: '$1.299.000', img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&q=80' }
      ]
    }
  ];

  activeCategory = signal('iphone');
  currentSlide   = signal(0);
  animating      = signal(false);
  videoPaused    = signal(false);
  private timer: any;
  private _playing = false;

  ngOnInit() { this.scheduleNext(); }
  ngOnDestroy() { clearTimeout(this.timer); }

  get visibleProducts(): Product[] {
    return this.categories.find(c => c.id === this.activeCategory())?.products ?? [];
  }

  scheduleNext() {
    clearTimeout(this.timer);
    const slide = this.slides[this.currentSlide()];
    if (!slide.videoUrl) {
      this.timer = setTimeout(() => this.goNext(), 8000);
    }
  }

  forcePlay(video: HTMLVideoElement) {
    if (!video || this._playing) return;
    video.muted  = true;
    video.volume = 0;
    const p = video.play();
    if (p !== undefined) {
      p.then(() => {
        this._playing = true;
        this.videoPaused.set(false);
      }).catch(() => {
        this.videoPaused.set(true);
      });
    }
  }

  playVideo(video: HTMLVideoElement) {
    video.muted  = true;
    video.volume = 0;
    video.play().then(() => {
      this._playing = true;
      this.videoPaused.set(false);
    });
  }

  onVideoEnded() {
    this._playing = false;
    this.videoPaused.set(false);
    this.goNext();
  }

  prev() {
    clearTimeout(this.timer);
    this.goTo((this.currentSlide() - 1 + this.slides.length) % this.slides.length);
  }

  next() {
    clearTimeout(this.timer);
    this.goNext();
  }

  goNext() {
    this.goTo((this.currentSlide() + 1) % this.slides.length);
  }

  goTo(index: number) {
    if (this.animating()) return;
    this.animating.set(true);
    this._playing = false;
    this.videoPaused.set(false);
    this.currentSlide.set(index);
    setTimeout(() => {
      this.animating.set(false);
      this.scheduleNext();
    }, 800);
  }

  setCategory(id: string) {
    this.activeCategory.set(id);
  }

  get slide(): Slide { return this.slides[this.currentSlide()]; }
}
