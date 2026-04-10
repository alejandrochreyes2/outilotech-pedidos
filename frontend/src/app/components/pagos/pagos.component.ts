import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

export interface PagoResponse {
  id:       number;
  pedidoId: number;
  monto:    number;
  estado:   string;
  fecha:    string;
}

export interface PedidoDetalle {
  id: number;
  cliente: string;
  total: number;
  fecha: string;
  email: string;
  telefono: string;
  nombre: string;
  apellido: string;
  empresa: string;
  ciudad: string;
  direccion: string;
  barrio: string;
  tipoId: string;
  numeroId: string;
  metodoEnvio: string;
  metodoPago: string;
  itemsJson: string;
  estado: string;
}

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent implements OnInit {
  private http = inject(HttpClient);
  auth         = inject(AuthService);

  pagos          = signal<PagoResponse[]>([]);
  pedidos        = signal<PedidoDetalle[]>([]);
  isLoading      = signal(false);
  error          = signal<string | null>(null);
  pedidoExpandido = signal<number | null>(null);

  ngOnInit() {
    this.cargarPagos();
    this.cargarPedidos();
  }

  cargarPagos() {
    this.http.get<PagoResponse[]>(`${environment.apiUrl}/api/pagos`).subscribe({
      next: data => this.pagos.set(data),
      error: () => {}
    });
  }

  cargarPedidos() {
    this.isLoading.set(true);
    this.error.set(null);
    this.http.get<PedidoDetalle[]>(`${environment.apiUrl}/api/pedidos`).subscribe({
      next: data => {
        this.pedidos.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.error.set(err.status === 403 ? 'Sin permiso para ver pedidos' : 'Error al cargar datos');
      }
    });
  }

  toggleDetalle(id: number) {
    this.pedidoExpandido.update(v => v === id ? null : id);
  }

  parseItems(json: string): any[] {
    try { return JSON.parse(json) || []; } catch { return []; }
  }

  formatPrecio(p: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);
  }

  get totalVentas(): number {
    return this.pedidos().reduce((s, p) => s + p.total, 0);
  }
}
