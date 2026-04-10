import { Injectable, signal, computed } from '@angular/core';
import { Producto, ProductoVariante } from './productos.service';

export interface CartItem {
  producto: Producto;
  variante?: ProductoVariante;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  items = signal<CartItem[]>([]);
  isOpen = signal(false);

  totalItems = computed(() => this.items().reduce((sum, i) => sum + i.cantidad, 0));
  subtotal = computed(() => this.items().reduce((sum, i) => sum + i.subtotal, 0));
  total = computed(() => this.subtotal());

  agregarItem(producto: Producto, variante?: ProductoVariante, cantidad: number = 1) {
    const precio = variante ? variante.precio : producto.precio;
    const key = `${producto.id}-${variante?.storage || ''}`;
    const items = this.items();
    const idx = items.findIndex(i => `${i.producto.id}-${i.variante?.storage || ''}` === key);
    if (idx >= 0) {
      const updated = [...items];
      updated[idx] = { ...updated[idx], cantidad: updated[idx].cantidad + cantidad, subtotal: (updated[idx].cantidad + cantidad) * precio };
      this.items.set(updated);
    } else {
      this.items.set([...items, { producto, variante, cantidad, precioUnitario: precio, subtotal: precio * cantidad }]);
    }
    this.isOpen.set(true);
  }

  actualizarCantidad(index: number, cantidad: number) {
    if (cantidad <= 0) { this.eliminarItem(index); return; }
    const updated = [...this.items()];
    updated[index] = { ...updated[index], cantidad, subtotal: cantidad * updated[index].precioUnitario };
    this.items.set(updated);
  }

  eliminarItem(index: number) {
    this.items.set(this.items().filter((_, i) => i !== index));
  }

  limpiar() { this.items.set([]); }
  abrirCarrito() { this.isOpen.set(true); }
  cerrarCarrito() { this.isOpen.set(false); }
  toggleCarrito() { this.isOpen.set(!this.isOpen()); }
}
