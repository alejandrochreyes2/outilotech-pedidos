import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-acerca',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './acerca.component.html',
  styleUrls: ['./acerca.component.css']
})
export class AcercaComponent {
  stats = [
    { value: '+50.000', label: 'Clientes financiados' },
    { value: '20+', label: 'Años de experiencia' },
    { value: '100+', label: 'Concesionarios aliados' },
    { value: '$2 Bill.', label: 'En créditos otorgados' }
  ];

  timeline = [
    { year: '2000', text: 'Fundación de Toyota Financial Services Colombia' },
    { year: '2005', text: 'Expansión a 5 ciudades principales del país' },
    { year: '2010', text: 'Primer millón de clientes financiados' },
    { year: '2015', text: 'Lanzamiento del simulador digital de créditos' },
    { year: '2020', text: 'Digitalización completa de procesos de financiamiento' },
    { year: '2024', text: 'Plataforma Toyota Pedidos - Sistema Enterprise' }
  ];
}
