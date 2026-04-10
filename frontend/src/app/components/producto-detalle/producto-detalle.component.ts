import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductosService, Producto, ProductoVariante } from '../../services/productos.service';
import { CartService } from '../../services/cart.service';
import { CartDropdownComponent } from '../cart-dropdown/cart-dropdown.component';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, CartDropdownComponent],
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent implements OnInit {
  producto: Producto | undefined;
  varianteSeleccionada = signal<ProductoVariante | undefined>(undefined);
  imagenActual = signal('');
  cantidad = signal(1);
  agregado = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productosService: ProductosService,
    public cartService: CartService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.producto = this.productosService.getProductoBySlug(params['slug']);
      if (!this.producto) { this.router.navigate(['/home']); return; }
      this.imagenActual.set(this.producto.imagenes[0]);
      if (this.producto.variantes?.length) this.varianteSeleccionada.set(this.producto.variantes[0]);
    });
  }

  get precioActual(): number {
    return this.varianteSeleccionada()?.precio ?? this.producto?.precio ?? 0;
  }

  seleccionarVariante(v: ProductoVariante) { this.varianteSeleccionada.set(v); }
  seleccionarImagen(img: string) { this.imagenActual.set(img); }
  cambiarCantidad(delta: number) { this.cantidad.set(Math.max(1, this.cantidad() + delta)); }

  agregarAlCarrito() {
    if (!this.producto) return;
    this.cartService.agregarItem(this.producto, this.varianteSeleccionada(), this.cantidad());
    this.agregado.set(true);
    setTimeout(() => this.agregado.set(false), 2000);
  }

  formatPrecio(p: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);
  }
}
