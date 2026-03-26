import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-seguridad-forense',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './seguridad-forense.component.html',
  styleUrls: ['./seguridad-forense.component.css']
})
export class SeguridadForenseComponent implements AfterViewInit {
  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  servicios = [
    { icon: '🖥️', title: 'Análisis forense de computadores', desc: 'Windows, macOS y Linux. Extracción y análisis de evidencia digital con metodologías certificadas.' },
    { icon: '📱', title: 'Investigación en dispositivos móviles', desc: 'Android e iOS. Recuperación de datos, registros de llamadas, mensajes y actividad de aplicaciones.' },
    { icon: '🔄', title: 'Recuperación de información', desc: 'Recuperamos datos eliminados, cifrados o comprometidos en discos duros, SSDs y memorias.' },
    { icon: '🔍', title: 'Identificación de accesos no autorizados', desc: 'Detectamos intrusiones, actividades sospechosas y vectores de ataque en tu infraestructura.' },
    { icon: '📋', title: 'Recolección de evidencia digital', desc: 'Preservamos evidencia con validez técnica y jurídica, siguiendo cadena de custodia estricta.' },
    { icon: '⚠️', title: 'Diagnóstico de incidentes', desc: 'Analizamos y documentamos incidentes de seguridad informática con informes técnicos detallados.' },
  ];

  razones = [
    { icon: '🎯', title: 'Enfoque profesional', desc: 'Metodologías forenses internacionalmente reconocidas y validadas.' },
    { icon: '🔒', title: 'Ética y confidencialidad', desc: 'Manejo absolutamente ético y confidencial de toda la información.' },
    { icon: '🛠️', title: 'Experiencia técnica', desc: 'Años de experiencia en diagnóstico técnico y análisis de fallas complejas.' },
    { icon: '📄', title: 'Resultados documentados', desc: 'Informes claros, útiles y accionables para la toma de decisiones.' },
  ];

  ngAfterViewInit() {
    const video = this.heroVideoRef?.nativeElement;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      document.addEventListener('mousemove', () => video.play().catch(() => {}), { once: true });
    });
  }
}
