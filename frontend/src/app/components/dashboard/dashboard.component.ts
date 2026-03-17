import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  auth         = inject(AuthService);
  private http = inject(HttpClient);

  pedidos = toSignal(
    this.http.get<any[]>('/api/pedidos').pipe(catchError(() => of([]))),
    { initialValue: [] }
  );

  pagos = toSignal(
    this.http.get<any[]>('/api/pagos').pipe(catchError(() => of([]))),
    { initialValue: [] }
  );

  totalPedidos  = computed(() => this.pedidos().length);
  totalPagos    = computed(() => this.pagos().length);
  creandoPrueba = signal(false);
  mensajePrueba = signal<string | null>(null);

  crearPedidoPrueba() {
    this.creandoPrueba.set(true);
    this.mensajePrueba.set(null);
    this.http.post<any>('/api/pedidos', { cliente: 'Toyota Colombia', total: 150000 }).subscribe({
      next: () => {
        this.mensajePrueba.set('Pedido de prueba creado. Recarga la página para ver el contador.');
        this.creandoPrueba.set(false);
      },
      error: () => {
        this.mensajePrueba.set('Error al crear pedido de prueba. Verifica que el servicio esté activo.');
        this.creandoPrueba.set(false);
      }
    });
  }
}
