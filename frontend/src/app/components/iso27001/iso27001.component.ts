import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-iso27001',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './iso27001.component.html',
  styleUrls: ['./iso27001.component.css']
})
export class Iso27001Component implements AfterViewInit {
  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  servicios = [
    { icon: '✅', title: 'Evaluación de cumplimiento', desc: 'Evaluación completa del cumplimiento de todos los controles y requisitos de la norma ISO 27001.' },
    { icon: '🔍', title: 'Identificación de vulnerabilidades', desc: 'Detección de vulnerabilidades y riesgos críticos en tu infraestructura y procesos de seguridad.' },
    { icon: '🛡️', title: 'Verificación de controles', desc: 'Revisión y verificación de todos los controles de seguridad implementados en la organización.' },
    { icon: '📋', title: 'Gestión documental', desc: 'Revisión de políticas, procedimientos y gestión documental del SGSI.' },
    { icon: '⚠️', title: 'No conformidades', desc: 'Detección de no conformidades y oportunidades de mejora con plan de acción correctivo.' },
    { icon: '📄', title: 'Informe ejecutivo', desc: 'Informe detallado con hallazgos claros, evidencia técnica y recomendaciones accionables.' },
  ];

  beneficios = [
    { icon: '✔️', title: 'Evita sanciones legales', desc: 'Reduce el riesgo de sanciones regulatorias y riesgos legales por incumplimiento.' },
    { icon: '✔️', title: 'Listo para certificación', desc: 'Prepárate con confianza para auditorías de certificación ISO 27001.' },
    { icon: '✔️', title: 'Protección de información', desc: 'Protege la información crítica y los activos más valiosos de tu organización.' },
    { icon: '✔️', title: 'Mejora continua', desc: 'Mejora tus procesos internos y construye una cultura sólida de seguridad.' },
  ];

  ngAfterViewInit() {
    const v = this.heroVideoRef?.nativeElement;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => document.addEventListener('mousemove', () => v.play().catch(() => {}), { once: true }));
  }
}
