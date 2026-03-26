import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-mision-vision',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './mision-vision.component.html',
  styleUrls: ['./mision-vision.component.css']
})
export class MisionVisionComponent implements AfterViewInit {
  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  valores = [
    { icon: '🔒', title: 'Seguridad', desc: 'Cada solución que entregamos cumple los más altos estándares de seguridad informática y protección de datos.' },
    { icon: '🎯', title: 'Precisión', desc: 'Resultados exactos y verificables. Trabajamos con rigor técnico en cada análisis forense y auditoría.' },
    { icon: '🤝', title: 'Ética profesional', desc: 'Confidencialidad total y apego estricto a los marcos legales en el manejo de evidencia digital.' },
    { icon: '💡', title: 'Innovación', desc: 'Adoptamos las últimas tecnologías de IA forense, microelectrónica y recuperación de datos del 2026.' },
    { icon: '🏆', title: 'Excelencia', desc: 'Estándares de calidad internacionales en cada entrega, desde la auditoría hasta la recuperación de dispositivos Apple.' },
    { icon: '🌐', title: 'Alcance nacional', desc: 'Presencia y capacidad de atención en todo el territorio nacional con equipos especializados.' },
  ];

  pilares = [
    { num: '01', title: 'Seguridad Informática', desc: 'Protección integral de infraestructuras digitales frente a amenazas avanzadas y ataques APT.' },
    { num: '02', title: 'Análisis Forense Digital', desc: 'Recuperación y análisis de evidencia digital con validez legal y técnica para procesos judiciales o corporativos.' },
    { num: '03', title: 'Auditoría ISO 27001', desc: 'Evaluación completa del SGSI para garantizar el cumplimiento normativo y la certificación internacional.' },
    { num: '04', title: 'Microelectrónica & Reparación', desc: 'Diagnóstico y reparación especializada de dispositivos de alta complejidad, especialmente ecosistema Apple.' },
  ];

  ngAfterViewInit() {
    const v = this.heroVideoRef?.nativeElement;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => document.addEventListener('mousemove', () => v.play().catch(() => {}), { once: true }));
  }
}
