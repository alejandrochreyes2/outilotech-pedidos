import { Component, signal, computed } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-simulador',
  standalone: true,
  imports: [NavbarComponent, FormsModule, RouterLink, CurrencyPipe],
  templateUrl: './simulador.component.html',
  styleUrls: ['./simulador.component.css']
})
export class SimuladorComponent {
  modelos = [
    { nombre: 'Yaris', precio: 62000000 },
    { nombre: 'Corolla', precio: 95000000 },
    { nombre: 'Corolla Hybrid', precio: 110000000 },
    { nombre: 'RAV4', precio: 145000000 },
    { nombre: 'RAV4 Hybrid', precio: 165000000 },
    { nombre: 'Hilux', precio: 175000000 },
    { nombre: 'Land Cruiser', precio: 380000000 }
  ];

  plazos = [12, 24, 36, 48, 60, 72];

  tasas: Record<number, number> = {
    12: 0.006, 24: 0.007, 36: 0.008, 48: 0.009, 60: 0.010, 72: 0.011
  };

  modeloSeleccionado = signal(0); // index
  cuotaInicial = signal(20);      // porcentaje
  plazo = signal(36);             // meses

  precioVehiculo = computed(() => this.modelos[this.modeloSeleccionado()].precio);
  valorCuotaInicial = computed(() => Math.round(this.precioVehiculo() * this.cuotaInicial() / 100));
  montoFinanciar = computed(() => this.precioVehiculo() - this.valorCuotaInicial());
  tasa = computed(() => this.tasas[this.plazo()]);

  cuotaMensual = computed(() => {
    const P = this.montoFinanciar();
    const r = this.tasa();
    const n = this.plazo();
    if (P <= 0 || r <= 0 || n <= 0) return 0;
    return Math.round(P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  });

  totalPagar = computed(() => this.cuotaMensual() * this.plazo());
  totalIntereses = computed(() => this.totalPagar() - this.montoFinanciar());

  onModeloChange(idx: string) { this.modeloSeleccionado.set(+idx); }
  onPlazoChange(p: string) { this.plazo.set(+p); }
  onCuotaChange(v: string) { this.cuotaInicial.set(+v); }
}
