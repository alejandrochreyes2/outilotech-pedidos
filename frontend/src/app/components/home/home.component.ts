import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';

export interface Slide {
  url: string;
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
      url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1920&q=80',
      model: 'Model S',
      tagline: 'Conducción totalmente autónoma (supervisada)',
      cta1: 'Ordenar ahora',
      cta2: 'Ver inventario',
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
      model: 'Model X',
      tagline: 'Seguridad y rendimiento sin igual',
      cta1: 'Ordenar ahora',
      cta2: 'Ver más',
      link1: '/login',
      link2: '#features'
    },
    {
      url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=1920&q=80',
      model: 'Model Y',
      tagline: 'El SUV eléctrico más popular del mundo',
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
