// ALEJANDRO: Para configurar EmailJS:
// 1. Ve a https://emailjs.com y crea cuenta gratis
// 2. Add New Service → Gmail → conecta alejandrochreyes2@gmail.com → copia SERVICE_ID
// 3. Create Template → configura las variables abajo → copia TEMPLATE_ID
// 4. Account → API Keys → copia PUBLIC_KEY
// 5. Reemplaza los 3 valores en las constantes de abajo

import { Component, signal } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';

// ── Credenciales EmailJS ──────────────────────────────────────────────────────
const SERVICE_ID  = 'service_outiltech';   // Gmail conectado
const TEMPLATE_ID = 'template_wqqymcp';   // Template configurado
const PUBLIC_KEY  = 'K16QvN016m0k4KJdY';  // Public Key
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [NavbarComponent, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

  form = {
    nombre:   '',
    email:    '',
    telefono: '',
    ciudad:   '',
    tipo:     '',
    asunto:   '',
    mensaje:  '',
    autorizo: false
  };

  ciudades = [
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla',
    'Bucaramanga', 'Cartagena', 'Pereira', 'Manizales',
    'Ibagué', 'Santa Marta', 'Otra'
  ];

  tipos = ['Petición', 'Queja', 'Reclamo', 'Sugerencia', 'Información', 'Otro'];

  asuntos = [
    'Solicitud auditoría ISO 27001',
    'Solicitud de servicio técnico discos duros',
    'Ciberseguridad',
    'Implementación de software',
    'Solicitud de app de desarrollo con IA',
    'Derecho de petición',
    'Cotización de servicios',
    'Atención al cliente',
    'Solicitud garantías y procesos técnicos',
    'Otro'
  ];

  asuntoPersonalizado = false;

  onAsuntoChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    if (val === 'Otro') {
      this.asuntoPersonalizado = true;
      this.form.asunto = '';
    }
  }

  enviando     = signal(false);
  enviado      = signal(false);
  mensajeExito = signal<string | null>(null);
  mensajeError = signal<string | null>(null);

  async enviarFormulario() {
    // Validaciones
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
        SERVICE_ID,
        TEMPLATE_ID,
        {
          from_name:  this.form.nombre,
          from_email: this.form.email,
          phone:      this.form.telefono,
          city:       this.form.ciudad,
          tipo:       this.form.tipo,
          asunto:     this.form.asunto,
          message:    this.form.mensaje,
          to_email:   'contactanos@outiltech.co'
        },
        PUBLIC_KEY
      );

      this.mensajeExito.set(
        'Tu mensaje fue enviado correctamente. Nos comunicaremos en máximo 24 horas hábiles.'
      );
      this.enviado.set(true);
      this.form = {
        nombre: '', email: '', telefono: '', ciudad: '',
        tipo: '', asunto: '', mensaje: '', autorizo: false
      };

    } catch (error: any) {
      console.error('[EmailJS error]', error);
      this.mensajeError.set(
        'Error al enviar el mensaje. Por favor intenta de nuevo o escríbenos a contactanos@outiltech.co'
      );
    } finally {
      this.enviando.set(false);
    }
  }

  reintentar() {
    this.enviado.set(false);
    this.mensajeExito.set(null);
    this.mensajeError.set(null);
    this.asuntoPersonalizado = false;
  }
}
