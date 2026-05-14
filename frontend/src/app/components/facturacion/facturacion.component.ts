import {
  Component, OnInit, OnDestroy, signal, computed, inject, ViewChild, ElementRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  FacturacionService, ProductoPOS, ItemFactura
} from '../../services/facturacion.service';
import { AuthService } from '../../services/auth.service';
import { JhonIaService } from '../../services/jhon-ia.service';

@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit, OnDestroy {
  private svc    = inject(FacturacionService);
  private jhonSvc = inject(JhonIaService);
  auth            = inject(AuthService);

  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;

  // ── Estado de la pantalla ──────────────────────────────
  pestana = signal<'pos' | 'historial'>('pos');

  // ── Búsqueda ───────────────────────────────────────────
  searchQuery = signal('');
  tabCatalogo = signal<'stock' | 'catalogo'>('stock');
  productosBusqueda = signal<ProductoPOS[]>([]);
  buscando = signal(false);
  private searchTimer: any;

  // ── Factura actual ─────────────────────────────────────
  numeroFactura = signal('FE-2026-....');
  items = signal<ItemFactura[]>([]);
  descuento = signal(0);
  clienteNombre = signal('');
  clienteId = signal('');
  clienteTelefono = signal('');
  notas = signal('');

  subtotal  = computed(() => this.items().reduce((a, i) => a + i.subtotal, 0));
  total     = computed(() => Math.max(0, this.subtotal() - this.descuento()));

  // ── Estado de cobro ────────────────────────────────────
  cobrando = signal(false);
  mensajeExito = signal('');
  mensajeError = signal('');
  metodoPagoSeleccionado = signal<string | null>(null);

  // ── Catálogo de métodos de pago ────────────────────────
  readonly metodosPago = [
    { key: 'efectivo',  icon: '💵', label: 'Efectivo'  },
    { key: 'nequi',     icon: '📱', label: 'Nequi'     },
    { key: 'daviplata', icon: '📲', label: 'Daviplata' },
    { key: 'tarjeta',   icon: '💳', label: 'Tarjeta'   },
  ];
  readonly today = new Date();

  // ── Historial ─────────────────────────────────────────
  historial = signal<any[]>([]);
  cargandoHistorial = signal(false);
  filtroEstado = signal('');
  filtroFecha  = signal('');

  // ── JhonIA Panel ──────────────────────────────────────
  jhonPanelAbierto = signal(false);
  jhonMensajes = signal<{rol: 'user'|'jhon'; texto: string}[]>([
    { rol: 'jhon', texto: '¡Hola! Soy JhonIA. Puedo ayudarte con precios, stock y procesos de facturación. ¿En qué te ayudo?' }
  ]);
  jhonInput = signal('');
  jhonCargando = signal(false);
  private jhonSessionId = `pos-${Date.now()}`;

  toggleJhon() { this.jhonPanelAbierto.update(v => !v); }

  enviarAJhon() {
    const msg = this.jhonInput().trim();
    if (!msg || this.jhonCargando()) return;
    this.jhonMensajes.update(m => [...m, { rol: 'user', texto: msg }]);
    this.jhonInput.set('');
    this.jhonCargando.set(true);
    this.jhonSvc.enviarMensajePOS(msg, this.jhonSessionId).subscribe({
      next: r => {
        const texto = r.respuesta ?? r.mensaje ?? 'Sin respuesta';
        this.jhonMensajes.update(m => [...m, { rol: 'jhon', texto }]);
        this.jhonCargando.set(false);
        setTimeout(() => {
          const el = document.getElementById('jhon-chat-end');
          el?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      },
      error: () => {
        this.jhonMensajes.update(m => [...m, { rol: 'jhon', texto: 'Error al conectar con JhonIA.' }]);
        this.jhonCargando.set(false);
      }
    });
  }

  jhonKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); this.enviarAJhon(); }
  }

  // ── Scanner ZXing ─────────────────────────────────────
  mostrarScanner = signal(false);
  scannerActivo = signal(false);
  private scannerControls: any = null;
  private codeReader: any = null;
  mediaStream: MediaStream | null = null;

  ngOnInit() {
    this.cargarSiguienteNumero();
  }

  ngOnDestroy() {
    this.detenerScanner();
  }

  // ── Número de factura ──────────────────────────────────
  cargarSiguienteNumero() {
    this.svc.siguienteNumero().subscribe({
      next: r => this.numeroFactura.set(r.numero),
      error: () => {}
    });
  }

  // ── Búsqueda de productos ──────────────────────────────
  onSearch(event: Event) {
    const q = (event.target as HTMLInputElement).value;
    this.searchQuery.set(q);
    clearTimeout(this.searchTimer);
    if (q.length < 2) { this.productosBusqueda.set([]); return; }
    this.buscando.set(true);
    this.searchTimer = setTimeout(() => {
      this.svc.buscarProductos(q).subscribe({
        next: r => {
          const filtrado = this.tabCatalogo() === 'stock'
            ? r.filter(p => p.fuente === 'stock')
            : r.filter(p => p.fuente === 'catalogo');
          this.productosBusqueda.set(filtrado);
          this.buscando.set(false);
        },
        error: () => this.buscando.set(false)
      });
    }, 280);
  }

  cambiarTab(tab: 'stock' | 'catalogo') {
    this.tabCatalogo.set(tab);
    if (this.searchQuery().length >= 2) {
      const q = this.searchQuery();
      this.searchQuery.set('');
      setTimeout(() => {
        this.searchQuery.set(q);
        const input = document.getElementById('searchInput') as HTMLInputElement;
        if (input) input.dispatchEvent(new Event('input'));
      }, 50);
    }
  }

  productosFiltrados() {
    return this.productosBusqueda().filter(p => p.fuente === this.tabCatalogo());
  }

  // ── Items de la factura ────────────────────────────────
  agregarProducto(p: ProductoPOS) {
    if (p.stock === 0 && p.fuente === 'stock') {
      this.mostrarError('Sin stock disponible para ' + p.descripcion);
      return;
    }
    const actuales = this.items();
    const existe = actuales.findIndex(i => i.codigo === p.codigo);
    if (existe >= 0) {
      const nuevo = [...actuales];
      nuevo[existe] = {
        ...nuevo[existe],
        cantidad: nuevo[existe].cantidad + 1,
        subtotal: (nuevo[existe].cantidad + 1) * nuevo[existe].precio
      };
      this.items.set(nuevo);
    } else {
      this.items.set([...actuales, {
        codigo: p.codigo, descripcion: p.descripcion,
        cantidad: 1, precio: p.precio, fuente: p.fuente,
        subtotal: p.precio
      }]);
    }
  }

  cambiarCantidad(idx: number, delta: number) {
    const actuales = [...this.items()];
    const nueva = actuales[idx].cantidad + delta;
    if (nueva <= 0) { this.quitarItem(idx); return; }
    actuales[idx] = { ...actuales[idx], cantidad: nueva, subtotal: nueva * actuales[idx].precio };
    this.items.set(actuales);
  }

  quitarItem(idx: number) {
    this.items.set(this.items().filter((_, i) => i !== idx));
  }

  limpiarFactura() {
    this.items.set([]);
    this.descuento.set(0);
    this.clienteNombre.set('');
    this.clienteId.set('');
    this.clienteTelefono.set('');
    this.notas.set('');
    this.metodoPagoSeleccionado.set(null);
    this.mensajeExito.set('');
    this.mensajeError.set('');
    this.cargarSiguienteNumero();
  }

  // ── Cobrar ─────────────────────────────────────────────
  seleccionarMetodoPago(metodo: string) {
    this.metodoPagoSeleccionado.set(metodo);
  }

  cobrar() {
    if (this.items().length === 0) { this.mostrarError('Agregue productos a la factura'); return; }
    if (!this.metodoPagoSeleccionado()) { this.mostrarError('Seleccione un método de pago'); return; }
    this.cobrando.set(true);
    this.mensajeError.set('');

    const dto = {
      cajera: this.auth.currentUser()?.name ?? 'Cajera',
      clienteNombre: this.clienteNombre() || undefined,
      clienteId: this.clienteId() || undefined,
      clienteTelefono: this.clienteTelefono() || undefined,
      descuento: this.descuento(),
      notas: this.notas() || undefined,
      items: this.items().map(i => ({
        codigo: i.codigo, descripcion: i.descripcion,
        cantidad: i.cantidad, precio: i.precio, fuente: i.fuente
      }))
    };

    this.svc.crearFactura(dto).subscribe({
      next: factura => {
        this.svc.pagarFactura(factura.id, this.metodoPagoSeleccionado()!).subscribe({
          next: r => {
            this.cobrando.set(false);
            this.mensajeExito.set(
              `✅ ${factura.numeroFactura} cobrada por $${this.formatPeso(factura.total)} — ${this.metodoPagoSeleccionado()}`
            );
            setTimeout(() => this.limpiarFactura(), 3500);
          },
          error: err => {
            this.cobrando.set(false);
            const msg = err.error?.error ?? err.error?.detalle?.join(', ') ?? 'Error al pagar';
            this.mostrarError(msg);
          }
        });
      },
      error: err => {
        this.cobrando.set(false);
        this.mostrarError(err.error?.error ?? 'Error al crear la factura');
      }
    });
  }

  // ── Historial ─────────────────────────────────────────
  cargarHistorial() {
    this.cargandoHistorial.set(true);
    this.svc.listarFacturas({ estado: this.filtroEstado() || undefined, fecha: this.filtroFecha() || undefined })
      .subscribe({
        next: r => { this.historial.set(r); this.cargandoHistorial.set(false); },
        error: () => this.cargandoHistorial.set(false)
      });
  }

  verPestana(p: 'pos' | 'historial') {
    this.pestana.set(p);
    if (p === 'historial') this.cargarHistorial();
  }

  // ── Scanner ZXing ─────────────────────────────────────
  async abrirScanner() {
    this.mostrarScanner.set(true);
    setTimeout(() => this.iniciarScanner(), 300);
  }

  async iniciarScanner() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (this.videoEl?.nativeElement) {
        this.videoEl.nativeElement.srcObject = this.mediaStream;
        await this.videoEl.nativeElement.play();
      }
      this.scannerActivo.set(true);
      this.escanearFrame();
    } catch (err) {
      console.error('[SCANNER] Error al iniciar cámara:', err);
      this.mostrarError('No se pudo acceder a la cámara. Verifique los permisos.');
      this.cerrarScanner();
    }
  }

  private async escanearFrame() {
    if (!this.scannerActivo() || !this.videoEl?.nativeElement) return;
    const video = this.videoEl.nativeElement;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      try {
        // Usa BarcodeDetector nativo (Chrome 83+ en Android) o fallback manual
        if ('BarcodeDetector' in window) {
          const detector = new (window as any).BarcodeDetector({ formats: ['ean_13', 'code_128', 'qr_code', 'code_39', 'upc_a'] });
          const barcodes = await detector.detect(video);
          if (barcodes.length > 0) {
            await this.onCodigoDetectado(barcodes[0].rawValue);
            return;
          }
        }
      } catch {}
    }
    if (this.scannerActivo()) requestAnimationFrame(() => this.escanearFrame());
  }

  async onCodigoDetectado(codigo: string) {
    this.detenerScanner();
    const q = codigo.trim();
    this.svc.buscarProductos(q).subscribe({
      next: r => {
        if (r.length > 0) {
          this.agregarProducto(r[0]);
          this.mensajeExito.set(`Producto escaneado: ${r[0].descripcion}`);
          setTimeout(() => this.mensajeExito.set(''), 2500);
        } else {
          this.mostrarError(`Código ${q} no encontrado en inventario`);
        }
      }
    });
  }

  cerrarScanner() {
    this.detenerScanner();
    this.mostrarScanner.set(false);
  }

  private detenerScanner() {
    this.scannerActivo.set(false);
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }
  }

  // ── Helpers ────────────────────────────────────────────
  formatPeso(n: number) {
    return new Intl.NumberFormat('es-CO', { style: 'decimal', maximumFractionDigits: 0 }).format(n);
  }

  estadoClass(e: string) {
    return { pagada: 'badge-verde', anulada: 'badge-rojo', emitida: 'badge-azul', borrador: 'badge-gris' }[e] ?? '';
  }

  private mostrarError(msg: string) {
    this.mensajeError.set(msg);
    setTimeout(() => this.mensajeError.set(''), 4000);
  }
}
