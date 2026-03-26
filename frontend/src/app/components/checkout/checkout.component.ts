import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  cart   = inject(CartService);
  router = inject(Router);
  auth   = inject(AuthService);
  http   = inject(HttpClient);

  metodoPago = signal<'tarjeta' | 'pse' | 'paypal' | 'nequi'>('tarjeta');
  procesando = signal(false);
  pagado     = signal(false);
  aceptaTerminos = false;

  // Tarjeta
  cardNumber = '';
  cardExpiry = '';
  cardCvv    = '';
  cardName   = '';
  docTipo    = 'CC';
  docNumero  = '';
  cuotas     = '1';

  // PSE
  banco          = '';
  tipoCuentaPse  = 'CC';
  docPse         = '';

  // Nequi/Daviplata
  celular  = '';
  operador: 'nequi' | 'daviplata' = 'nequi';

  // Descuento
  codigoDesc = '';

  bancos = [
    'Bancolombia','Banco de Bogotá','Davivienda','BBVA Colombia',
    'Banco Popular','Banco de Occidente','Colpatria','Itaú',
    'Scotiabank Colpatria','Banco Caja Social','AV Villas','Nequi','Daviplata'
  ];

  complementos = [
    { img: 'https://images.unsplash.com/photo-1601524909162-ae8725290836?w=100&q=80', name: 'Adaptador USB-C 20W', price: '$139.000' },
    { img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100&q=80', name: 'Funda MagSafe Premium', price: '$89.000' },
    { img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&q=80', name: 'Protector de Pantalla', price: '$69.000' },
  ];

  setMetodo(m: 'tarjeta' | 'pse' | 'paypal' | 'nequi') { this.metodoPago.set(m); }

  formatCard(val: string): string {
    return val.replace(/\D/g,'').replace(/(.{4})/g,'$1 ').trim().slice(0,19);
  }
  onCardInput(e: Event) { this.cardNumber = this.formatCard((e.target as HTMLInputElement).value); }

  formatExpiry(val: string): string {
    const v = val.replace(/\D/g,'');
    return v.length >= 3 ? v.slice(0,2) + ' / ' + v.slice(2,4) : v;
  }
  onExpiryInput(e: Event) { this.cardExpiry = this.formatExpiry((e.target as HTMLInputElement).value); }

  get subtotal(): number { return this.cart.cartTotal(); }
  get total(): number    { return this.subtotal; }

  formatCOP(n: number): string {
    return '$ ' + n.toLocaleString('es-CO');
  }

  /** Nombre del cliente: usuario logueado o nombre del titular de tarjeta */
  private getClienteLabel(): string {
    const user = this.auth.currentUser();
    if (user?.name && user.name !== user.email) {
      return `${user.name} (${user.email})`;
    }
    if (user?.email) return user.email;
    if (this.cardName.trim()) return this.cardName.trim();
    return 'Cliente invitado';
  }

  pagar() {
    if (!this.aceptaTerminos) return;
    this.procesando.set(true);

    const clienteLabel = this.getClienteLabel();
    const totalCompra  = this.total;

    // Registrar pedido en el backend (endpoint público)
    this.http.post(`${environment.apiUrl}/api/pedidos/checkout`, {
      cliente: clienteLabel,
      total:   totalCompra
    }).subscribe({
      next:  () => this.finalizarPago(),
      error: () => this.finalizarPago()  // aunque falle el registro, mostrar éxito al usuario
    });
  }

  private finalizarPago() {
    this.procesando.set(false);
    this.pagado.set(true);
    this.cart.clear();
  }

  volverHome() { this.router.navigate(['/home']); }
}
