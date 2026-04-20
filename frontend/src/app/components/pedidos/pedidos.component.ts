import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators, FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

const SUPABASE_URL = 'https://gklxdzhmpjwwmffjdmwv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbHhkemhtcGp3d21mZmpkbXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NTM0MDEsImV4cCI6MjA5MTQyOTQwMX0.Es3YyKtLnx9lKiA_xyTHxK_IDSICb9kGf5-nu2XE_jg';
const supabaseHeaders = new HttpHeaders({ 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` });

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
    // Lee desde Supabase (fuente única — misma BD que AppSheet)
    this.http.get<PedidoResponse[]>(
      `${SUPABASE_URL}/rest/v1/pedidos?order=id.desc`,
      { headers: supabaseHeaders }
    ).subscribe({
      next: data => {
        this.pedidos.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.error.set('Error al cargar pedidos desde Supabase');
      }
    });
  }

  crearPedido() {
    if (this.form.invalid) return;
    const { cliente, total } = this.form.value;
    this.isLoading.set(true);
    // Escribe en Supabase directamente
    const pedido = {
      cliente, total,
      email: '', telefono: '', nombre: cliente ?? '', apellido: '',
      empresa: '', ciudad: '', direccion: '', barrio: '',
      tipo_id: '', numero_id: '',
      metodo_envio: 'domicilio', metodo_pago: 'tarjeta',
      items_json: '[]', estado: 'Completado'
    };
    const headers = supabaseHeaders.set('Prefer', 'return=representation');
    this.http.post<PedidoResponse>(`${SUPABASE_URL}/rest/v1/pedidos`, pedido, { headers }).subscribe({
      next: (resp: any) => {
        const created = Array.isArray(resp) ? resp[0] : resp;
        this.pedidos.update(list => [created, ...list]);
        this.form.reset({ cliente: '', total: 0 });
        this.success.set('Pedido creado correctamente en Supabase');
        this.isLoading.set(false);
        setTimeout(() => this.success.set(null), 3000);
      },
      error: () => {
        this.isLoading.set(false);
        this.error.set('Error al crear pedido en Supabase');
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
