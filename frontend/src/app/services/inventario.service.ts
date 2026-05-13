import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// ── Interfaces (espejo exacto de los DTOs del backend) ──────────────────────
export interface StockItem {
  id: number;
  codigoProducto: string;
  descripcion: string;
  lote: string | null;
  entradas: number;
  salidas: number;
  stockActual: number;
  costoUnitario: number;
  precioVenta: number;
  importeInventarioProveedor: number;
  venta: number;
  updatedAt: string;
}

export interface EntradaItem {
  id: number;
  nroDocumento: number;
  fecha: string;
  codigoProducto: string;
  descripcion: string | null;
  lote: string | null;
  cantidad: number;
  createdAt: string;
}

export interface SalidaItem {
  id: number;
  nroDocumento: number;
  fecha: string;
  codigoProducto: string;
  descripcion: string | null;
  lote: string | null;
  cantidad: number;
  precioVenta: number;
  utilidad: number;
  createdAt: string;
}

export interface ResumenInventario {
  totalProductos: number;
  unidadesTotales: number;
  valorCostoTotal: number;
  valorVentasTotal: number;
}

export interface CrearEntradaRequest {
  nroDocumento: number;
  fecha: string;           // 'YYYY-MM-DD'
  codigoProducto: string;
  descripcion?: string;
  lote?: string;
  cantidad: number;
}

export interface CrearSalidaRequest {
  nroDocumento: number;
  fecha: string;           // 'YYYY-MM-DD'
  codigoProducto: string;
  descripcion?: string;
  lote?: string;
  cantidad: number;
  precioVenta: number;
  utilidad: number;
}

// ── Servicio ─────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class InventarioService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/inventario`;

  // ENDPOINT 1 — Lista productos (con búsqueda y paginación)
  getStock(search = '', page = 1, pageSize = 50): Observable<StockItem[]> {
    const params = new HttpParams()
      .set('search', search)
      .set('page', page)
      .set('pageSize', pageSize);
    return this.http.get<StockItem[]>(`${this.base}/stock`, { params });
  }

  // ENDPOINT 2 — Detalle de un producto por código
  getProducto(codigo: string): Observable<StockItem> {
    return this.http.get<StockItem>(`${this.base}/stock/${codigo}`);
  }

  // ENDPOINT 3 — Productos con stock bajo
  getStockBajo(umbral = 3): Observable<StockItem[]> {
    const params = new HttpParams().set('umbral', umbral);
    return this.http.get<StockItem[]>(`${this.base}/stock/bajo`, { params });
  }

  // ENDPOINT 4 — Resumen para dashboard
  getResumen(): Observable<ResumenInventario> {
    return this.http.get<ResumenInventario>(`${this.base}/resumen`);
  }

  // ENDPOINT 5 — Historial de entradas
  getEntradas(desde?: string, hasta?: string, page = 1, pageSize = 50): Observable<EntradaItem[]> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return this.http.get<EntradaItem[]>(`${this.base}/entradas`, { params });
  }

  // ENDPOINT 6 — Registrar compra/recepción
  crearEntrada(data: CrearEntradaRequest): Observable<EntradaItem> {
    return this.http.post<EntradaItem>(`${this.base}/entradas`, data);
  }

  // ENDPOINT 7 — Historial de salidas/ventas
  getSalidas(desde?: string, hasta?: string, page = 1, pageSize = 50): Observable<SalidaItem[]> {
    let params = new HttpParams().set('page', page).set('pageSize', pageSize);
    if (desde) params = params.set('desde', desde);
    if (hasta) params = params.set('hasta', hasta);
    return this.http.get<SalidaItem[]>(`${this.base}/salidas`, { params });
  }

  // ENDPOINT 8 — Registrar venta (bloquea si no hay stock)
  crearSalida(data: CrearSalidaRequest): Observable<SalidaItem> {
    return this.http.post<SalidaItem>(`${this.base}/salidas`, data);
  }
}
