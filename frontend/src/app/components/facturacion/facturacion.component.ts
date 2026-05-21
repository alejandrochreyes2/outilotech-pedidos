import {
  Component, OnInit, OnDestroy, signal, computed, inject, ViewChild, ElementRef, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  FacturacionService, ProductoPOS, ItemFactura
} from '../../services/facturacion.service';
import { AuthService } from '../../services/auth.service';
import { JhonIaService } from '../../services/jhon-ia.service';
import { environment } from '../../../environments/environment';
import QRCode from 'qrcode';

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
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('captureCanvas') captureCanvas!: ElementRef<HTMLCanvasElement>;

  // ── Estado de la pantalla ──────────────────────────────
  pestana    = signal<'pos' | 'historial'>('pos');
  vistaMovil = signal<'catalogo' | 'factura'>('catalogo');

  // ── Búsqueda ───────────────────────────────────────────
  searchQuery = signal('');
  tabCatalogo = signal<'stock' | 'catalogo' | 'todo'>('stock');
  productosBusqueda = signal<ProductoPOS[]>([]);
  productosTodo = signal<ProductoPOS[]>([]);
  cargandoTodo = signal(false);
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
        setTimeout(() => document.getElementById('jhon-chat-end')?.scrollIntoView({ behavior: 'smooth' }), 100);
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

  // ── SCANNER — estado ───────────────────────────────────
  mostrarScanner  = signal(false);
  modoScanner     = signal<'opciones' | 'camara' | 'movil' | 'ocr'>('opciones');
  scannerActivo   = signal(false);
  mediaStream: MediaStream | null = null;
  private animFrame: number | null = null;

  // ── SCANNER MÓVIL — sesión ─────────────────────────────
  scanToken       = signal('');
  scanQrUrl       = signal('');
  scanEsperando   = signal(false);
  scanRecibido    = signal(false);
  private pollInterval: any;

  // ── OCR — estado ──────────────────────────────────────
  ocrProcesando   = signal(false);
  ocrTextoExtraido = signal('');
  ocrResultados   = signal<ProductoPOS[]>([]);

  // ── Inventario por imagen ──────────────────────────────
  fotosPendientes  = signal<any[]>([]);
  fotosPendientesCnt = signal(0);
  mostrarFotos     = signal(false);
  imagenSeleccionada = signal<{id:number; imagen:string; mimeType:string; referencia:string; notas:string} | null>(null);
  zoomFoto         = signal(1);   // zoom en visor de lista de fotos
  fotoPin          = signal<{imagen:string; mimeType:string; referencia:string; notas:string} | null>(null); // foto fijada en modal producto
  zoomFotoPin      = signal(1);   // zoom de la foto fijada
  editandoFotoPin  = signal(false);
  fpRefEdit        = signal('');
  fpNotasEdit      = signal('');
  analizandoFotos  = signal(false);
  resultadosAnalisis = signal<any[]>([]);
  mostrarResultadosAnalisis = signal(false);

  // ── JhonIA panel interno ────────────────────────────────
  mostrarJhonIA      = signal(false);
  jhonIAEstado       = signal<any>(null);
  jhonIACargando     = signal(false);
  jhonIAEnriqueciendo = signal(false);
  jhonIAResultados   = signal<any[]>([]);

  // ── Nuevo producto desde barcode desconocido ──────────
  mostrarNuevoProducto = signal(false);
  npCodigo      = signal('');
  npDescripcion = signal('');
  npPrecio      = signal(0);
  npCosto       = signal(0);
  npCategoria   = signal('Accesorio');
  npCantidad    = signal(1);
  npGuardando   = signal(false);
  npFotoId      = signal<number | null>(null); // ID de la foto que originó este modal

  // ── Drag del botón JhonIA ─────────────────────────────
  jhonPos      = signal<{top:number; left:number} | null>(null);
  jhonDragging = signal(false);
  private _jhonDragOffX = 0;
  private _jhonDragOffY = 0;
  private _jhonMoved    = false;

  startDragJhon(e: MouseEvent | TouchEvent) {
    const el = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = e instanceof MouseEvent ? e.clientX : (e as TouchEvent).touches[0].clientX;
    const cy = e instanceof MouseEvent ? e.clientY : (e as TouchEvent).touches[0].clientY;
    this._jhonDragOffX = cx - el.left;
    this._jhonDragOffY = cy - el.top;
    this.jhonDragging.set(true);
    this._jhonMoved = false;
    e.preventDefault();
  }

  @HostListener('document:mousemove', ['$event'])
  @HostListener('document:touchmove', ['$event'])
  onJhonMove(e: MouseEvent | TouchEvent) {
    if (!this.jhonDragging()) return;
    const cx = e instanceof MouseEvent ? e.clientX : (e as TouchEvent).touches[0].clientX;
    const cy = e instanceof MouseEvent ? e.clientY : (e as TouchEvent).touches[0].clientY;
    const top  = Math.max(0, Math.min(window.innerHeight - 48, cy - this._jhonDragOffY));
    const left = Math.max(0, Math.min(window.innerWidth  - 96, cx - this._jhonDragOffX));
    this.jhonPos.set({ top, left });
    this._jhonMoved = true;
    e.preventDefault();
  }

  @HostListener('document:mouseup')
  @HostListener('document:touchend')
  onJhonUp() { this.jhonDragging.set(false); }

  clickJhon() {
    if (!this._jhonMoved) this.toggleJhon();
    this._jhonMoved = false;
  }

  ngOnInit() {
    this.cargarSiguienteNumero();
    this.cargarFotosPendientes();
  }

  ngOnDestroy() {
    this.detenerScanner();
    this.limpiarSesionMovil();
  }

  // ── Número de factura ──────────────────────────────────
  cargarSiguienteNumero() {
    this.svc.siguienteNumero().subscribe({ next: r => this.numeroFactura.set(r.numero), error: () => {} });
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
          let filtrado: ProductoPOS[];
          if (this.tabCatalogo() === 'stock') {
            filtrado = r.filter(p => p.fuente === 'stock' || p.fuente === 'imagen');
          } else {
            filtrado = r.filter(p => p.fuente === 'catalogo' || p.fuente === 'imagen');
          }
          this.productosBusqueda.set(filtrado);
          this.buscando.set(false);
        },
        error: () => this.buscando.set(false)
      });
    }, 280);
  }

  cambiarTab(tab: 'stock' | 'catalogo' | 'todo') {
    this.tabCatalogo.set(tab);
    if (tab === 'todo') {
      this.cargarTodos();
      return;
    }
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

  cargarTodos() {
    if (this.cargandoTodo()) return;
    this.cargandoTodo.set(true);
    this.svc.listarTodosProductos().subscribe({
      next: r => { this.productosTodo.set(r); this.cargandoTodo.set(false); },
      error: () => this.cargandoTodo.set(false)
    });
  }

  // ── Items de la factura ────────────────────────────────
  agregarProducto(p: ProductoPOS) {
    if (p.stock === 0 && p.fuente === 'stock') { this.mostrarError('Sin stock disponible para ' + p.descripcion); return; }
    const actuales = this.items();
    const existe = actuales.findIndex(i => i.codigo === p.codigo);
    if (existe >= 0) {
      const nuevo = [...actuales];
      nuevo[existe] = { ...nuevo[existe], cantidad: nuevo[existe].cantidad + 1, subtotal: (nuevo[existe].cantidad + 1) * nuevo[existe].precio };
      this.items.set(nuevo);
    } else {
      this.items.set([...actuales, { codigo: p.codigo, descripcion: p.descripcion, cantidad: 1, precio: p.precio, fuente: p.fuente, subtotal: p.precio }]);
    }
    // En móvil, al agregar un producto ir directo a la factura
    if (window.innerWidth <= 768) this.vistaMovil.set('factura');
  }

  cambiarCantidad(idx: number, delta: number) {
    const actuales = [...this.items()];
    const nueva = actuales[idx].cantidad + delta;
    if (nueva <= 0) { this.quitarItem(idx); return; }
    actuales[idx] = { ...actuales[idx], cantidad: nueva, subtotal: nueva * actuales[idx].precio };
    this.items.set(actuales);
  }

  quitarItem(idx: number) { this.items.set(this.items().filter((_, i) => i !== idx)); }

  // ── Edición de ítem ────────────────────────────────────
  editIdx      = signal<number | null>(null);
  editDesc     = signal('');
  editCant     = signal(1);
  editPrecio   = signal(0);

  abrirEdicion(i: number) {
    const it = this.items()[i];
    this.editIdx.set(i);
    this.editDesc.set(it.descripcion);
    this.editCant.set(it.cantidad);
    this.editPrecio.set(it.precio);
  }

  guardarEdicion() {
    const i = this.editIdx();
    if (i === null) return;
    const desc   = this.editDesc().trim() || this.items()[i].descripcion;
    const cant   = Math.max(1, this.editCant());
    const precio = Math.max(0, this.editPrecio());
    const actuales = [...this.items()];
    actuales[i] = { ...actuales[i], descripcion: desc, cantidad: cant, precio, subtotal: cant * precio };
    this.items.set(actuales);
    this.editIdx.set(null);
  }

  cancelarEdicion() { this.editIdx.set(null); }

  limpiarFactura() {
    this.items.set([]); this.descuento.set(0); this.clienteNombre.set('');
    this.clienteId.set(''); this.clienteTelefono.set(''); this.notas.set('');
    this.metodoPagoSeleccionado.set(null); this.mensajeExito.set(''); this.mensajeError.set('');
    this.cargarSiguienteNumero();
  }

  // ── Cobrar ─────────────────────────────────────────────
  seleccionarMetodoPago(metodo: string) { this.metodoPagoSeleccionado.set(metodo); }

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
      items: this.items().map(i => ({ codigo: i.codigo, descripcion: i.descripcion, cantidad: i.cantidad, precio: i.precio, fuente: i.fuente }))
    };
    this.svc.crearFactura(dto).subscribe({
      next: factura => {
        this.svc.pagarFactura(factura.id, this.metodoPagoSeleccionado()!).subscribe({
          next: () => {
            this.cobrando.set(false);
            this.mensajeExito.set(`✅ ${factura.numeroFactura} cobrada por $${this.formatPeso(factura.total)} — ${this.metodoPagoSeleccionado()}`);
            setTimeout(() => this.limpiarFactura(), 3500);
          },
          error: err => {
            this.cobrando.set(false);
            this.mostrarError(err.error?.error ?? err.error?.detalle?.join(', ') ?? 'Error al pagar');
          }
        });
      },
      error: err => { this.cobrando.set(false); this.mostrarError(err.error?.error ?? 'Error al crear la factura'); }
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

  verPestana(p: 'pos' | 'historial') { this.pestana.set(p); if (p === 'historial') this.cargarHistorial(); }

  // ══════════════════════════════════════════════════════════
  // SCANNER — MODAL CON 3 MODOS
  // ══════════════════════════════════════════════════════════

  abrirScanner() {
    this.ocrTextoExtraido.set('');
    this.ocrResultados.set([]);
    this.mostrarScanner.set(true);
    // En móvil ir directo a la cámara del dispositivo (no mostrar opciones)
    if (window.innerWidth <= 768) {
      this.modoScanner.set('camara');
      setTimeout(() => this.iniciarCamaraLocal(), 300);
    } else {
      this.modoScanner.set('opciones');
    }
  }

  cerrarScanner() {
    this.detenerScanner();
    this.limpiarSesionMovil();
    this.mostrarScanner.set(false);
    this.modoScanner.set('opciones');
    this.ocrTextoExtraido.set('');
    this.ocrResultados.set([]);
  }

  // ── Modo 1: cámara de este dispositivo ────────────────
  usarCamaraDispositivo() {
    this.modoScanner.set('camara');
    setTimeout(() => this.iniciarCamaraLocal(), 300);
  }

  private async iniciarCamaraLocal() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 } }
      });
      if (this.videoEl?.nativeElement) {
        this.videoEl.nativeElement.srcObject = this.mediaStream;
        await this.videoEl.nativeElement.play();
      }
      this.scannerActivo.set(true);
      this.escanearFrame();
    } catch (err) {
      this.mostrarError('No se pudo acceder a la cámara. Verifique los permisos.');
      this.modoScanner.set('opciones');
    }
  }

  private async escanearFrame() {
    if (!this.scannerActivo() || !this.videoEl?.nativeElement) return;
    const video = this.videoEl.nativeElement;
    if (video.readyState >= 2) {
      try {
        if ('BarcodeDetector' in window) {
          const detector = new (window as any).BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'qr_code', 'upc_a', 'upc_e', 'data_matrix', 'itf']
          });
          const barcodes = await detector.detect(video);
          if (barcodes.length > 0) {
            await this.onCodigoDetectado(barcodes[0].rawValue);
            return;
          }
        }
      } catch {}
    }
    if (this.scannerActivo()) {
      this.animFrame = requestAnimationFrame(() => this.escanearFrame());
    }
  }

  async onCodigoDetectado(codigo: string) {
    this.detenerScanner();
    const q = codigo.trim();
    this.cerrarScanner();
    this.searchQuery.set(q);
    const input = document.getElementById('searchInput') as HTMLInputElement;
    if (input) { input.value = q; input.dispatchEvent(new Event('input')); }
    this.svc.buscarProductos(q).subscribe({
      next: r => {
        const encontrados = r.filter(p => p.fuente !== 'imagen');
        if (encontrados.length > 0) {
          this.agregarProducto(encontrados[0]);
          this.mensajeExito.set(`📷 Escaneado: ${encontrados[0].descripcion}`);
          setTimeout(() => this.mensajeExito.set(''), 3000);
        } else {
          // Código no encontrado → abrir modal para agregar producto nuevo
          this.npCodigo.set(q);
          this.npDescripcion.set('');
          this.npPrecio.set(0);
          this.npCosto.set(0);
          this.npCategoria.set('Accesorio');
          this.npCantidad.set(1);
          this.mostrarNuevoProducto.set(true);
        }
      }
    });
  }

  // ── Agregar producto nuevo desde barcode desconocido ──
  guardarProductoNuevo() {
    if (!this.npDescripcion().trim()) { this.mostrarError('La descripción es obligatoria'); return; }
    this.npGuardando.set(true);
    this.svc.agregarProductoNuevo({
      codigoBarras: this.npCodigo(),
      descripcion:  this.npDescripcion().trim(),
      precio:       this.npPrecio(),
      costo:        this.npCosto(),
      categoria:    this.npCategoria(),
      cantidad:     this.npCantidad(),
      cajera:       this.auth.currentUser()?.name ?? ''
    }).subscribe({
      next: r => {
        this.npGuardando.set(false);
        this.mostrarNuevoProducto.set(false);
        this.fotoPin.set(null);
        // Si vino de una foto pendiente, marcarla como revisada
        const fotoId = this.npFotoId();
        if (fotoId) {
          this.svc.marcarImagenRevisada(fotoId).subscribe({ error: () => {} });
          this.npFotoId.set(null);
        }
        // Recargar contador de fotos
        this.cargarFotosPendientes();
        const producto: ProductoPOS = {
          codigo: r.codigo, descripcion: r.descripcion,
          stock: r.stock, precio: r.precio, costo: this.npCosto(), fuente: 'stock'
        };
        this.agregarProducto(producto);
        this.mensajeExito.set(`✅ ${r.mensaje} Producto agregado a la factura.`);
        setTimeout(() => this.mensajeExito.set(''), 4000);
      },
      error: () => { this.npGuardando.set(false); this.mostrarError('Error al guardar el producto'); }
    });
  }

  cerrarNuevoProducto() {
    this.mostrarNuevoProducto.set(false);
    this.npFotoId.set(null);
    this.fotoPin.set(null);
    this.editandoFotoPin.set(false);
  }

  iniciarEditFotoPin() {
    const fp = this.fotoPin();
    if (!fp) return;
    this.fpRefEdit.set(fp.referencia || '');
    this.fpNotasEdit.set(fp.notas || '');
    this.editandoFotoPin.set(true);
  }

  guardarEditFotoPin() {
    const fp = this.fotoPin();
    if (!fp) return;
    const nuevaRef   = this.fpRefEdit().trim();
    const nuevasNotas = this.fpNotasEdit().trim();
    this.fotoPin.set({ ...fp, referencia: nuevaRef, notas: nuevasNotas });
    if (nuevaRef) this.npDescripcion.set(nuevaRef);
    this.editandoFotoPin.set(false);
    // Persistir en BD si tenemos el id de la foto
    const fotoId = this.npFotoId();
    if (fotoId) {
      this.svc.actualizarImagenInventario(fotoId, nuevaRef, nuevasNotas)
        .subscribe({ error: () => {} });
    }
  }

  // ── Analizar fotos sin referencia con Claude Vision ──
  analizarFotosSinReferencia() {
    if (this.analizandoFotos()) return;
    this.analizandoFotos.set(true);
    this.resultadosAnalisis.set([]);
    this.mostrarResultadosAnalisis.set(false);
    this.svc.analizarFotosSinReferencia().subscribe({
      next: r => {
        this.analizandoFotos.set(false);
        if (r.analizadas > 0 && r.resultados) {
          this.resultadosAnalisis.set(r.resultados);
          this.mostrarResultadosAnalisis.set(true);
          this.cargarFotosPendientes();
        } else {
          this.mensajeExito.set(r.mensaje ?? 'No hay imágenes sin referencia.');
          setTimeout(() => this.mensajeExito.set(''), 3000);
        }
      },
      error: () => {
        this.analizandoFotos.set(false);
        this.mensajeError.set('Error al analizar imágenes con IA.');
        setTimeout(() => this.mensajeError.set(''), 3000);
      }
    });
  }

  // ── Inventario por imagen ─────────────────────────────
  cargarFotosPendientes() {
    this.svc.listarInventarioPorImagen(true).subscribe({
      next: r => { this.fotosPendientes.set(r); this.fotosPendientesCnt.set(r.length); },
      error: () => {}
    });
  }

  verFoto(item: any) {
    this.svc.obtenerImagenInventario(item.id).subscribe({
      next: r => {
        this.zoomFoto.set(1);
        this.imagenSeleccionada.set({
          id: item.id, imagen: r.imagen, mimeType: r.mimeType,
          referencia: item.referencia, notas: item.notas
        });
      },
      error: () => {}
    });
  }

  marcarFotoRevisada(id: number) {
    this.svc.marcarImagenRevisada(id).subscribe({
      next: () => {
        this.imagenSeleccionada.set(null);
        this.cargarFotosPendientes();
        this.mensajeExito.set('Foto marcada como revisada');
        setTimeout(() => this.mensajeExito.set(''), 2000);
      }
    });
  }

  agregarDesdeFoto(item: any) {
    this.npCodigo.set('');
    this.npDescripcion.set(item.referencia || item.descripcion || '');
    this.npPrecio.set(0);
    this.npCosto.set(0);
    this.npCategoria.set('Accesorio');
    this.npCantidad.set(1);
    this.npFotoId.set(item.id ?? null);

    // Fijar la foto en el panel izquierdo del modal de nuevo producto
    const img = this.imagenSeleccionada();
    if (img) {
      this.zoomFotoPin.set(1);
      this.fotoPin.set({ imagen: img.imagen, mimeType: img.mimeType, referencia: img.referencia, notas: img.notas });
    } else {
      this.fotoPin.set(null);
    }

    this.mostrarFotos.set(false);
    this.imagenSeleccionada.set(null);
    this.mostrarNuevoProducto.set(true);
  }

  detenerScanner() {
    this.scannerActivo.set(false);
    if (this.animFrame) { cancelAnimationFrame(this.animFrame); this.animFrame = null; }
    if (this.mediaStream) { this.mediaStream.getTracks().forEach(t => t.stop()); this.mediaStream = null; }
  }

  // ── OCR: capturar frame y extraer texto ───────────────
  capturarOCR() {
    if (!this.videoEl?.nativeElement) return;
    const video = this.videoEl.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);
    this.modoScanner.set('ocr');
    this.detenerScanner();
    this.ocrProcesando.set(true);
    this.ocrTextoExtraido.set('');
    this.ocrResultados.set([]);

    // Guardar la imagen capturada en el canvas de previsualización
    const previewCanvas = document.getElementById('ocr-preview') as HTMLCanvasElement;
    if (previewCanvas) {
      previewCanvas.width = canvas.width;
      previewCanvas.height = canvas.height;
      previewCanvas.getContext('2d')!.drawImage(canvas, 0, 0);
    }

    // Cargar Tesseract.js dinámicamente
    this.cargarTesseract().then(Tesseract => {
      Tesseract.recognize(canvas, 'spa+eng', {})
        .then(({ data }: any) => {
          const texto = data.text.trim();
          this.ocrTextoExtraido.set(texto);
          this.ocrProcesando.set(false);
          // Extraer palabras clave y buscar
          const lineas = texto.split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 2);
          if (lineas.length > 0) this.buscarPorOCR(lineas[0]);
        })
        .catch(() => {
          this.ocrProcesando.set(false);
          this.ocrTextoExtraido.set('No se pudo extraer texto. Intente manualmente.');
        });
    });
  }

  private cargarTesseract(): Promise<any> {
    return new Promise((resolve, reject) => {
      if ((window as any).Tesseract) { resolve((window as any).Tesseract); return; }
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
      script.onload = () => resolve((window as any).Tesseract);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  buscarPorOCR(texto: string) {
    if (!texto.trim()) return;
    this.ocrTextoExtraido.set(texto);
    this.svc.buscarProductos(texto.trim()).subscribe({
      next: r => this.ocrResultados.set(r.slice(0, 8)),
      error: () => {}
    });
  }

  agregarDesdeOCR(p: ProductoPOS) {
    this.agregarProducto(p);
    this.cerrarScanner();
    this.mensajeExito.set(`📝 Agregado: ${p.descripcion}`);
    setTimeout(() => this.mensajeExito.set(''), 3000);
  }

  // ── Modo 2: escáner móvil via QR ──────────────────────
  usarMovil() {
    this.modoScanner.set('movil');
    this.scanRecibido.set(false);
    this.scanEsperando.set(true);
    this.svc.crearSesionScanner().subscribe({
      next: r => {
        this.scanToken.set(r.token);
        const url = `${window.location.origin}/scanner/${r.token}`;
        this.scanQrUrl.set(url);
        // Generar QR en el canvas
        setTimeout(() => this.generarQR(url), 200);
        // Empezar a sondear resultado
        this.iniciarPolling();
      },
      error: () => {
        this.mostrarError('No se pudo crear la sesión de escaneo.');
        this.modoScanner.set('opciones');
      }
    });
  }

  private async generarQR(url: string) {
    const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement;
    if (!canvas) return;
    try {
      await QRCode.toCanvas(canvas, url, {
        width: 220,
        margin: 2,
        color: { dark: '#ffffff', light: '#1a1a1a' }
      });
    } catch (e) { console.error('[QR]', e); }
  }

  private iniciarPolling() {
    clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      if (!this.scanToken()) { clearInterval(this.pollInterval); return; }
      this.svc.consultarSesionScanner(this.scanToken()).subscribe({
        next: r => {
          if (!r.pendiente && r.resultado) {
            clearInterval(this.pollInterval);
            this.scanEsperando.set(false);
            this.scanRecibido.set(true);
            this.onCodigoDetectado(r.resultado);
            this.limpiarSesionMovil();
          }
        },
        error: () => {}
      });
    }, 2000);
  }

  limpiarSesionMovil() {
    clearInterval(this.pollInterval);
    if (this.scanToken()) {
      this.svc.cancelarSesionScanner(this.scanToken()).subscribe({ error: () => {} });
      this.scanToken.set('');
      this.scanQrUrl.set('');
    }
    this.scanEsperando.set(false);
    this.scanRecibido.set(false);
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

  // ── JhonIA panel ─────────────────────────────────────────
  abrirJhonIA() {
    this.mostrarJhonIA.set(true);
    this.cargarEstadoJhonIA();
  }

  cargarEstadoJhonIA() {
    this.jhonIACargando.set(true);
    this.svc.jhonIAEstado().subscribe({
      next: r => { this.jhonIAEstado.set(r); this.jhonIACargando.set(false); },
      error: () => this.jhonIACargando.set(false)
    });
  }

  enriquecerInventario() {
    if (this.jhonIAEnriqueciendo()) return;
    this.jhonIAEnriqueciendo.set(true);
    this.jhonIAResultados.set([]);
    this.svc.jhonIAEnriquecerInventario(5, true).subscribe({
      next: r => {
        this.jhonIAEnriqueciendo.set(false);
        this.jhonIAResultados.set(r.resultados ?? []);
        this.cargarEstadoJhonIA();
      },
      error: () => {
        this.jhonIAEnriqueciendo.set(false);
        this.mostrarError('Error al enriquecer inventario con JhonIA.');
      }
    });
  }
}
