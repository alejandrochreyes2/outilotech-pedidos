import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JhonIaService } from '../../services/jhon-ia.service';

@Component({
  selector: 'app-jhon-stats-mini',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (stats()) {
    <div class="mini-stats">
      <div class="mini-item">
        <span class="mini-val">{{ stats().total }}</span>
        <span class="mini-lbl">Conversaciones</span>
      </div>
      <div class="mini-item green">
        <span class="mini-val">{{ stats().ahorroSinGroq }}%</span>
        <span class="mini-lbl">Sin Groq API</span>
      </div>
      <div class="mini-item blue">
        <span class="mini-val">{{ stats().groqHoy }}</span>
        <span class="mini-lbl">Calls Groq hoy</span>
      </div>
      <div class="mini-bar-wrap">
        <div class="mini-bar-label">
          Groq: {{ stats().groqPorcentajeUsado }}% de 14,400 calls/día
        </div>
        <div class="mini-bar-bg">
          <div class="mini-bar-fill"
            [style.width]="(stats().groqPorcentajeUsado || 0) + '%'"
            [style.background]="barColor"></div>
        </div>
      </div>
    </div>
    } @else {
    <div class="mini-empty">Sin datos hoy</div>
    }
  `,
  styles: [`
    .mini-stats { display:flex; gap:16px; flex-wrap:wrap; align-items:center; padding:12px 0; }
    .mini-item { text-align:center; min-width:80px; }
    .mini-val  { display:block; font-size:22px; font-weight:800; color:#fff; }
    .mini-lbl  { display:block; font-size:10px; color:rgba(255,255,255,0.45); text-transform:uppercase; letter-spacing:.5px; margin-top:2px; }
    .mini-item.green .mini-val { color:#22c55e; }
    .mini-item.blue  .mini-val { color:#3b82f6; }
    .mini-bar-wrap { flex:1; min-width:160px; }
    .mini-bar-label { font-size:11px; color:rgba(255,255,255,0.4); margin-bottom:5px; }
    .mini-bar-bg { background:rgba(255,255,255,0.08); border-radius:8px; height:8px; overflow:hidden; }
    .mini-bar-fill { height:100%; border-radius:8px; transition:width .5s; }
    .mini-empty { color:rgba(255,255,255,0.3); font-size:13px; padding:12px 0; }
  `]
})
export class JhonStatsMiniComponent implements OnInit {
  private svc = inject(JhonIaService);
  stats = signal<any>(null);

  get barColor(): string {
    const p = this.stats()?.groqPorcentajeUsado ?? 0;
    return p > 80 ? '#ef4444' : p > 50 ? '#f59e0b' : '#22c55e';
  }

  ngOnInit() {
    this.svc.getEstadisticasHoy().subscribe(d => this.stats.set(d));
  }
}
