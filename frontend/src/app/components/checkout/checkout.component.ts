import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

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

  form = {
    email: '', telefono: '', nombre: '', apellido: '', empresa: '',
    ciudad: '', direccion: '', barrio: '', tipoId: '', numeroId: '',
    envio: 'domicilio', metodoPago: 'tarjeta', facturacion: 'misma', terminos: false,
    numTarjeta: '', fechaTarjeta: '', cvv: '', titularTarjeta: '', cuotas: '1',
    banco: '', tipoCuenta: ''
  };

  constructor(public cartService: CartService, private router: Router) {}

  async procesarPago() {
    if (!this.form.terminos) return;
    this.procesando = true;
    await new Promise(r => setTimeout(r, 2000));
    this.procesando = false;
    this.cartService.limpiar();
    this.router.navigate(['/pago-exitoso']);
  }

  aplicarDescuento() { console.log('Código:', this.codigoDescuento); }

  formatPrecio(p: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);
  }
}
