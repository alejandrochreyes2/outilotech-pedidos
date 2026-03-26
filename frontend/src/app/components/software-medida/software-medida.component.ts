import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-software-medida',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './software-medida.component.html',
  styleUrls: ['./software-medida.component.css']
})
export class SoftwareMedidaComponent implements AfterViewInit {
  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  soluciones = [
    { icon: '💻', route: '/software-medida', title: 'Software a la medida', desc: 'Desarrollamos aplicaciones empresariales personalizadas adaptadas exactamente a tus procesos y necesidades.' },
    { icon: '🌐', route: '/software-medida', title: 'Creación de páginas web', desc: 'Diseño y desarrollo de sitios web modernos, rápidos y optimizados para SEO y conversión.' },
    { icon: '🤖', route: '/software-medida', title: 'Creamos tu IA en tu plataforma', desc: 'Integramos inteligencia artificial personalizada directamente en tus sistemas y flujos de trabajo.' },
    { icon: '🔗', route: '/software-medida', title: 'Integración SAP y ERP', desc: 'Conectamos y sincronizamos tus sistemas SAP y ERP con otras plataformas y aplicaciones empresariales.' },
    { icon: '📱', route: '/software-medida', title: 'Apps para tu negocio', desc: 'Desarrollamos aplicaciones móviles iOS y Android que digitalizan y optimizan tu operación.' },
  ];

  proceso = [
    { num: '01', title: 'Análisis de requerimientos', desc: 'Entendemos tus necesidades, procesos y objetivos en detalle.' },
    { num: '02', title: 'Diseño y arquitectura', desc: 'Diseñamos la solución técnica óptima para tu caso.' },
    { num: '03', title: 'Desarrollo ágil', desc: 'Construimos por sprints con entregas visibles y feedback continuo.' },
    { num: '04', title: 'Despliegue y soporte', desc: 'Implementamos en producción y te acompañamos post-lanzamiento.' },
  ];

  ngAfterViewInit() {
    const v = this.heroVideoRef?.nativeElement;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => document.addEventListener('mousemove', () => v.play().catch(() => {}), { once: true }));
  }
}
