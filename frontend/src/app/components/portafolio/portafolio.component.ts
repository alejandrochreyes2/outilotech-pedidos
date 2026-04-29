import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-portafolio',
  standalone: true,
  templateUrl: './portafolio.component.html',
  styleUrls: ['./portafolio.component.css']
})
export class PortafolioComponent {
  portafolioUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.portafolioUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://outiltech-portafolio.pages.dev/');
  }
}
