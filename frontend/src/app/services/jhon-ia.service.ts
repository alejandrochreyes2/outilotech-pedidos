import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

const BASE = `${environment.apiUrl}/api/pedidos/chatbot`;

@Injectable({ providedIn: 'root' })
export class JhonIaService {
  private http = inject(HttpClient);

  getEstadisticasHoy(): Observable<any> {
    return this.http.get(`${BASE}/estadisticas/hoy`).pipe(catchError(() => of({})));
  }

  getRendimiento(): Observable<any> {
    return this.http.get(`${BASE}/rendimiento`).pipe(catchError(() => of({ datos: [] })));
  }

  getGaps(): Observable<any> {
    return this.http.get(`${BASE}/gaps`).pipe(catchError(() => of({ gaps: [] })));
  }

  getConocimiento(): Observable<any> {
    return this.http.get(`${BASE}/conocimiento`).pipe(catchError(() => of({ items: [] })));
  }

  getPerfil(sessionId: string): Observable<any> {
    return this.http.get(`${BASE}/perfil/${sessionId}`).pipe(catchError(() => of({ perfil: null })));
  }

  entrenar(data: { pregunta_clave: string; respuesta_oficial: string; categoria: string; gapId?: number }): Observable<any> {
    return this.http.post(`${BASE}/entrenar`, data).pipe(catchError(() => of({ ok: false })));
  }

  actualizarConocimiento(id: number, data: any): Observable<any> {
    return this.http.put(`${BASE}/conocimiento/${id}`, data).pipe(catchError(() => of({ ok: false })));
  }

  registrarSatisfaccion(sessionId: string, voto: 'positivo' | 'negativo'): Observable<any> {
    return this.http.post(`${BASE}/satisfaccion`, { sessionId, voto }).pipe(catchError(() => of({})));
  }

  enviarMensajePOS(mensaje: string, sessionId: string): Observable<any> {
    return this.http.post(`${BASE}/mensaje`, {
      mensaje,
      sessionId,
      email: 'cajera@outiltech.co',
      nombre: 'Cajera POS'
    }).pipe(catchError(err => of({ respuesta: 'JhonIA no disponible en este momento.', error: true })));
  }
}
