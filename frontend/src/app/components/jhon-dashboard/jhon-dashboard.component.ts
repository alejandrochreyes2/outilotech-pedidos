import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JhonIaService } from '../../services/jhon-ia.service';

type Tab = 'metricas' | 'gaps' | 'conocimiento' | 'clientes';

@Component({
  selector: 'app-jhon-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jhon-dashboard.component.html',
  styleUrls: ['./jhon-dashboard.component.css']
})
export class JhonDashboardComponent implements OnInit {
  private svc = inject(JhonIaService);

  tabActiva = signal<Tab>('metricas');
  cargando  = signal(false);
  mensaje   = signal<string | null>(null);

  // Métricas
  stats     = signal<any>(null);
  rendimiento = signal<any[]>([]);

  // Gaps (preguntas sin respuesta)
  gaps      = signal<any[]>([]);
  gapRespuestas: Record<number, string> = {};
  gapCategorias: Record<number, string> = {};

  // Conocimiento
  conocimiento = signal<any[]>([]);
  editandoId   = signal<number | null>(null);
  editTexto    = signal('');

  // Nuevo conocimiento manual
  nuevaPregunta  = '';
  nuevaRespuesta = '';
  nuevaCategoria = 'EMPRESA';
  categorias     = ['EMPRESA','PRODUCTOS','PRECIOS','GARANTIAS','ENVIOS','SOFTWARE','SOPORTE','OTROS'];

  ngOnInit() {
    this.cargarMetricas();
  }

  cambiarTab(tab: Tab) {
    this.tabActiva.set(tab);
    this.mensaje.set(null);
    if (tab === 'metricas')    this.cargarMetricas();
    if (tab === 'gaps')        this.cargarGaps();
    if (tab === 'conocimiento') this.cargarConocimiento();
  }

  cargarMetricas() {
    this.cargando.set(true);
    this.svc.getEstadisticasHoy().subscribe(d => {
      this.stats.set(d);
      this.cargando.set(false);
    });
    this.svc.getRendimiento().subscribe(d => this.rendimiento.set(d.datos || []));
  }

  cargarGaps() {
    this.cargando.set(true);
    this.svc.getGaps().subscribe(d => {
      this.gaps.set(d.gaps || []);
      d.gaps?.forEach((g: any) => {
        this.gapRespuestas[g.id] = '';
        this.gapCategorias[g.id] = 'EMPRESA';
      });
      this.cargando.set(false);
    });
  }

  cargarConocimiento() {
    this.cargando.set(true);
    this.svc.getConocimiento().subscribe(d => {
      this.conocimiento.set(d.items || []);
      this.cargando.set(false);
    });
  }

  entrenarDesdeGap(gap: any) {
    const resp = this.gapRespuestas[gap.id]?.trim();
    if (!resp) { this.mensaje.set('⚠️ Escribe la respuesta antes de entrenar'); return; }
    this.svc.entrenar({
      pregunta_clave: gap.pregunta,
      respuesta_oficial: resp,
      categoria: this.gapCategorias[gap.id] || 'OTROS',
      gapId: gap.id
    }).subscribe(r => {
      if (r.ok) {
        this.mensaje.set(`✅ JhonIA entrenada con: "${gap.pregunta.substring(0,50)}..."`);
        this.cargarGaps();
      } else {
        this.mensaje.set('❌ Error al entrenar');
      }
    });
  }

  agregarConocimiento() {
    if (!this.nuevaPregunta.trim() || !this.nuevaRespuesta.trim()) {
      this.mensaje.set('⚠️ Completa la pregunta y respuesta'); return;
    }
    this.svc.entrenar({
      pregunta_clave: this.nuevaPregunta,
      respuesta_oficial: this.nuevaRespuesta,
      categoria: this.nuevaCategoria
    }).subscribe(r => {
      if (r.ok) {
        this.mensaje.set('✅ Conocimiento agregado correctamente');
        this.nuevaPregunta = ''; this.nuevaRespuesta = '';
        this.cargarConocimiento();
      }
    });
  }

  iniciarEdicion(item: any) {
    this.editandoId.set(item.id);
    this.editTexto.set(item.respuestaOficial);
  }

  guardarEdicion(id: number) {
    this.svc.actualizarConocimiento(id, { respuesta_oficial: this.editTexto() }).subscribe(() => {
      this.mensaje.set('✅ Respuesta actualizada');
      this.editandoId.set(null);
      this.cargarConocimiento();
    });
  }

  desactivar(id: number) {
    this.svc.actualizarConocimiento(id, { activo: false }).subscribe(() => {
      this.mensaje.set('✅ Entrada desactivada');
      this.cargarConocimiento();
    });
  }

  get barraColor(): string {
    const pct = this.stats()?.groqPorcentajeUsado ?? 0;
    if (pct > 80) return '#ef4444';
    if (pct > 50) return '#f59e0b';
    return '#22c55e';
  }

  maxRendimiento(): number {
    return Math.max(...this.rendimiento().map(d => d.total || 1), 1);
  }

  barHeight(val: number): string {
    return Math.round((val / this.maxRendimiento()) * 80) + 'px';
  }
}
