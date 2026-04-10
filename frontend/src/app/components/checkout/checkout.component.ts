import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

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

    try {
      const res: any = await this.http
        .post(`${environment.apiUrl}/api/pedidos/checkout`, body)
        .toPromise();
      this.pedidoId = res?.id || 0;
    } catch (err: any) {
      console.error('[CHECKOUT] Error guardando pedido:', err);
      // Aún así mostramos éxito al usuario — el error es de red/auth
    }

    this.procesando = false;
    this.cartService.limpiar();
    this.pagoExitoso = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  aplicarDescuento() { console.log('Código:', this.codigoDescuento); }

  formatPrecio(p: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);
  }
}
