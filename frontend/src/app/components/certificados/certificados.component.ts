import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { inject } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-certificados',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './certificados.component.html',
  styleUrls: ['./certificados.component.css']
})
export class CertificadosComponent implements AfterViewInit {
  @ViewChild('heroVideo') heroVideoRef!: ElementRef<HTMLVideoElement>;

  private sanitizer = inject(DomSanitizer);

  certificados = [
    {
      id: 'iso27001-internal-auditor',
      nombre: 'Jhonnathan Hernández Medina',
      titulo: 'ISO/IEC 27001:2022 Internal Auditor',
      credencial: 'I27001IA™',
      tipo: 'Professional Certification',
      fechaEmision: 'Miércoles 11 de marzo de 2026',
      fechaVencimiento: 'Sábado 10 de marzo de 2029',
      idCertificacion: 'TLZZQKVTTHS-XXTQRPPSM-RDLTRDKKJR',
      firma: 'Ismael Ramírez — Chief Executive Officer',
      badgeColor: '#00a88e',
      credly: 'https://www.credly.com/badges/63d33dc5-e016-4986-8018-bc8249e39ae4',
      credlyEmbed: this.getSafeUrl('https://www.credly.com/badges/63d33dc5-e016-4986-8018-bc8249e39ae4/embedded'),
      tags: ['ISO 27001', 'SGSI', 'Auditoría Interna', 'Seguridad Informática', 'IEC 27001:2022'],
      vigente: true,
    }
  ];

  getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  ngAfterViewInit() {
    const v = this.heroVideoRef?.nativeElement;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => document.addEventListener('mousemove', () => v.play().catch(() => {}), { once: true }));
  }
}
