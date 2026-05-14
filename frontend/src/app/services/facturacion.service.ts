import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ProductoPOS {
  codigo: string;
  descripcion: string;
  stock: number;
  precio: number;
  costo: number;
  fuente: 'stock' | 'catalogo' | 'manual';
}

export interface ItemFactura {
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  fuente: 'stock' | 'catalogo' | 'manual';
  subtotal: number;
}

export interface CrearFacturaDto {
  cajera: string;
  clienteNombre?: string;
  clienteId?: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  descuento: number;
  notas?: string;
  items: { codigo: string; descripcion: string; cantidad: number; precio: number; fuente: string }[];
}

export interface Factura {
  id: number;
  numeroFactura: string;
  fecha: string;
  cajera: string;
  clienteNombre?: string;
  clienteId?: string;
  clienteEmail?: string;
  clienteTelefono?: string;
  subtotal: number;
  descuento: number;
  total: number;
  metodoPago?: string;
  estado: 'borrador' | 'emitida' | 'pagada' | 'anulada';
  notas?: string;
  totalItems?: number;
}

@Injectable({ providedIn: 'root' })
export class FacturacionService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  private get headers() {
    const token = localStorage.getItem('token');
    return { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) };
  }

  buscarProductos(q: string) {
    return this.http.get<ProductoPOS[]>(
      `${this.api}/api/pos/buscar?q=${encodeURIComponent(q)}`,
      this.headers
    );
  }

  siguienteNumero() {
    return this.http.get<{ numero: string }>(
      `${this.api}/api/facturacion/siguiente-numero`,
      this.headers
    );
  }

  crearFactura(dto: CrearFacturaDto) {
    return this.http.post<{ id: number; numeroFactura: string; total: number; estado: string }>(
      `${this.api}/api/facturacion`,
      dto,
      this.headers
    );
  }

  listarFacturas(filtros: { estado?: string; fecha?: string; page?: number } = {}) {
    let params = new URLSearchParams();
    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.fecha)  params.append('fecha', filtros.fecha);
    if (filtros.page)   params.append('page', String(filtros.page));
    return this.http.get<Factura[]>(
      `${this.api}/api/facturacion?${params.toString()}`,
      this.headers
    );
  }

  obtenerFactura(id: number) {
    return this.http.get<{ factura: Factura; items: any[] }>(
      `${this.api}/api/facturacion/${id}`,
      this.headers
    );
  }

  pagarFactura(id: number, metodoPago: string) {
    return this.http.patch<{ mensaje: string; id: number; metodoPago: string }>(
      `${this.api}/api/facturacion/${id}/pagar`,
      { metodoPago },
      this.headers
    );
  }

  anularFactura(id: number) {
    return this.http.patch<{ mensaje: string; id: number }>(
      `${this.api}/api/facturacion/${id}/anular`,
      {},
      this.headers
    );
  }

  // ── Scanner móvil ──────────────────────────────────────────
  crearSesionScanner() {
    return this.http.post<{ token: string }>(`${this.api}/api/scan/session`, {}, this.headers);
  }

  consultarSesionScanner(token: string) {
    return this.http.get<{ token: string; resultado: string | null; pendiente: boolean }>(
      `${this.api}/api/scan/session/${token}`,
      this.headers
    );
  }

  cancelarSesionScanner(token: string) {
    return this.http.delete(`${this.api}/api/scan/session/${token}`, this.headers);
  }

  // Sin auth — lo llama el móvil directamente
  enviarResultadoScanner(token: string, codigo: string) {
    return this.http.post(`${this.api}/api/scan/session/${token}/resultado`, { codigo });
  }
}
