import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

export interface PedidoResponse {
  id:      number;
  cliente: string;
  total:   number;
  fecha:   string;
}

export interface RelacionVenta {
  id: number;
  fecha: string;
  hora: string;
  descripcion: string;
  costo: number;
  compras: number;
  fac: string;
  cliente: string;
  celular: string;
  observaciones: string;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, DatePipe],
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {
  private http = inject(HttpClient);
  private fb   = inject(FormBuilder);
  auth         = inject(AuthService);

  pedidos   = signal<PedidoResponse[]>([]);
  isLoading = signal(false);
  error     = signal<string | null>(null);
  success   = signal<string | null>(null);

  today = new Date();

  // Relación de Ventas (almacenada localmente)
  relacionVentas = signal<RelacionVenta[]>([]);
  mostrarFormVenta = signal(false);
  nextFacId = signal(1001);

  nuevaVenta: Omit<RelacionVenta, 'id'> = {
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    descripcion: '',
    costo: 0,
    compras: 1,
    fac: '',
    cliente: '',
    celular: '',
    observaciones: ''
  };

  form = this.fb.group({
    cliente: ['', Validators.required],
    total:   [0, [Validators.required, Validators.min(1)]]
  });

  ngOnInit() { this.cargarPedidos(); }

  cargarPedidos() {
    this.isLoading.set(true);
    this.error.set(null);
    this.http.get<PedidoResponse[]>(`${environment.apiUrl}/api/pedidos`).subscribe({
      next: data => {
        this.pedidos.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.error.set(err.status === 403 ? 'Sin permiso para ver pedidos' : 'Error al cargar pedidos');
      }
    });
  }

  crearPedido() {
    if (this.form.invalid) return;
    const { cliente, total } = this.form.value;
    this.isLoading.set(true);
    this.http.post<PedidoResponse>(`${environment.apiUrl}/api/pedidos`, { cliente, total }).subscribe({
      next: pedido => {
        this.pedidos.update(list => [...list, pedido]);
        this.form.reset({ cliente: '', total: 0 });
        this.success.set('Pedido creado correctamente');
        this.isLoading.set(false);
        setTimeout(() => this.success.set(null), 3000);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.error.set(err.status === 403 ? 'Sin permiso para crear pedidos' : 'Error al crear pedido');
      }
    });
  }

  agregarVenta() {
    if (!this.nuevaVenta.descripcion || !this.nuevaVenta.cliente) return;
    const id = this.nextFacId();
    const fac = this.nuevaVenta.fac || `FAC-${id}`;
    this.relacionVentas.update(list => [...list, { ...this.nuevaVenta, id, fac }]);
    this.nextFacId.update(n => n + 1);
    this.nuevaVenta = {
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5),
      descripcion: '', costo: 0, compras: 1, fac: '', cliente: '', celular: '', observaciones: ''
    };
    this.mostrarFormVenta.set(false);
    this.success.set('Venta registrada en relación semanal');
    setTimeout(() => this.success.set(null), 3000);
  }

  eliminarVenta(id: number) {
    this.relacionVentas.update(list => list.filter(v => v.id !== id));
  }

  formatPrecio(p: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);
  }

  get totalCostoSemana(): number {
    return this.relacionVentas().reduce((sum, v) => sum + (v.costo * v.compras), 0);
  }
}
