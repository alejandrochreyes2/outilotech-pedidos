import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

type Estado = 'iniciando' | 'escaneando' | 'encontrado' | 'error' | 'enviado' | 'foto' | 'foto-enviada';

@Component({
  selector: 'app-mobile-scanner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-scanner.component.html',
})
export class MobileScannerComponent implements OnInit, OnDestroy {

  token = '';
  estado       = signal<Estado>('iniciando');
  codigoDetectado = signal('');
  mensajeError    = signal('');
  scanActivo      = signal(false);
  entradaManual   = signal(false);
  codigoManual    = signal('');

  // Foto
  fotoDataUrl    = signal('');
  fotoMimeType   = signal('image/jpeg');
  fotoReferencia = signal('');
  fotoNotas      = signal('');
  fotoEnviando   = signal(false);

  private mediaStream: MediaStream | null = null;
  private animFrame: number | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.token = this.route.snapshot.params['token'] ?? '';
    if (!this.token) {
      this.estado.set('error');
      this.mensajeError.set('Token de sesión inválido.');
      return;
    }
    setTimeout(() => this.iniciarCamara(), 400);
  }

  ngOnDestroy() { this.detener(); }

  async iniciarCamara() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }
      });

      // Primero poner en estado 'escaneando' para que Angular renderice el <video>
      this.estado.set('escaneando');

      // Esperar que Angular renderice el DOM
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
    this.http.post(`${environment.apiUrl}/api/scan/session/${this.token}/resultado`, { codigo })
      .subscribe({
        next: () => this.estado.set('enviado'),
        error: () => {
          this.estado.set('error');
          this.mensajeError.set('No se pudo enviar el resultado. Intente de nuevo.');
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

  // ── Captura de foto ───────────────────────────────────────
  tomarFoto() {
    const video = document.getElementById('mov-video') as HTMLVideoElement;
    if (!video || video.readyState < 2) return;

    const canvas = document.createElement('canvas');
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);

    const dataUrl  = canvas.toDataURL('image/jpeg', 0.82);
    const base64   = dataUrl.split(',')[1];

    this.fotoDataUrl.set(dataUrl);
    this.fotoMimeType.set('image/jpeg');
    // Guardar base64 temporalmente en una variable privada
    this._fotoBase64 = base64;

    this.detener();
    this.estado.set('foto');
  }

  private _fotoBase64 = '';

  enviarFoto() {
    if (!this._fotoBase64 || this.fotoEnviando()) return;
    this.fotoEnviando.set(true);

    const payload = {
      referencia : this.fotoReferencia().trim(),
      notas      : this.fotoNotas().trim(),
      imagen     : this._fotoBase64,
      mimeType   : this.fotoMimeType(),
    };

    this.http.post(`${environment.apiUrl}/api/scan/session/${this.token}/foto`, payload)
      .subscribe({
        next: () => {
          this.fotoEnviando.set(false);
          this.estado.set('foto-enviada');
        },
        error: () => {
          this.fotoEnviando.set(false);
          this.mensajeError.set('Error al enviar la foto. Intente de nuevo.');
          this.estado.set('error');
        }
      });
  }

  volverACamara() {
    this.fotoDataUrl.set('');
    this._fotoBase64 = '';
    this.fotoReferencia.set('');
    this.fotoNotas.set('');
    this.estado.set('iniciando');
    setTimeout(() => this.iniciarCamara(), 200);
  }

  reintentar() {
    this.estado.set('iniciando');
    this.codigoDetectado.set('');
    this.codigoManual.set('');
    this.entradaManual.set(false);
    this.fotoDataUrl.set('');
    this._fotoBase64 = '';
    setTimeout(() => this.iniciarCamara(), 200);
  }

  private detener() {
    this.scanActivo.set(false);
    if (this.animFrame) { cancelAnimationFrame(this.animFrame); this.animFrame = null; }
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.mediaStream = null;
  }
}
