import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

export interface Slide {
  url: string;
  videoUrl?: string;
  model: string;
  tagline: string;
  cta1: string;
  cta2: string;
  link1: string;
  link2: string;
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
      // Video real Tesla FSD Supervised — tesla.com hero
      url: 'https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Homepage-Promo-Carousel-FSD-Supervised-Tablet-Poster.jpg',
      videoUrl: 'https://digitalassets.tesla.com/tesla-contents/video/upload/f_auto,q_auto:best/Homepage-Promo-Carousel-FSD-Supervised-Tablet.mp4',
      model: 'Conducción Autónoma',
      tagline: 'Conducción totalmente autónoma (supervisada)',
      cta1: 'Demo FSD',
      cta2: 'Más información',
      link1: '/login',
      link2: '#features'
    },
    {
      // Vista cockpit / carretera
      url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1920&q=80',
      model: 'Model S',
      tagline: 'Sedán deportivo — El más rápido del mundo',
      cta1: 'Ordenar ahora',
      cta2: 'Ver más',
      link1: '/login',
      link2: '#features'
    },
    {
      url: 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1920&q=80',
      model: 'Model 3',
      tagline: '0,99% TAE disponible',
      cta1: '¡Ordene ahora!',
      cta2: 'Ver inventario',
      link1: '/login',
      link2: '#features'
    },
    {
      url: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1920&q=80',
      model: 'Model Y',
      tagline: 'SUV de tamaño mediano — El más vendido del mundo',
      cta1: 'Ordenar ahora',
      cta2: 'Ver inventario',
      link1: '/login',
      link2: '#features'
    }
  ];

  currentSlide = signal(0);
  animating = signal(false);
  private timer: any;

  ngOnInit() { this.startTimer(); }
  ngOnDestroy() { clearInterval(this.timer); }

  startTimer() {
    this.timer = setInterval(() => this.goNext(), 10000);
  }

  resetTimer() {
    clearInterval(this.timer);
    this.startTimer();
  }

  prev() {
    this.resetTimer();
    this.goTo((this.currentSlide() - 1 + this.slides.length) % this.slides.length);
  }

  next() {
    this.resetTimer();
    this.goNext();
  }

  goNext() {
    this.goTo((this.currentSlide() + 1) % this.slides.length);
  }

  goTo(index: number) {
    if (this.animating()) return;
    this.animating.set(true);
    this.currentSlide.set(index);
    setTimeout(() => this.animating.set(false), 800);
  }

  get slide(): Slide { return this.slides[this.currentSlide()]; }
}
