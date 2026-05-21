import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type Estado = 'login' | 'iniciando' | 'escaneando' | 'encontrado' | 'error' | 'enviado' | 'foto' | 'foto-enviada';

@Component({
  selector: 'app-mobile-scanner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-scanner.component.html',
})
export class MobileScannerComponent implements OnInit, OnDestroy {

  token = '';
  estado          = signal<Estado>('login');
  codigoDetectado = signal('');
  mensajeError    = signal('');
  scanActivo      = signal(false);
  entradaManual   = signal(false);
  codigoManual    = signal('');

  // Login
  loginEmail    = signal('');
  loginPassword = signal('');
  loginCargando = signal(false);
  loginError    = signal('');
  usuarioNombre = signal('');

  // Foto
  fotoDataUrl    = signal('');
  fotoMimeType   = signal('image/jpeg');
  fotoReferencia = signal('');
  fotoMarca      = signal('');
  fotoColor      = signal('');
  fotoCantidad   = signal('');
  fotoPrecio     = signal('');
  fotoEnviando   = signal(false);

  private jwtToken = '';
  private mediaStream: MediaStream | null = null;
  private animFrame: number | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.token = this.route.snapshot.params['token'] ?? '';
    if (!this.token) {
      this.estado.set('error');
      this.mensajeError.set('Token de sesión inválido. Solicite un nuevo QR a la cajera.');
      return;
    }
    // Verificar si ya hay sesión guardada en este dispositivo
    const saved = sessionStorage.getItem('scanner_jwt');
    const savedName = sessionStorage.getItem('scanner_nombre');
    if (saved) {
      this.jwtToken = saved;
      this.usuarioNombre.set(savedName ?? '');
      setTimeout(() => this.iniciarCamara(), 300);
    }
    // else: queda en estado 'login'
  }

  ngOnDestroy() { this.detener(); }

  // ── LOGIN ──────────────────────────────────────────────────
  iniciarSesion() {
    const email = this.loginEmail().trim();
    const pass  = this.loginPassword().trim();
    if (!email || !pass) { this.loginError.set('Complete email y contraseña.'); return; }

    this.loginCargando.set(true);
    this.loginError.set('');

    this.http.post<{ token: string; fullName: string; role: string }>(
      `${environment.apiUrl}/api/usuarios/auth/login`,
      { email, password: pass }
    ).subscribe({
      next: r => {
        this.jwtToken = r.token;
        this.usuarioNombre.set(r.fullName ?? email);
        sessionStorage.setItem('scanner_jwt', r.token);
        sessionStorage.setItem('scanner_nombre', r.fullName ?? email);
        this.loginCargando.set(false);
        this.loginPassword.set('');
        this.iniciarCamara();
      },
      error: err => {
        this.loginCargando.set(false);
        const status = err?.status;
        if (status === 401 || status === 400) {
          this.loginError.set('Correo o contraseña incorrectos.');
        } else {
          this.loginError.set('No se pudo conectar con el servidor. Intente de nuevo.');
        }
      }
    });
  }

  cerrarSesion() {
    sessionStorage.removeItem('scanner_jwt');
    sessionStorage.removeItem('scanner_nombre');
    this.jwtToken = '';
    this.usuarioNombre.set('');
    this.detener();
    this.estado.set('login');
    this.loginEmail.set('');
    this.loginPassword.set('');
    this.loginError.set('');
  }

  loginKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') this.iniciarSesion();
  }

  // ── CÁMARA ────────────────────────────────────────────────
  async iniciarCamara() {
    this.estado.set('iniciando');
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      this.estado.set('escaneando');
      await new Promise(r => setTimeout(r, 150));
      const video = document.getElementById('mov-video') as HTMLVideoElement;
      if (video) {
        video.srcObject = this.mediaStream;
        video.setAttribute('playsinline', '');
        video.setAttribute('autoplay', '');
        video.muted = true;
        try { await video.play(); } catch {}
      }
      this.scanActivo.set(true);
      this.escanearFrame();
    } catch (err: any) {
      this.estado.set('error');
      const msg = (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError')
        ? 'Permiso de cámara denegado. Pulse el ícono de cámara en la barra del navegador y permita el acceso.'
        : 'No se pudo acceder a la cámara. Intente con otro navegador (Chrome recomendado).';
      this.mensajeError.set(msg);
    }
  }

  private async escanearFrame() {
    if (!this.scanActivo()) return;
    const video = document.getElementById('mov-video') as HTMLVideoElement;
    if (!video || video.readyState < 2) {
      this.animFrame = requestAnimationFrame(() => this.escanearFrame());
      return;
    }
    try {
      if ('BarcodeDetector' in window) {
        const detector = new (window as any).BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'code_128', 'code_39', 'qr_code', 'upc_a', 'upc_e', 'data_matrix', 'itf']
        });
        const barcodes = await detector.detect(video);
        if (barcodes.length > 0) {
          await this.onDetectado(barcodes[0].rawValue);
          return;
        }
      }
    } catch {}
    if (this.scanActivo()) {
      this.animFrame = requestAnimationFrame(() => this.escanearFrame());
    }
  }

  async onDetectado(codigo: string) {
    this.detener();
    this.codigoDetectado.set(codigo);
    this.estado.set('encontrado');
    await this.enviarCodigo(codigo);
  }

  async enviarCodigo(codigo: string) {
    this.http.post(
      `${environment.apiUrl}/api/scan/session/${this.token}/resultado`,
      { codigo },
      { headers: { Authorization: `Bearer ${this.jwtToken}` } }
    ).subscribe({
      next: () => this.estado.set('enviado'),
      error: (err) => {
        if (err?.status === 401 || err?.status === 403) {
          this.cerrarSesion();
        } else {
          this.estado.set('error');
          this.mensajeError.set('No se pudo enviar el resultado. La sesión puede haber expirado — solicite un nuevo QR.');
        }
      }
    });
  }

  enviarManual() {
    const cod = this.codigoManual().trim();
    if (!cod) return;
    this.codigoDetectado.set(cod);
    this.estado.set('encontrado');
    this.enviarCodigo(cod);
  }

  // ── FOTO ──────────────────────────────────────────────────
  tomarFoto() {
    const video = document.getElementById('mov-video') as HTMLVideoElement;
    if (!video || video.readyState < 2) return;
    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
    this._fotoBase64 = dataUrl.split(',')[1];
    this.fotoDataUrl.set(dataUrl);
    this.fotoMimeType.set('image/jpeg');
    this.detener();
    this.estado.set('foto');
  }

  private _fotoBase64 = '';

  enviarFoto() {
    if (!this._fotoBase64 || this.fotoEnviando()) return;
    this.fotoEnviando.set(true);

    // Construir notas estructuradas desde campos separados
    const partes: string[] = [];
    if (this.fotoMarca().trim())    partes.push(`Marca: ${this.fotoMarca().trim()}`);
    if (this.fotoColor().trim())    partes.push(`Color: ${this.fotoColor().trim()}`);
    if (this.fotoCantidad().trim()) partes.push(`Cantidad: ${this.fotoCantidad().trim()}`);
    if (this.fotoPrecio().trim())   partes.push(`Precio: ${this.fotoPrecio().trim()}`);
    const notasEstructuradas = partes.join(' | ');

    this.http.post(
      `${environment.apiUrl}/api/scan/session/${this.token}/foto`,
      {
        referencia: this.fotoReferencia().trim(),
        notas     : notasEstructuradas,
        marca     : this.fotoMarca().trim(),
        color     : this.fotoColor().trim(),
        cantidad  : this.fotoCantidad().trim(),
        precio_estimado: this.fotoPrecio().trim(),
        imagen    : this._fotoBase64,
        mimeType  : this.fotoMimeType(),
      },
      { headers: { Authorization: `Bearer ${this.jwtToken}` } }
    ).subscribe({
      next: () => { this.fotoEnviando.set(false); this.estado.set('foto-enviada'); },
      error: () => {
        this.fotoEnviando.set(false);
        this.mensajeError.set('Error al enviar la foto. Intente de nuevo.');
        this.estado.set('error');
      }
    });
  }

  enviarFotoYVender() {
    if (!this._fotoBase64 || this.fotoEnviando()) return;
    this.fotoEnviando.set(true);

    // Parsear precio
    const precioStr = this.fotoPrecio().replace(/[$\s]/g, '').replace(/\./g, '').replace(',', '.');
    const precio    = parseFloat(precioStr) || 0;
    const cantidad  = parseInt(this.fotoCantidad()) || 1;

    // Guardar en sessionStorage para que facturacion lo agregue al abrir
    sessionStorage.setItem('scanner_vender', JSON.stringify({
      descripcion: this.fotoReferencia().trim() || 'Producto sin referencia',
      precio,
      cantidad
    }));

    const partes: string[] = [];
    if (this.fotoMarca().trim())    partes.push(`Marca: ${this.fotoMarca().trim()}`);
    if (this.fotoColor().trim())    partes.push(`Color: ${this.fotoColor().trim()}`);
    if (this.fotoCantidad().trim()) partes.push(`Cantidad: ${this.fotoCantidad().trim()}`);
    if (this.fotoPrecio().trim())   partes.push(`Precio: ${this.fotoPrecio().trim()}`);

    const headers = { Authorization: `Bearer ${this.jwtToken}` };

    // 1. Guardar foto en inventario_por_imagen
    this.http.post(
      `${environment.apiUrl}/api/scan/session/${this.token}/foto`,
      {
        referencia:      this.fotoReferencia().trim(),
        notas:           partes.join(' | '),
        marca:           this.fotoMarca().trim(),
        color:           this.fotoColor().trim(),
        cantidad:        this.fotoCantidad().trim(),
        precio_estimado: this.fotoPrecio().trim(),
        imagen:          this._fotoBase64,
        mimeType:        this.fotoMimeType(),
      },
      { headers }
    ).subscribe({
      next: () => {
        // 2. Publicar en BD para que PC lo recoja por polling
        this.http.post(
          `${environment.apiUrl}/api/facturacion/venta-pendiente`,
          { descripcion: this.fotoReferencia().trim() || 'Producto sin referencia', precio, cantidad },
          { headers }
        ).subscribe({ error: () => {} });

        this.fotoEnviando.set(false);
        this.router.navigate(['/facturacion']);
      },
      error: () => {
        this.fotoEnviando.set(false);
        sessionStorage.removeItem('scanner_vender');
        this.mensajeError.set('Error al guardar. Intente de nuevo.');
        this.estado.set('error');
      }
    });
  }

  volverACamara() {
    this.fotoDataUrl.set('');
    this._fotoBase64 = '';
    this.fotoReferencia.set('');
    this.fotoMarca.set('');
    this.fotoColor.set('');
    this.fotoCantidad.set('');
    this.fotoPrecio.set('');
    this.estado.set('iniciando');
    setTimeout(() => this.iniciarCamara(), 200);
  }

  reintentar() {
    this.codigoDetectado.set('');
    this.codigoManual.set('');
    this.entradaManual.set(false);
    this.fotoDataUrl.set('');
    this._fotoBase64 = '';
    this.mensajeError.set('');
    // Si tiene JWT activo, volver directo a cámara sin pasar por login
    if (this.jwtToken) {
      this.iniciarCamara();
    } else {
      this.estado.set('login');
    }
  }

  private detener() {
    this.scanActivo.set(false);
    if (this.animFrame) { cancelAnimationFrame(this.animFrame); this.animFrame = null; }
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.mediaStream = null;
  }
}
