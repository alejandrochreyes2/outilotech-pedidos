import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import emailjs from '@emailjs/browser';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';

const SUPABASE_URL = 'https://gklxdzhmpjwwmffjdmwv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdrbHhkemhtcGp3d21mZmpkbXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NTM0MDEsImV4cCI6MjA5MTQyOTQwMX0.Es3YyKtLnx9lKiA_xyTHxK_IDSICb9kGf5-nu2XE_jg';

// ── EmailJS — mismo servicio ya configurado en el componente de contacto ──────
const EMAILJS_SERVICE  = 'service_outiltech';
const EMAILJS_KEY      = 'K16QvN016m0k4KJdY';
// ALEJANDRO: Ve a emailjs.com → Email Templates → Create New Template
// Pon el HTML del template que está en el archivo:
//   frontend/src/app/components/checkout/emailjs-template-pedido.html
// Copia el Template ID que te asigne y ponlo aquí abajo:

const EMAILJS_TEMPLATE = 'template_zbn2qhv'; // ← reemplaza con el ID real
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  procesando             = false;
  codigoDescuento        = '';
  nequiTab: 'nequi' | 'daviplata' = 'nequi';
  pagoExitoso            = false;
  mostrarPagoDirecto     = false;
  mostrarFormComprobante = false;
  enviandoComprobante    = false;
  pedidoId               = 0;
  errorPago              = '';
  errorComprobante       = '';
  referenciaPagoDirecto  = '';
  comprobante = { numeroPagador: '', codigoComprobante: '' };

  // Validación de formulario
  bannerValidacion = false;
  camposInvalidos: Record<string, boolean> = {};

  // Guardamos items y datos del pedido para el email
  private _bodyPedido: any = null;

  form = {
    email: '', telefono: '', nombre: '', apellido: '', empresa: '',
    ciudad: '', direccion: '', barrio: '', tipoId: '', numeroId: '',
    envio: 'domicilio', metodoPago: 'tarjeta', facturacion: 'misma', terminos: false,
    numTarjeta: '', fechaTarjeta: '', cvv: '', titularTarjeta: '', cuotas: '1',
    banco: '', tipoCuenta: ''
  };

  constructor(public cartService: CartService, private http: HttpClient) {}

  // Valida todos los campos requeridos y marca los inválidos
  private validarFormulario(): boolean {
    this.camposInvalidos = {};

    const requeridos: Array<keyof typeof this.form> = [
      'email', 'telefono', 'nombre', 'apellido', 'ciudad', 'direccion', 'tipoId', 'numeroId'
    ];

    for (const campo of requeridos) {
      if (!this.form[campo] || String(this.form[campo]).trim() === '') {
        this.camposInvalidos[campo] = true;
      }
    }

    // Validar formato email
    if (this.form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.form.email.trim())) {
      this.camposInvalidos['email'] = true;
    }

    // Validar teléfono — mínimo 7 dígitos
    if (this.form.telefono && this.form.telefono.replace(/\D/g, '').length < 7) {
      this.camposInvalidos['telefono'] = true;
    }

    if (!this.form.terminos) {
      this.camposInvalidos['terminos'] = true;
    }

    this.bannerValidacion = Object.keys(this.camposInvalidos).length > 0;

    if (this.bannerValidacion) {
      // Scroll al banner de error
      setTimeout(() => {
        const banner = document.getElementById('banner-validacion');
        banner?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }

    return !this.bannerValidacion;
  }

  // Limpia el error de un campo cuando el usuario empieza a escribir
  limpiarError(campo: string) {
    delete this.camposInvalidos[campo];
    if (Object.keys(this.camposInvalidos).length === 0) {
      this.bannerValidacion = false;
    }
  }

  async procesarPago() {
    if (!this.validarFormulario()) return;

    if (this.cartService.items().length === 0 || this.cartService.total() <= 0) {
      this.errorPago = 'El carrito está vacío. Agrega productos antes de pagar.';
      return;
    }
    this.procesando = true;
    this.errorPago  = '';

    const items = this.cartService.items();
    const itemsJson = JSON.stringify(items.map(i => ({
      id:            i.producto.id,
      nombre:        i.producto.nombre,
      marca:         i.producto.marca,
      variante:      i.variante?.storage || i.variante?.color || '',
      cantidad:      i.cantidad,
      precioUnitario: i.precioUnitario,
      subtotal:      i.subtotal
    })));

    const body = {
      cliente:     `${this.form.nombre} ${this.form.apellido}`.trim() || this.form.email || 'Cliente',
      total:       this.cartService.total(),
      email:       this.form.email,
      telefono:    this.form.telefono,
      nombre:      this.form.nombre,
      apellido:    this.form.apellido,
      empresa:     this.form.empresa,
      ciudad:      this.form.ciudad,
      direccion:   this.form.direccion,
      barrio:      this.form.barrio,
      tipoId:      this.form.tipoId,
      numeroId:    this.form.numeroId,
      metodoEnvio: this.form.envio,
      metodoPago:  this.form.metodoPago,
      itemsJson
    };

    this._bodyPedido = { ...body, items };

    // ── NEQUI: mostrar QR INMEDIATAMENTE, guardar en background ──────────────
    if (this.form.metodoPago === 'nequi') {
      this.referenciaPagoDirecto = `OUTILTECH-${Date.now()}`;
      this.procesando            = false;
      this.mostrarPagoDirecto    = true;
      this.mostrarFormComprobante = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Guardar pedido en backend EN SEGUNDO PLANO (no bloquea la UI)
      fetch(`${environment.apiUrl}/api/pedidos/checkout`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body)
      })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.id) {
          this.pedidoId             = data.id;
          this.referenciaPagoDirecto = `OUTILTECH-${data.id}`;
        }
      })
      .catch(e => console.error('[CHECKOUT NEQUI]', e));

      this.syncSupabase(body, 0);
      return;
    }

    // ── OTROS MÉTODOS: aguardar respuesta del backend (necesitamos pedidoId) ──
    try {
      const res = await fetch(`${environment.apiUrl}/api/pedidos/checkout`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body)
      });
      if (res.ok) {
        const data    = await res.json();
        this.pedidoId = data?.id || 0;
      }
    } catch (err: any) {
      console.error('[CHECKOUT] Error guardando pedido:', err);
    }

    this.syncSupabase(body, this.pedidoId);

    // Wompi (tarjeta / PSE)
    if (['tarjeta', 'pse'].includes(this.form.metodoPago)) {
      await this.redirigirAWompi(body.total, this.pedidoId, body.email,
        `${this.form.nombre} ${this.form.apellido}`.trim(), this.form.telefono);
      return;
    }

    // Efectivo / ADDI: éxito directo + email
    this.procesando = false;
    this.cartService.limpiar();
    this.pagoExitoso = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.enviarEmailConfirmacion('confirmado', '');
  }

  // ── "Ya realicé el pago" — muestra el formulario de comprobante ─────────────
  confirmarPagoManual() {
    this.mostrarFormComprobante = true;
    this.errorComprobante       = '';
  }

  // ── Enviar comprobante Nequi ────────────────────────────────────────────────
  submitComprobante() {
    if (!this.comprobante.numeroPagador.trim() || !this.comprobante.codigoComprobante.trim()) {
      this.errorComprobante = 'Por favor completa los dos campos para confirmar tu pago.';
      return;
    }
    this.enviandoComprobante = true;
    this.errorComprobante    = '';

    const tipoPago = this.nequiTab === 'daviplata' ? 'Daviplata' : 'Nequi';
    const comprobanteStr = `Tipo: ${tipoPago} | Cel: ${this.comprobante.numeroPagador.trim()} | Comprobante: ${this.comprobante.codigoComprobante.trim()}`;

    // Guardar en backend (fetch nativo — sin interceptor JWT)
    if (this.pedidoId > 0) {
      fetch(`${environment.apiUrl}/api/pedidos/nequi-comprobante/${this.pedidoId}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          numeroPagador:     this.comprobante.numeroPagador.trim(),
          codigoComprobante: this.comprobante.codigoComprobante.trim(),
          tipoPago
        })
      })
      .then(r => console.log(`[COMPROBANTE] Pedido ${this.pedidoId} → HTTP ${r.status}`))
      .catch(e => console.warn('[COMPROBANTE]', e));
    }

    // Email de comprobante recibido
    this.enviarEmailConfirmacion('nequi_comprobante', comprobanteStr);

    this.enviandoComprobante    = false;
    this.mostrarPagoDirecto     = false;
    this.mostrarFormComprobante = false;
    this.cartService.limpiar();
    this.pagoExitoso            = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Email de confirmación vía EmailJS ──────────────────────────────────────
  private enviarEmailConfirmacion(estado: 'confirmado' | 'nequi_comprobante', comprobanteInfo: string) {
    const b = this._bodyPedido;
    if (!b || !b.email) return;

    const fmt = (n: number) =>
      new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

    const metodoPagoLabel: Record<string, string> = {
      tarjeta:  'Tarjeta de Crédito/Débito',
      pse:      'PSE / Mercado Pago',
      nequi:    'Nequi / Daviplata',
      efectivo: 'Efectivo (Efecty/Baloto)',
      addi:     'Addi – Cuotas'
    };

    const productosTexto = (b.items as any[]).map((i: any) =>
      `• ${i.marca} ${i.nombre}${i.variante ? ' (' + i.variante + ')' : ''} x${i.cantidad} — ${fmt(i.subtotal)}`
    ).join('\n');

    const esPendiente = estado === 'nequi_comprobante';
    const asunto = esPendiente
      ? `📋 Comprobante recibido – Pedido #${this.pedidoId} · Outiltech`
      : `✅ Pedido #${this.pedidoId} confirmado · Outiltech`;

    const params = {
      to_email:       b.email,
      to_name:        `${b.nombre} ${b.apellido}`.trim(),
      subject:        asunto,
      pedido_id:      String(this.pedidoId),
      nombre_cliente: `${b.nombre} ${b.apellido}`.trim(),
      email_cliente:  b.email,
      telefono:       b.telefono,
      ciudad:         b.ciudad,
      direccion:      `${b.direccion}${b.barrio ? ', ' + b.barrio : ''}`,
      metodo_envio:   b.metodoEnvio === 'tienda' ? 'Recoger en tienda (Cra 2A No 18A-52)' : 'Envío a domicilio (1-3 días hábiles)',
      metodo_pago:    metodoPagoLabel[b.metodoPago] || b.metodoPago,
      productos:      productosTexto,
      total:          fmt(b.total),
      estado:         esPendiente ? 'Pendiente de verificación' : 'Confirmado',
      comprobante:    comprobanteInfo || 'N/A',
      referencia:     this.referenciaPagoDirecto || `OUTILTECH-${this.pedidoId}`
    };

    // Email al cliente
    emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params, EMAILJS_KEY)
      .then(() => console.log('[EMAIL] Enviado al cliente', b.email))
      .catch(e => console.warn('[EMAIL] Error cliente:', e));

    // Copia al admin siempre
    emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
      ...params,
      to_email:  'contactanos@outiltech.co',
      to_name:   'Outiltech Admin',
      subject:   `[Admin] Pedido #${this.pedidoId} — ${b.nombre} ${b.apellido} — ${fmt(b.total)}`
    }, EMAILJS_KEY)
      .then(() => console.log('[EMAIL] Copia al admin enviada'))
      .catch(e => console.warn('[EMAIL] Error admin:', e));
  }

  private async redirigirAWompi(total: number, pedidoId: number, email: string, fullName: string, phone: string) {
    const reference   = `OUTILTECH-${pedidoId}-${Date.now()}`;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const redirectUrl = isLocalhost
      ? 'https://outiltech.co/payment-result'
      : `${window.location.origin}/payment-result`;

    try {
      const res: any = await this.http.post(
        `${environment.apiUrl}/api/pedidos/create-wompi-transaction`,
        { reference, amountCop: total, redirectUrl, email, fullName, phone }
      ).toPromise();

      sessionStorage.setItem('wompi_reference', reference);
      sessionStorage.setItem('wompi_pedidoId', String(pedidoId));
      this.cartService.limpiar();
      window.location.href = res.checkoutUrl;
    } catch (err: any) {
      console.error('[WOMPI]', err);
      this.errorPago  = 'No se pudo iniciar el pago. Intenta de nuevo.';
      this.procesando = false;
    }
  }

  private syncSupabase(body: any, pedidoId: number): void {
    const supabasePedido = {
      cliente:      body.cliente,
      total:        body.total,
      email:        body.email,
      telefono:     body.telefono,
      nombre:       body.nombre,
      apellido:     body.apellido,
      empresa:      body.empresa,
      ciudad:       body.ciudad,
      direccion:    body.direccion,
      barrio:       body.barrio,
      tipo_id:      body.tipoId,
      numero_id:    body.numeroId,
      metodo_envio: body.metodoEnvio,
      metodo_pago:  body.metodoPago,
      items_json:   body.itemsJson,
      estado:       'Pendiente'
    };

    const headers = {
      'apikey':        SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type':  'application/json',
      'Prefer':        'return=minimal'
    };

    this.http
      .post(`${SUPABASE_URL}/rest/v1/pedidos`, supabasePedido, { headers })
      .subscribe({
        next:  () => console.log('[SUPABASE] Pedido sincronizado OK'),
        error: (e) => console.warn('[SUPABASE] Sync falló (no crítico):', e.message)
      });
  }

  aplicarDescuento() { console.log('Código:', this.codigoDescuento); }

  formatPrecio(p: number): string {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(p);
  }
}
