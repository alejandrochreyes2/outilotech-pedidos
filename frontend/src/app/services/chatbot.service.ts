import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  mensaje: string;
  historial: ChatMessage[];
  sessionId: string;
  email?: string | null;
  nombreUsuario?: string | null;
  emailEsNuevo?: boolean;
}

export interface ChatResponse {
  respuesta: string;
  accion?: { tipo: string; url: string } | null;
  fuente?: string;
  mostrarEscaladaWA?: boolean;
  intencion?: string;
  tieneHtml?: boolean;
  mostrarBannerGuardar?: boolean;
}

export interface HistorialResponse {
  mensajes: Array<{ role: string; content: string; creadoEn: string }>;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/api/pedidos/chatbot`;

  enviarMensaje(req: ChatRequest): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.base}/mensaje`, req);
  }

  cargarHistorial(sessionId: string): Observable<HistorialResponse> {
    return this.http.get<HistorialResponse>(`${this.base}/historial/${sessionId}`);
  }

  cerrarSesion(sessionId: string, email: string | null, nombre: string | null): void {
    navigator.sendBeacon(
      `${this.base}/fin-sesion`,
      new Blob([JSON.stringify({ sessionId, email, nombre })], { type: 'application/json' })
    );
  }
}
