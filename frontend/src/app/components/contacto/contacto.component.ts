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

  enviando = signal(false);
  enviado = signal(false);
  error = signal<string | null>(null);

  async enviar() {
    if (!this.form.autorizo) {
      this.error.set('Debes autorizar el tratamiento de datos personales.');
      return;
    }
    if (this.form.mensaje.length < 20) {
      this.error.set('El mensaje debe tener al menos 20 caracteres.');
      return;
    }

    this.enviando.set(true);
    this.error.set(null);

    try {
      // EmailJS - configure your credentials at emailjs.com
      // Service ID: YOUR_SERVICE_ID
      // Template ID: YOUR_TEMPLATE_ID
      // Public Key: YOUR_PUBLIC_KEY
      await (window as any).emailjs.send(
        'YOUR_SERVICE_ID',
        'YOUR_TEMPLATE_ID',
        {
          from_name: this.form.nombre,
          from_email: this.form.email,
          telefono: this.form.telefono,
          ciudad: this.form.ciudad,
          tipo_consulta: this.form.tipo,
          asunto: this.form.asunto,
          mensaje: this.form.mensaje,
          to_email: 'alejandrochreyes2@gmail.com'
        },
        'YOUR_PUBLIC_KEY'
      );
      this.enviado.set(true);
    } catch (e) {
      this.error.set('Error al enviar el mensaje. Por favor intenta nuevamente o escríbenos directamente a servicios@toyotacredito.com.co');
    } finally {
      this.enviando.set(false);
    }
  }

  reintentar() {
    this.enviado.set(false);
    this.error.set(null);
  }
}
