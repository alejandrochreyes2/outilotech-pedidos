import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-promociones',
  standalone: true,
  imports: [NavbarComponent, RouterLink],
  templateUrl: './promociones.component.html',
  styleUrls: ['./promociones.component.css']
})
export class PromocionesComponent implements OnInit, OnDestroy {
  dias = signal(0);
  horas = signal(0);
  minutos = signal(0);
  segundos = signal(0);
  private timer: any;

  promos = [
    {
      modelo: 'Corolla Hybrid',
      badge: 'NUEVO',
      badgeClass: 'badge-nuevo',
      precio: 'Desde $1.304.500/mes',
      detalle: '0% de interés primeros 6 meses',
      imagen: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&q=80'
    },
    {
      modelo: 'RAV4',
      badge: 'MÁS VENDIDO',
      badgeClass: 'badge-popular',
      precio: 'Desde $2.100.000/mes',
      detalle: 'Cuota inicial desde 20%',
      imagen: 'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=600&q=80'
    },
    {
      modelo: 'Hilux',
      badge: 'OFERTA',
      badgeClass: 'badge-oferta',
      precio: 'Desde $2.800.000/mes',
      detalle: 'Bono de $5.000.000 en accesorios',
      imagen: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80'
    },
    {
      modelo: 'Yaris',
      badge: 'ECONÓMICO',
      badgeClass: 'badge-eco',
      precio: 'Desde $890.000/mes',
      detalle: 'Tasa especial 0.6% MV',
      imagen: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80'
    }
  ];

  ngOnInit() {
    this.calcular();
    this.timer = setInterval(() => this.calcular(), 1000);
  }

  ngOnDestroy() { clearInterval(this.timer); }

  calcular() {
    const fin = new Date('2026-03-31T23:59:59');
    const ahora = new Date();
    const diff = fin.getTime() - ahora.getTime();
    if (diff <= 0) { this.dias.set(0); this.horas.set(0); this.minutos.set(0); this.segundos.set(0); return; }
    this.dias.set(Math.floor(diff / 86400000));
    this.horas.set(Math.floor((diff % 86400000) / 3600000));
    this.minutos.set(Math.floor((diff % 3600000) / 60000));
    this.segundos.set(Math.floor((diff % 60000) / 1000));
  }
}
