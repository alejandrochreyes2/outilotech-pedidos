import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';

import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SafeUrlPipe],
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent {
  storeInfo = {
    nombre: 'OutilTech — Centro de Experiencia',
    direccion: 'Cl. 16 #8-55, Bogotá, Colombia',
    telefono: '+57 601 234 5678',
    email: 'contacto@outiltech.com.co',
    horario: 'Lunes a Viernes: 8:00 AM - 6:00 PM | Sábados: 9:00 AM - 1:00 PM',
    mapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.9544206875585!2d-74.0699265!3d4.6021858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f9904ceb6ecb3%3A0x7849195f72a0d155!2sOutilTech!5e0!3m2!1ses-419!2sco!4v1711453000000!5m2!1ses-419!2sco'
  };
}
