import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent implements AfterViewInit {
  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  milestones = [
    { year: '2018', title: 'El origen', desc: 'Nace OUTILTECH con el propósito de responder a una necesidad creciente: la protección de la información y la recuperación de datos en entornos digitales complejos.' },
    { year: '2019', title: 'Análisis técnico y reparación', desc: 'Iniciamos con un enfoque en análisis técnico, reparación de equipos y optimización de procesos para pequeñas y medianas empresas en Colombia.' },
    { year: '2020', title: 'Seguridad informática', desc: 'Evolucionamos hacia servicios especializados en seguridad informática y análisis forense digital, respondiendo al auge de ciberataques en la región.' },
    { year: '2021', title: 'Microelectrónica aplicada', desc: 'Incorporamos microelectrónica aplicada a nuestros servicios, expandiendo nuestra capacidad de diagnóstico y recuperación de dispositivos críticos.' },
    { year: '2023', title: 'Aliado estratégico', desc: 'Nos consolidamos como aliado estratégico para nuestros clientes, ofreciendo soluciones completas desde la detección de vulnerabilidades hasta la recuperación de información.' },
    { year: '2026', title: 'El futuro', desc: 'Hoy somos especialistas en microelectrónica, ciberseguridad, ISO 27001 y comercialización de tecnología de vanguardia para Colombia y Latinoamérica.' },
  ];

  stats = [
    { value: '500+', label: 'Clientes atendidos' },
    { value: '8',    label: 'Años de experiencia' },
    { value: '99%',  label: 'Satisfacción del cliente' },
    { value: '24/7', label: 'Soporte continuo' },
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
