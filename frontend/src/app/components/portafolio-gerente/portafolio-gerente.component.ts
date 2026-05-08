import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-portafolio-gerente',
  standalone: true,
  templateUrl: './portafolio-gerente.component.html',
  styleUrls: ['./portafolio-gerente.component.css']
})
export class PortafolioGerenteComponent {
  portafolioUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.portafolioUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://outiltech-gerente.pages.dev/');
  }
}
