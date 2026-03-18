import { Component, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';

declare const emailjs: any;

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [NavbarComponent, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  form = {
    nombre: '',
    email: '',
    telefono: '',
    ciudad: '',
    tipo: '',
    asunto: '',
    mensaje: '',
    autorizo: false
  };

  ciudades = ['Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Bucaramanga', 'Cartagena', 'Pereira', 'Manizales', 'Ibagué', 'Santa Marta', 'Otra'];
  tipos = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Información', 'Otro'];

  enviando     = signal(false);
  enviado      = signal(false);
  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  async enviarFormulario() {
    if (!this.form.autorizo) {
      this.mensajeError.set('Debes autorizar el tratamiento de datos personales.');
      return;
    }
    if (this.form.mensaje.length < 20) {
      this.mensajeError.set('El mensaje debe tener al menos 20 caracteres.');
      return;
    }

    this.enviando.set(true);
    this.mensajeExito.set(null);
    this.mensajeError.set(null);

    try {
      await emailjs.send(
        'service_toyota',
        'template_jzz8rai',
        {
          nombre:        this.form.nombre,
          email:         this.form.email,
          telefono:      this.form.telefono,
          ciudad:        this.form.ciudad,
          tipo_consulta: this.form.tipo,
          asunto:        this.form.asunto,
          mensaje:       this.form.mensaje
        },
        'K16QvN016m0k4KJdY'
      );
      this.mensajeExito.set(
        'Tu mensaje fue enviado correctamente. ' +
        'Nos comunicaremos en máximo 24 horas.'
      );
      this.enviado.set(true);
      this.form = { nombre: '', email: '', telefono: '', ciudad: '', tipo: '', asunto: '', mensaje: '', autorizo: false };
    } catch (error) {
      this.mensajeError.set('Error al enviar. Por favor intenta de nuevo.');
    } finally {
      this.enviando.set(false);
    }
  }

  reintentar() {
    this.enviado.set(false);
    this.mensajeExito.set(null);
    this.mensajeError.set(null);
  }
}
