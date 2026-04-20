import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

const SUPABASE_URL = 'https://gklxdzhmpjwwmffjdmwv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbHhkemhtcGp3d21mZmpkbXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NTM0MDEsImV4cCI6MjA5MTQyOTQwMX0.Es3YyKtLnx9lKiA_xyTHxK_IDSICb9kGf5-nu2XE_jg';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  procesando = false;
  codigoDescuento = '';
  nequiTab: 'nequi' | 'daviplata' = 'nequi';
  pagoExitoso = false;
  pedidoId = 0;
  errorPago = '';

  form = {
    email: '', telefono: '', nombre: '', apellido: '', empresa: '',
    ciudad: '', direccion: '', barrio: '', tipoId: '', numeroId: '',
    envio: 'domicilio', metodoPago: 'tarjeta', facturacion: 'misma', terminos: false,
    numTarjeta: '', fechaTarjeta: '', cvv: '', titularTarjeta: '', cuotas: '1',
    banco: '', tipoCuenta: ''
  };

  constructor(public cartService: CartService, private http: HttpClient) {}

  async procesarPago() {
    if (!this.form.terminos) return;
    this.procesando = true;
    this.errorPago = '';

    const items = this.cartService.items();
    const itemsJson = JSON.stringify(items.map(i => ({
      id: i.producto.id,
      nombre: i.producto.nombre,
      marca: i.producto.marca,
      variante: i.variante?.storage || i.variante?.color || '',
      cantidad: i.cantidad,
      precioUnitario: i.precioUnitario,
      subtotal: i.subtotal
    })));

    const body = {
      cliente: `${this.form.nombre} ${this.form.apellido}`.trim() || this.form.email || 'Cliente',
      total: this.cartService.total(),
      email: this.form.email,
      telefono: this.form.telefono,
      nombre: this.form.nombre,
      apellido: this.form.apellido,
      empresa: this.form.empresa,
      ciudad: this.form.ciudad,
      direccion: this.form.direccion,
      barrio: this.form.barrio,
      tipoId: this.form.tipoId,
      numeroId: this.form.numeroId,
      metodoEnvio: this.form.envio,
      metodoPago: this.form.metodoPago,
      itemsJson: itemsJson
    };

    // 1. Guardar pedido en backend (PostgreSQL + sync Supabase en background)
    try {
      const res: any = await this.http
        .post(`${environment.apiUrl}/api/pedidos/checkout`, body)
        .toPromise();
      this.pedidoId = res?.id || 0;
    } catch (err: any) {
      console.error('[CHECKOUT] Error guardando pedido:', err);
    }

    // 2. Sincronizar con Supabase en segundo plano
    this.syncSupabase(body, this.pedidoId);

    // 3. Redirigir a Wompi según método de pago
    const pagoElectronico = ['tarjeta', 'pse', 'nequi'].includes(this.form.metodoPago);

    if (pagoElectronico) {
      await this.redirigirAWompi(body.total, this.pedidoId, body.email,
        `${this.form.nombre} ${this.form.apellido}`.trim(), this.form.telefono);
      // redirigirAWompi hace window.location.href — el código de abajo no se ejecuta si fue exitoso
      return;
    }

    // Para efectivo o ADDI: mostrar pantalla de éxito directamente
    this.procesando = false;
    this.cartService.limpiar();
    this.pagoExitoso = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private async redirigirAWompi(total: number, pedidoId: number, email: string, fullName: string, phone: string) {
    const reference   = `OUTILTECH-${pedidoId}-${Date.now()}`;
    const redirectUrl = `${window.location.origin}/payment-result`;

    try {
      const res: any = await this.http.post(
        `${environment.apiUrl}/api/pedidos/create-wompi-transaction`,
        { reference, amountCop: total, redirectUrl, email, fullName, phone }
      ).toPromise();

      // Guardar carrito en sessionStorage antes de salir (para recuperar si hay error)
      sessionStorage.setItem('wompi_reference', reference);
      sessionStorage.setItem('wompi_pedidoId', String(pedidoId));

      this.cartService.limpiar();
      window.location.href = res.checkoutUrl;
    } catch (err: any) {
      console.error('[WOMPI] Error creando transacción:', err);
      this.errorPago = 'No se pudo iniciar el pago. Intenta de nuevo.';
      this.procesando = false;
    }
  }

  private syncSupabase(body: any, pedidoId: number): void {
    const supabasePedido = {
      cliente:      body.cliente,
      total:        body.total,
      email:        body.email,
      telefono:     body.telefono,
      nombre:       body.nombre,
      apellido:     body.apellido,
      empresa:      body.empresa,
      ciudad:       body.ciudad,
      direccion:    body.direccion,
      barrio:       body.barrio,
      tipo_id:      body.tipoId,
      numero_id:    body.numeroId,
      metodo_envio: body.metodoEnvio,
      metodo_pago:  body.metodoPago,
      items_json:   body.itemsJson,
      estado:       'Pendiente'
    };

    const headers = {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        'return=minimal'
    };

    this.http
      .post(`${SUPABASE_URL}/rest/v1/pedidos`, supabasePedido, { headers })
      .subscribe({
        next: () => console.log('[SUPABASE] Pedido sincronizado OK'),
        error: (e) => console.warn('[SUPABASE] Sync falló (no crítico):', e.message)
      });
  }

  aplicarDescuento() { console.log('Código:', this.codigoDescuento); }

  formatPrecio(p: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);
  }
}
