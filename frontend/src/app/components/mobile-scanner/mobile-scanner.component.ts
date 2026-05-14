import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-mobile-scanner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-scanner.component.html',
})
export class MobileScannerComponent implements OnInit, OnDestroy {
  @ViewChild('videoEl') videoEl!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasEl') canvasEl!: ElementRef<HTMLCanvasElement>;

  token = '';
  estado = signal<'iniciando' | 'escaneando' | 'encontrado' | 'error' | 'enviado'>('iniciando');
  codigoDetectado = signal('');
  mensajeError = signal('');
  scanActivo = signal(false);
  entradaManual = signal(false);
  codigoManual = signal('');

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

  ngOnDestroy() {
    this.detener();
  }

  async iniciarCamara() {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      const video = document.getElementById('mov-video') as HTMLVideoElement;
      if (video) {
        video.srcObject = this.mediaStream;
        await video.play();
      }
      this.scanActivo.set(true);
      this.estado.set('escaneando');
      this.escanearFrame();
    } catch (err: any) {
      this.estado.set('error');
      this.mensajeError.set('No se pudo acceder a la cámara. Verifique los permisos.');
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

  async enviarManual() {
    const cod = this.codigoManual().trim();
    if (!cod) return;
    this.codigoDetectado.set(cod);
    this.estado.set('encontrado');
    await this.enviarCodigo(cod);
  }

  reintentar() {
    this.estado.set('iniciando');
    this.codigoDetectado.set('');
    this.codigoManual.set('');
    this.entradaManual.set(false);
    setTimeout(() => this.iniciarCamara(), 200);
  }

  private detener() {
    this.scanActivo.set(false);
    if (this.animFrame) { cancelAnimationFrame(this.animFrame); this.animFrame = null; }
    this.mediaStream?.getTracks().forEach(t => t.stop());
    this.mediaStream = null;
  }
}
