import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

export interface ProductoPOS {
  codigo: string;
  descripcion: string;
  stock: number;
  precio: number;
  costo: number;
  fuente: 'stock' | 'catalogo' | 'manual' | 'imagen';
}

export interface ItemFactura {
  codigo: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  fuente: 'stock' | 'catalogo' | 'manual' | 'imagen';
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

  listarTodosProductos() {
    return this.http.get<ProductoPOS[]>(
      `${this.api}/api/pos/todos`,
      this.headers
    );
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

  // ── Inventario por imagen ──────────────────────────────────
  listarInventarioPorImagen(soloSinRevisar = true) {
    const params = soloSinRevisar ? '?revisado=false' : '';
    return this.http.get<any[]>(
      `${this.api}/api/scan/inventario-por-imagen${params}`,
      this.headers
    );
  }

  obtenerImagenInventario(id: number) {
    return this.http.get<{ imagen: string; mimeType: string }>(
      `${this.api}/api/scan/inventario-por-imagen/${id}/imagen`,
      this.headers
    );
  }

  marcarImagenRevisada(id: number) {
    return this.http.patch(`${this.api}/api/scan/inventario-por-imagen/${id}/revisar`, {}, this.headers);
  }

  analizarFotosSinReferencia() {
    return this.http.post<{
      analizadas: number;
      mensaje?: string;
      resultados?: { id: number; ok: boolean; referencia?: string; tipo?: string; marca?: string; precio?: number; descripcion?: string; confianza?: string; fuente?: string; matchOrigen?: string; error?: string }[];
    }>(`${this.api}/api/scan/inventario-por-imagen/analizar-sin-referencia`, {}, this.headers);
  }

  // ── Agregar producto nuevo desde escáner ──────────────────
  agregarProductoNuevo(dto: {
    codigoBarras: string;
    descripcion: string;
    precio: number;
    costo: number;
    categoria: string;
    cajera: string;
  }) {
    return this.http.post<{
      ok: boolean; codigo: string; descripcion: string;
      precio: number; stock: number; mensaje: string;
    }>(`${this.api}/api/inventario/nuevo-producto`, dto, this.headers);
  }
}
