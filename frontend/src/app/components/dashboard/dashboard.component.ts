import { Component, computed, inject } from '@angular/core';
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
  auth        = inject(AuthService);
  private http = inject(HttpClient);

  pedidos = toSignal(
    this.http.get<any[]>('/api/pedidos').pipe(catchError(() => of([]))),
    { initialValue: [] }
  );

  pagos = toSignal(
    this.http.get<any[]>('/api/pagos').pipe(catchError(() => of([]))),
    { initialValue: [] }
  );

  totalPedidos = computed(() => this.pedidos().length);
  totalPagos   = computed(() => this.pagos().length);
}
