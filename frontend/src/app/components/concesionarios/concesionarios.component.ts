import { Component, signal, computed } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';

interface Concesionario {
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  horario: string;
  mapsUrl: string;
}

@Component({
  selector: 'app-concesionarios',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './concesionarios.component.html',
  styleUrls: ['./concesionarios.component.css']
})
export class ConcesionariosComponent {
  ciudades = ['Todas', 'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena', 'Pereira'];
  ciudadSeleccionada = signal('Todas');

  todos: Concesionario[] = [
    { nombre: 'Toyota Bogotá Norte', ciudad: 'Bogotá', direccion: 'Av. 19 #114-09, Bogotá', telefono: '601-234-5678', horario: 'Lun-Sab 8am-6pm', mapsUrl: 'https://maps.google.com/?q=Toyota+Bogota+Norte' },
    { nombre: 'Toyota Bogotá Sur', ciudad: 'Bogotá', direccion: 'Autopista Sur #40-26, Bogotá', telefono: '601-234-5679', horario: 'Lun-Sab 8am-6pm', mapsUrl: 'https://maps.google.com/?q=Toyota+Bogota+Sur' },
    { nombre: 'Toyota Medellín Poblado', ciudad: 'Medellín', direccion: 'Av. El Poblado #10-50, Medellín', telefono: '604-234-5678', horario: 'Lun-Sab 8am-6pm', mapsUrl: 'https://maps.google.com/?q=Toyota+Medellin' },
    { nombre: 'Toyota Cali Norte', ciudad: 'Cali', direccion: 'Av. Roosevelt #38-20, Cali', telefono: '602-234-5678', horario: 'Lun-Sab 8am-6pm', mapsUrl: 'https://maps.google.com/?q=Toyota+Cali' },
    { nombre: 'Toyota Barranquilla', ciudad: 'Barranquilla', direccion: 'Cra 53 #75-120, Barranquilla', telefono: '605-234-5678', horario: 'Lun-Sab 8am-6pm', mapsUrl: 'https://maps.google.com/?q=Toyota+Barranquilla' },
    { nombre: 'Toyota Bucaramanga', ciudad: 'Bucaramanga', direccion: 'Cra 27 #45-60, Bucaramanga', telefono: '607-234-5678', horario: 'Lun-Sab 8am-6pm', mapsUrl: 'https://maps.google.com/?q=Toyota+Bucaramanga' },
    { nombre: 'Toyota Cartagena', ciudad: 'Cartagena', direccion: 'Av. Pedro de Heredia #28-50, Cartagena', telefono: '605-345-6789', horario: 'Lun-Sab 8am-6pm', mapsUrl: 'https://maps.google.com/?q=Toyota+Cartagena' },
    { nombre: 'Toyota Pereira', ciudad: 'Pereira', direccion: 'Av. 30 de Agosto #40-10, Pereira', telefono: '606-234-5678', horario: 'Lun-Sab 8am-6pm', mapsUrl: 'https://maps.google.com/?q=Toyota+Pereira' }
  ];

  filtrados = computed(() =>
    this.ciudadSeleccionada() === 'Todas'
      ? this.todos
      : this.todos.filter(c => c.ciudad === this.ciudadSeleccionada())
  );

  seleccionar(ciudad: string) { this.ciudadSeleccionada.set(ciudad); }
}
