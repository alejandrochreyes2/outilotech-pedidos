import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  respuesta: string;
}

@Injectable({ providedIn: 'root' })
export class ChatbotService {
  private http = inject(HttpClient);

  enviarMensaje(mensaje: string, historial: ChatMessage[]): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(
      `${environment.apiUrl}/api/pedidos/chatbot/mensaje`,
      { mensaje, historial }
    );
  }
}
