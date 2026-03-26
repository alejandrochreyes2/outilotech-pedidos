import { Component, signal, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { CartDropdownComponent } from '../cart-dropdown/cart-dropdown.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule, CartDropdownComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  cart = inject(CartService);
  activeMenu: string | null = null;
  mobileOpen = signal(false);

  openMenu(name: string) { this.activeMenu = name; }
  closeMenu() { this.activeMenu = null; }
  toggleMobile() { this.mobileOpen.update(v => !v); }
  toggleCart() { this.cart.toggleCart(); }
  closeCart() { this.cart.closeCart(); }
}
