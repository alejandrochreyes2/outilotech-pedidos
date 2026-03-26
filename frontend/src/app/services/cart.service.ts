import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  img: string;
  brand: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private _items = signal<CartItem[]>([]);

  isOpen = signal(false);
  openCart()  { this.isOpen.set(true); }
  closeCart() { this.isOpen.set(false); }
  toggleCart(){ this.isOpen.update(v => !v); }

  readonly cartItems = this._items.asReadonly();
  readonly cartCount = computed(() => this._items().reduce((acc, i) => acc + i.quantity, 0));
  readonly cartTotal = computed(() => this._items().reduce((acc, i) => acc + i.priceNum * i.quantity, 0));

  addItem(item: Omit<CartItem, 'quantity'>) {
    this._items.update(current => {
      const idx = current.findIndex(i => i.id === item.id);
      if (idx >= 0) {
        const updated = [...current];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
        return updated;
      }
      return [...current, { ...item, quantity: 1 }];
    });
    this.openCart();
  }

  removeItem(id: string) {
    this._items.update(current => current.filter(i => i.id !== id));
  }

  increment(id: string) {
    this._items.update(current => {
      const idx = current.findIndex(i => i.id === id);
      if (idx < 0) return current;
      const updated = [...current];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + 1 };
      return updated;
    });
  }

  decrement(id: string) {
    this._items.update(current => {
      const idx = current.findIndex(i => i.id === id);
      if (idx < 0) return current;
      if (current[idx].quantity <= 1) {
        return current.filter(i => i.id !== id);
      }
      const updated = [...current];
      updated[idx] = { ...updated[idx], quantity: updated[idx].quantity - 1 };
      return updated;
    });
  }

  clear() { this._items.set([]); }

  formatTotal(): string {
    return '$' + this.cartTotal().toLocaleString('es-CO');
  }

  formatPrice(num: number): string {
    return '$' + num.toLocaleString('es-CO');
  }
}
