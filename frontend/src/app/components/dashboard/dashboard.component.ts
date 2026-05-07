import { Component, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { catchError, switchMap } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { JhonStatsMiniComponent } from '../jhon-stats-mini/jhon-stats-mini.component';

const SUPABASE_URL = 'https://gklxdzhmpjwwmffjdmwv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbHhkemhtcGp3d21mZmpkbXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NTM0MDEsImV4cCI6MjA5MTQyOTQwMX0.Es3YyKtLnx9lKiA_xyTHxK_IDSICb9kGf5-nu2XE_jg';

const supabaseHeaders = new HttpHeaders({
  'apikey': SUPABASE_KEY,
  'Authorization': `Bearer ${SUPABASE_KEY}`
});

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, DecimalPipe, DatePipe, RouterLink, JhonStatsMiniComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  auth         = inject(AuthService);
  private http = inject(HttpClient);

  private pedidosRefresh$ = new BehaviorSubject<void>(undefined);
  private pagosRefresh$   = new BehaviorSubject<void>(undefined);

  // Lee pedidos desde Supabase (fuente única de verdad — AppSheet usa la misma BD)
  pedidos = toSignal(
    this.pedidosRefresh$.pipe(
      switchMap(() =>
        this.http.get<any[]>(
          `${SUPABASE_URL}/rest/v1/pedidos?order=id.desc`,
          { headers: supabaseHeaders }
        ).pipe(catchError(() => of([])))
      )
    ),
    { initialValue: [] }
  );

  // Lee pagos desde Supabase
  pagos = toSignal(
    this.pagosRefresh$.pipe(
      switchMap(() =>
        this.http.get<any[]>(
          `${SUPABASE_URL}/rest/v1/pagos?order=id.desc`,
          { headers: supabaseHeaders }
        ).pipe(catchError(() => of([])))
      )
    ),
    { initialValue: [] }
  );

  totalPedidos  = computed(() => this.pedidos().length);
  totalPagos    = computed(() => this.pagos().length);
  totalVentas   = computed(() =>
    this.pedidos().reduce((acc: number, p: any) => acc + (parseFloat(p.total) || 0), 0)
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

  // Crea un pedido de prueba directamente en Supabase
  crearPedidoPrueba() {
    this.creandoPrueba.set(true);
    this.mensajePrueba.set(null);
    const pedido = {
      cliente: 'OutilTech Demo',
      total: 150000,
      email: 'test@outiltech.co',
      telefono: '3110000000',
      nombre: 'Usuario', apellido: 'Prueba',
      empresa: 'OutilTech Demo',
      ciudad: 'Bogotá', direccion: 'Calle Test 123', barrio: 'Centro',
      tipo_id: 'CC', numero_id: '9999999999',
      metodo_envio: 'domicilio', metodo_pago: 'tarjeta',
      items_json: '[{"producto":"Venta de equipo / servicio técnico","cantidad":1,"precio":150000}]',
      estado: 'Completado'
    };
    const headers = supabaseHeaders.set('Prefer', 'return=minimal');
    this.http.post(`${SUPABASE_URL}/rest/v1/pedidos`, pedido, { headers }).subscribe({
      next: () => {
        this.mensajePrueba.set('✅ Pedido de prueba creado.');
        this.creandoPrueba.set(false);
        this.pedidosRefresh$.next();
      },
      error: () => {
        this.mensajePrueba.set('❌ Error al crear pedido. Verifica la conexión con Supabase.');
        this.creandoPrueba.set(false);
      }
    });
  }
}
