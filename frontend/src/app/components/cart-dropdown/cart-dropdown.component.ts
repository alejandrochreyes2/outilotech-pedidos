import { Component, inject, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-dropdown',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-dropdown.component.html',
  styleUrls: ['./cart-dropdown.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartDropdownComponent {
  cart   = inject(CartService);
  router = inject(Router);
  close  = output<void>();

  onClose()               { this.close.emit(); }
  increment(id: string)   { this.cart.increment(id); }
  decrement(id: string)   { this.cart.decrement(id); }
  remove(id: string)      { this.cart.removeItem(id); }
  clearCart()             { this.cart.clear(); }
  trackById(_: number, item: any) { return item.id; }

  irAPagar() {
    this.close.emit();
    this.router.navigate(['/checkout']);
  }
}
