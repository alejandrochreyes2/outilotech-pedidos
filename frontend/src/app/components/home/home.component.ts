import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NavbarComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  cart = inject(CartService);

  currentSlide = 0;
  isPlaying = true;
  private autoplayInterval: any;
  private readonly INTERVAL_MS = 6000;

  slides = [0, 1, 2, 3, 4, 5, 6, 7];

  heroProducts = [
    { id: 'macbook-hero',     brand: 'Apple',   name: 'Macbook Pro',        price: '$2.799.000', priceNum: 2799000, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80' },
    { id: 'macbook-m5-hero',  brand: 'Apple',   name: 'MacBook Pro M5',     price: '$9.399.000', priceNum: 9399000, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80' },
    { id: 'iphone-air-hero',  brand: 'Apple',   name: 'iPhone Air',         price: '$3.499.000', priceNum: 3499000, img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500&q=80' },
    { id: 'watch-ultra-hero', brand: 'Apple',   name: 'Apple Watch Ultra 3',price: '$3.299.000', priceNum: 3299000, img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80' },
    { id: 'airpods-hero',     brand: 'Apple',   name: 'AirPods Pro 3',      price: '$1.299.000', priceNum: 1299000, img: 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500&q=80' },
    { id: 'galaxy-s25-hero',  brand: 'Samsung', name: 'Galaxy S25 Ultra',   price: '$5.199.000', priceNum: 5199000, img: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80' },
  ];

  products = [
    { id: 'iphone17e',    brand: 'Apple', name: 'iPhone 17e 128GB',    price: '$3.499.000', priceNum: 3499000, img: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=500&q=80', badge: 'NUEVO',  badgeColor: '#FF6B00' },
    { id: 'macbook-m5',   brand: 'Apple', name: 'MacBook Pro 14" M5',  price: '$9.399.000', priceNum: 9399000, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', badge: 'NUEVO',  badgeColor: '#FF6B00' },
    { id: 'ipad-air-m3',  brand: 'Apple', name: 'iPad Air M3 11"',     price: '$2.199.000', priceNum: 2199000, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', badge: 'OFERTA', badgeColor: '#c20018' },
    { id: 'watch-ultra3', brand: 'Apple', name: 'Apple Watch Ultra 3', price: '$3.299.000', priceNum: 3299000, img: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&q=80', badge: 'NUEVO',  badgeColor: '#FF6B00' },
  ];

  constructor(private router: Router) {}

  ngOnInit() { this.startAutoplay(); }

  ngAfterViewInit() { this.forceVideoPlay(); }

  ngOnDestroy() { this.stopAutoplay(); }

  forceVideoPlay() {
    const video = this.heroVideoRef?.nativeElement;
    if (!video) return;
    video.muted = true;
    video.autoplay = true;

    const tryPlay = () => {
      video.play().catch(() => {
        const resume = () => {
          video.play().catch(() => {});
          document.removeEventListener('mousemove', resume);
          document.removeEventListener('scroll', resume);
          document.removeEventListener('touchstart', resume);
          document.removeEventListener('keydown', resume);
        };
        document.addEventListener('mousemove', resume, { once: true });
        document.addEventListener('scroll', resume, { once: true });
        document.addEventListener('touchstart', resume, { once: true });
        document.addEventListener('keydown', resume, { once: true });
      });
    };

    if (video.readyState >= 2) {
      tryPlay();
    } else {
      video.addEventListener('canplay', tryPlay, { once: true });
      video.addEventListener('loadeddata', tryPlay, { once: true });
    }
  }

  playVideo() {
    const video = this.heroVideoRef?.nativeElement;
    if (video) { video.muted = true; video.play().catch(() => {}); }
  }

  addHeroProduct(index: number) {
    if (index < this.heroProducts.length) {
      const p = this.heroProducts[index];
      this.cart.addItem({ id: p.id, name: p.name, brand: p.brand, price: p.price, priceNum: p.priceNum, img: p.img });
    }
  }

  buyProduct(p: typeof this.products[0]) {
    this.cart.addItem({ id: p.id, name: p.name, brand: p.brand, price: p.price, priceNum: p.priceNum, img: p.img });
  }

  startAutoplay() {
    this.autoplayInterval = setInterval(() => this.nextSlide(), this.INTERVAL_MS);
    this.isPlaying = true;
  }
  stopAutoplay() { clearInterval(this.autoplayInterval); this.isPlaying = false; }
  nextSlide() { this.currentSlide = (this.currentSlide + 1) % this.slides.length; }
  prevSlide() { this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length; }
  goToSlide(i: number) { this.currentSlide = i; }
  goLogin() { this.router.navigate(['/login']); }
}
