import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { catchError, switchMap } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  auth         = inject(AuthService);
  private http = inject(HttpClient);

  private pedidosRefresh$ = new BehaviorSubject<void>(undefined);
  private pagosRefresh$   = new BehaviorSubject<void>(undefined);

  pedidos = toSignal(
    this.pedidosRefresh$.pipe(
      switchMap(() =>
        this.http.get<any[]>(`${environment.apiUrl}/api/pedidos`).pipe(catchError(() => of([])))
      )
    ),
    { initialValue: [] }
  );

  pagos = toSignal(
    this.pagosRefresh$.pipe(
      switchMap(() =>
        this.http.get<any[]>(`${environment.apiUrl}/api/pagos`).pipe(catchError(() => of([])))
      )
    ),
    { initialValue: [] }
  );

  totalPedidos  = computed(() => this.pedidos().length);
  totalPagos    = computed(() => this.pagos().length);
  totalVentas   = computed(() =>
    this.pedidos().reduce((acc: number, p: any) => acc + (p.total ?? 0), 0)
  );

  creandoPrueba = signal(false);
  mensajePrueba = signal<string | null>(null);
  cargando      = signal(false);

  refreshPedidos() {
    this.cargando.set(true);
    setTimeout(() => {
      this.pedidosRefresh$.next();
      this.cargando.set(false);
    }, 400);
  }

  crearPedidoPrueba() {
    this.creandoPrueba.set(true);
    this.mensajePrueba.set(null);
    this.http.post<any>(`${environment.apiUrl}/api/pedidos`, {
      cliente: 'OutilTech Demo',
      total: 150000
    }).subscribe({
      next: () => {
        this.mensajePrueba.set('✅ Pedido de prueba creado.');
        this.creandoPrueba.set(false);
        this.pedidosRefresh$.next();
      },
      error: () => {
        this.mensajePrueba.set('Error al crear pedido. Verifica que el servicio esté activo.');
        this.creandoPrueba.set(false);
      }
    });
  }
}
