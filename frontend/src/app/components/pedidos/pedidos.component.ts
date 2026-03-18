import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

export interface PedidoResponse {
  id:      number;
  cliente: string;
  total:   number;
  fecha:   string;
}

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pedidos.component.html'
})
export class PedidosComponent implements OnInit {
  private http = inject(HttpClient);
  private fb   = inject(FormBuilder);
  auth         = inject(AuthService);

  pedidos   = signal<PedidoResponse[]>([]);
  isLoading = signal(false);
  error     = signal<string | null>(null);
  success   = signal<string | null>(null);

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
}
