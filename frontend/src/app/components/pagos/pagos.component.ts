import { Component, OnInit, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

export interface PagoResponse {
  id:       number;
  pedidoId: number;
  monto:    number;
  estado:   string;
  fecha:    string;
}

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pagos.component.html'
})
export class PagosComponent implements OnInit {
  private http = inject(HttpClient);
  private fb   = inject(FormBuilder);
  auth         = inject(AuthService);

  pagos     = signal<PagoResponse[]>([]);
  isLoading = signal(false);
  error     = signal<string | null>(null);
  success   = signal<string | null>(null);

  form = this.fb.group({
    pedidoId: [1,    [Validators.required, Validators.min(1)]],
    monto:    [0.01, [Validators.required, Validators.min(0.01)]]
  });

  ngOnInit() { this.cargarPagos(); }

  cargarPagos() {
    this.isLoading.set(true);
    this.error.set(null);
    this.http.get<PagoResponse[]>('/api/pagos').subscribe({
      next: data => {
        this.pagos.set(data);
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.error.set(err.status === 403
          ? 'Solo administradores pueden ver pagos'
          : 'Error al cargar pagos');
      }
    });
  }

  registrarPago() {
    if (this.form.invalid) return;
    const { pedidoId, monto } = this.form.value;
    this.isLoading.set(true);
    this.http.post<PagoResponse>('/api/pagos', { pedidoId, monto }).subscribe({
      next: pago => {
        this.pagos.update(list => [...list, pago]);
        this.form.reset({ pedidoId: 1, monto: 0.01 });
        this.success.set('Pago registrado correctamente');
        this.isLoading.set(false);
        setTimeout(() => this.success.set(null), 3000);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.error.set(err.status === 403
          ? 'Solo administradores pueden registrar pagos'
          : 'Error al registrar pago');
      }
    });
  }
}
