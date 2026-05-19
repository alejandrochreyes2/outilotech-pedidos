import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FacturacionService } from '../../services/facturacion.service';
import QRCode from 'qrcode';

@Component({
  selector: 'app-imprimir-factura',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './imprimir-factura.component.html',
  styleUrls: ['./imprimir-factura.component.css'],
})
export class ImprimirFacturaComponent implements OnInit {
  private route  = inject(ActivatedRoute);
  private router = inject(Router);
  private svc    = inject(FacturacionService);

  cargando    = signal(true);
  errorMsg    = signal('');
  mensajeOk   = signal('');
  qrDataUrl   = signal('');
  editando    = signal(false);

  // Datos originales de la factura
  facturaId        = signal(0);
  numeroFactura    = signal('');
  fecha            = signal('');
  cajera           = signal('');
  estado           = signal('');
  wompiRef         = signal('');

  // Campos editables — Sección 1: FACTURA
  clienteNombre    = signal('');
  clienteId        = signal('');
  clienteEmail     = signal('');
  clienteTelefono  = signal('');

  // Sección 2: PRODUCTOS
  items            = signal<{ codigo: string; descripcion: string; cantidad: number; precioUnitario: number; subtotal: number }[]>([]);

  // Sección 3: PAGO
  descuento        = signal(0);
  total            = signal(0);
  subtotal         = signal(0);
  metodoPago       = signal('Contado / Efectivo');

  // Sección 6: GARANTÍA
  garantia = signal(
    'Cubre defectos de fabricación. NO cubre golpes, humedad, display roto, sellos rotos, apagado o manipulación. Indispensable presentar este ticket para reclamación.'
  );

  // Computed
  baseGravable = computed(() => {
    const s = this.items().reduce((a, i) => a + i.subtotal, 0);
    return Math.round(s / 1.19);
  });
  ivaTotal = computed(() => {
    const s = this.items().reduce((a, i) => a + i.subtotal, 0);
    return Math.round(s - s / 1.19);
  });
  totalFinal = computed(() => Math.max(0, this.items().reduce((a, i) => a + i.subtotal, 0) - this.descuento()));

  cufe = computed(() => {
    const raw = `outiltech-${this.facturaId()}-${this.numeroFactura()}-80244393-1`;
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const chr = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    const base = Math.abs(hash).toString(16).padStart(8, '0');
    return (base + base + base + base + base + base).substring(0, 96);
  });

  enviandoEmail = signal(false);

  ngOnInit() {
    const id = +this.route.snapshot.params['id'];
    this.facturaId.set(id);
    this.svc.obtenerFactura(id).subscribe({
      next: ({ factura, items }) => {
        this.numeroFactura.set(factura.numeroFactura);
        this.fecha.set(factura.fecha);
        this.cajera.set(factura.cajera);
        this.estado.set(factura.estado);
        this.clienteNombre.set(factura.clienteNombre ?? '');
        this.clienteId.set(factura.clienteId ?? '');
        this.clienteEmail.set(factura.clienteEmail ?? '');
        this.clienteTelefono.set(factura.clienteTelefono ?? '');
        this.descuento.set(factura.descuento);
        this.total.set(factura.total);
        this.subtotal.set(factura.subtotal);
        this.metodoPago.set(factura.metodoPago ?? 'Contado / Efectivo');
        this.items.set(items.map((i: any) => ({
          codigo: i.codigo,
          descripcion: i.descripcion,
          cantidad: i.cantidad,
          precioUnitario: i.precioUnitario,
          subtotal: i.subtotal,
        })));
        this.cargando.set(false);
        setTimeout(() => this.generarQR(), 200);
      },
      error: () => {
        this.errorMsg.set('No se pudo cargar la factura.');
        this.cargando.set(false);
      }
    });
  }

  private async generarQR() {
    try {
      const url = await QRCode.toDataURL('https://www.outiltech.co', {
        width: 120, margin: 1, color: { dark: '#000000', light: '#ffffff' }
      });
      this.qrDataUrl.set(url);
    } catch {}
  }

  formatPeso(v: number) { return v.toLocaleString('es-CO'); }
  sumSubtotal(acc: number, i: { subtotal: number }) { return acc + i.subtotal; }

  formatFecha(f: string) {
    if (!f) return '';
    try { return new Date(f).toLocaleDateString('es-CO', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }); }
    catch { return f; }
  }

  // Edición de ítems
  cambiarCantItem(i: number, delta: number) {
    const arr = [...this.items()];
    const nueva = Math.max(1, arr[i].cantidad + delta);
    arr[i] = { ...arr[i], cantidad: nueva, subtotal: nueva * arr[i].precioUnitario };
    this.items.set(arr);
  }
  cambiarPrecioItem(i: number, precio: number) {
    const arr = [...this.items()];
    arr[i] = { ...arr[i], precioUnitario: precio, subtotal: arr[i].cantidad * precio };
    this.items.set(arr);
  }
  cambiarDescItem(i: number, desc: string) {
    const arr = [...this.items()];
    arr[i] = { ...arr[i], descripcion: desc };
    this.items.set(arr);
  }
  agregarItem() {
    this.items.update(a => [...a, { codigo: '', descripcion: '', cantidad: 1, precioUnitario: 0, subtotal: 0 }]);
  }
  quitarItem(i: number) { this.items.update(a => a.filter((_, idx) => idx !== i)); }

  // Enviar email
  enviarEmail() {
    if (!this.clienteEmail().trim()) {
      this.errorMsg.set('Ingrese el email del cliente antes de enviar.');
      setTimeout(() => this.errorMsg.set(''), 3000);
      return;
    }
    this.enviandoEmail.set(true);
    this.svc.enviarEmailFactura(this.facturaId(), {
      clienteEmail:  this.clienteEmail().trim(),
      clienteNombre: this.clienteNombre().trim(),
      metodoPago:    this.metodoPago().trim(),
      garantia:      this.garantia().trim(),
    }).subscribe({
      next: r => {
        this.enviandoEmail.set(false);
        this.mensajeOk.set(`✅ ${r.mensaje}`);
        setTimeout(() => this.mensajeOk.set(''), 5000);
      },
      error: err => {
        this.enviandoEmail.set(false);
        const msg = err?.error?.error
          ?? err?.error?.detail
          ?? err?.error?.title
          ?? err?.message
          ?? 'Error al enviar el email. Verifique que el servidor tenga las credenciales SMTP configuradas.';
        this.errorMsg.set(msg);
        setTimeout(() => this.errorMsg.set(''), 8000);
      }
    });
  }

  // Imprimir físico (impresora térmica)
  imprimirFisico() {
    this.editando.set(false);
    setTimeout(() => window.print(), 200);
  }

  volver() { this.router.navigate(['/facturacion']); }
}
