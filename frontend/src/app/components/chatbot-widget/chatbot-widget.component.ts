import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';
import { JhonIaService } from '../../services/jhon-ia.service';
import { AuthService } from '../../services/auth.service';
import { SanitizeHtmlPipe } from '../../pipes/sanitize-html.pipe';

interface DisplayMessage {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
  tieneHtml?: boolean;
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [FormsModule, SanitizeHtmlPipe],
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.css']
})
export class ChatbotWidgetComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private chatbotService = inject(ChatbotService);
  private authService    = inject(AuthService);
  private elementRef     = inject(ElementRef);
  private router         = inject(Router);
  private jhonIaService  = inject(JhonIaService);

  // Estado del panel
  isOpen    = false;
  isLoading = false;
  avatarError = false;
  mostrarEscaladaWA  = false;
  mostrarEncuesta    = false;
  votoEnviado        = false;
  mostrarBannerGuardar = false;

  // Mensajes
  messages: DisplayMessage[] = [];
  currentInput = '';
  private historial: ChatMessage[] = [];

  // Sesión y usuario
  sessionId     = '';
  userEmail: string | null = null;
  userName: string | null  = null;
  emailCapturado = false;

  // Formulario de captura de email
  emailInputValue = '';
  nombreInputValue = '';
  mostrarEmailForm = false;

  private readonly SESSION_KEY = 'chatbot_session_id';
  private readonly EMAIL_KEY   = 'chatbot_email';
  private readonly NOMBRE_KEY  = 'chatbot_nombre';

  private readonly WELCOME_HTML =
    `<div style="line-height:1.45;font-size:12.5px">
¡Hola! Soy <b>Jhon</b>, el asistente IA de Outiltech 🤖<br>
<span style="color:rgba(255,255,255,0.65);font-size:11.5px">Escoge una opción o escribe tu pregunta:</span><br>
<b>1.</b> 🛍️ Productos (Precios, stock)<br>
<b>2.</b> 💳 Pagos (Tarjetas, Nequi, cuotas)<br>
<b>3.</b> 🚚 Envíos (Tiempos, costos)<br>
<b>4.</b> 🛡️ Garantías y devoluciones<br>
<b>5.</b> ℹ️ Sobre nosotros / Contáctanos<br>
<b>6.</b> 📋 PQRS o Reclamos<br>
<b>7.</b> 👤 Hablar con un asesor<br>
<b>8.</b> 🛒 Soy cliente o mayorista<br>
<b>9.</b> 🔧 Servicio técnico<br>
<b>10.</b> 💻 Quiero mi software
</div>`;

  ngOnInit() {
    this.sessionId = this.obtenerOCrearSesion();
    this.cargarDatosUsuario();
  }

  ngOnDestroy() {
    if (this.userEmail && this.historial.length >= 2) {
      this.chatbotService.cerrarSesion(this.sessionId, this.userEmail, this.userName);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.cerrarPanel();
    }
  }

  private obtenerOCrearSesion(): string {
    let id = sessionStorage.getItem(this.SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(this.SESSION_KEY, id);
    }
    return id;
  }

  private cargarDatosUsuario() {
    const user = this.authService.currentUser();
    if (user?.email) {
      this.userEmail      = user.email;
      this.userName       = user.name || user.email;
      this.emailCapturado = true;
    } else {
      const savedEmail  = localStorage.getItem(this.EMAIL_KEY);
      const savedNombre = localStorage.getItem(this.NOMBRE_KEY);
      if (savedEmail) {
        this.userEmail      = savedEmail;
        this.userName       = savedNombre;
        this.emailCapturado = true;
      }
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      if (this.messages.length === 0) {
        this.messages = [{ role: 'assistant', content: this.WELCOME_HTML, tieneHtml: true }];
        this.cargarHistorialPrevio();
      }
      this.mostrarEmailForm = !this.emailCapturado;
    }
    this.scrollToBottom();
  }

  cerrarPanel() {
    this.isOpen = false;
    if (this.userEmail && this.historial.length >= 4) {
      this.chatbotService.cerrarSesion(this.sessionId, this.userEmail, this.userName);
    }
  }

  close() { this.cerrarPanel(); }

  private cargarHistorialPrevio() {
    this.chatbotService.cargarHistorial(this.sessionId).subscribe({
      next: (resp) => {
        if (resp.mensajes.length === 0) return;
        const mensajesPrevios: DisplayMessage[] = resp.mensajes.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }));
        this.historial = resp.mensajes.map(m => ({
          role: m.role as 'user' | 'assistant',
          content: m.content
        }));
        this.messages = [
          { role: 'assistant', content: '🕐 _Retomando tu conversación anterior..._' },
          ...mensajesPrevios
        ];
        this.scrollToBottom();
      },
      error: () => {}
    });
  }

  capturarEmail() {
    const email  = this.emailInputValue.trim();
    const nombre = this.nombreInputValue.trim();
    if (!email || !this.esEmailValido(email)) return;

    const esNuevo = !this.emailCapturado;
    this.userEmail      = email;
    this.userName       = nombre || email;
    this.emailCapturado = true;
    this.mostrarEmailForm = false;

    localStorage.setItem(this.EMAIL_KEY, email);
    if (nombre) localStorage.setItem(this.NOMBRE_KEY, nombre);

    // Primer mensaje para asociar el email a la sesión
    this.chatbotService.enviarMensaje({
      mensaje: `Hola, mi nombre es ${this.userName}`,
      historial: [],
      sessionId: this.sessionId,
      email,
      nombreUsuario: this.userName,
      emailEsNuevo: esNuevo
    }).subscribe({
      next: (resp) => {
        this.messages.push({ role: 'assistant', content: resp.respuesta });
        this.historial.push({ role: 'user', content: `Hola, mi nombre es ${this.userName}` });
        this.historial.push({ role: 'assistant', content: resp.respuesta });
        this.scrollToBottom();
        if (resp.accion?.tipo === 'navegar' && resp.accion.url) {
          setTimeout(() => this.router.navigateByUrl(resp.accion!.url), 800);
        }
      },
      error: () => {}
    });

    this.messages.push({
      role: 'assistant',
      content: `¡Perfecto ${nombre || ''}! Te he registrado. Recibirás un resumen de esta conversación en **${email}** al finalizar. ¿En qué puedo ayudarte?`
    });
    this.scrollToBottom();
  }

  omitirEmail() {
    this.emailCapturado   = true;
    this.mostrarEmailForm = false;
  }

  openWhatsApp(tipo: 'ventas' | 'posventa') {
    const configs: Record<string, { numero: string; texto: string }> = {
      ventas:   { numero: '14155238886', texto: 'Hola, quiero ver los productos y servicios de Outiltech' },
      posventa: { numero: '573133082905', texto: 'Hola, estoy interesado en servicio posventa de Outiltech' },
    };
    const { numero, texto } = configs[tipo];
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank');
  }

  onAvatarError() { this.avatarError = true; }

  sendMessage() {
    const msg = this.currentInput.trim();
    if (!msg || this.isLoading) return;

    this.messages.push({ role: 'user', content: msg });
    this.historial.push({ role: 'user', content: msg });
    this.currentInput = '';
    this.isLoading    = true;

    this.messages.push({ role: 'assistant', content: '', isTyping: true });
    this.scrollToBottom();

    this.chatbotService.enviarMensaje({
      mensaje:       msg,
      historial:     this.historial.slice(0, -1),
      sessionId:     this.sessionId,
      email:         this.userEmail,
      nombreUsuario: this.userName,
      emailEsNuevo:  false
    }).subscribe({
      next: (resp) => {
        this.messages.pop();
        this.messages.push({ role: 'assistant', content: resp.respuesta, tieneHtml: !!resp.tieneHtml });
        this.historial.push({ role: 'assistant', content: resp.respuesta });
        this.isLoading = false;
        this.mostrarEscaladaWA = !!resp.mostrarEscaladaWA;
        if (resp.mostrarBannerGuardar) {
          this.mostrarBannerGuardar = true;
          this.mostrarEncuesta = false;
        } else if (resp.intencion === 'salida') {
          this.mostrarEncuesta = true;
        }
        this.scrollToBottom();
        if (resp.accion?.tipo === 'navegar' && resp.accion.url) {
          setTimeout(() => this.router.navigateByUrl(resp.accion!.url), 800);
        }
      },
      error: () => {
        this.messages.pop();
        this.messages.push({
          role: 'assistant',
          content: 'Lo siento, en este momento no puedo responder. Escríbenos a contactanos@outiltech.co',
        });
        this.isLoading = false;
        this.scrollToBottom();
      },
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  onEmailKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.capturarEmail();
  }

  // Intercepta clicks en links del chat: outiltech.co → misma pestaña via Router
  onMessageAreaClick(event: MouseEvent) {
    const anchor = (event.target as HTMLElement).closest('a') as HTMLAnchorElement | null;
    if (!anchor) return;
    const href = anchor.getAttribute('href') || '';
    const esInterno = href.includes('outiltech.co') || href.startsWith('/');
    if (esInterno) {
      event.preventDefault();
      try {
        const url = new URL(href, window.location.origin);
        this.isOpen = false;
        this.router.navigateByUrl(url.pathname + url.search + url.hash);
      } catch { /* href inválido, dejar comportamiento por defecto */ }
    }
    // Links externos (WhatsApp, etc.) abren en nueva pestaña normalmente
  }

  votar(voto: 'positivo' | 'negativo') {
    if (this.votoEnviado) return;
    this.votoEnviado = true;
    this.jhonIaService.registrarSatisfaccion(this.sessionId, voto).subscribe();
    this.mostrarEncuesta = false;
    this.messages.push({ role: 'assistant', content: voto === 'positivo'
      ? '¡Gracias por tu voto! 😊 Es un placer ayudarte.'
      : '¡Gracias por tu feedback! Lo usaremos para mejorar. ¿En qué más puedo ayudarte?' });
    this.scrollToBottom();
  }

  // ── Banner PUNTO 3: Guardar conversación ─────────────────────
  guardarConversacion() {
    this.mostrarBannerGuardar = false;
    if (this.userEmail) {
      this.chatbotService.cerrarSesion(this.sessionId, this.userEmail, this.userName);
      this.messages.push({
        role: 'assistant',
        content: `✅ ¡Listo! Te envié el resumen de nuestra conversación a <b>${this.userEmail}</b>. ¡Hasta pronto! 😊`,
        tieneHtml: true
      });
      this.scrollToBottom();
      setTimeout(() => { this.resetChat(); this.isOpen = false; }, 3500);
    } else {
      this.mostrarEmailForm = true;
      this.messages.push({
        role: 'assistant',
        content: '📧 Ingresa tu correo para enviarte el resumen de la conversación:'
      });
      this.scrollToBottom();
    }
  }

  cerrarSinGuardar() {
    this.mostrarBannerGuardar = false;
    this.resetChat();
    this.isOpen = false;
  }

  private resetChat() {
    this.messages        = [];
    this.historial       = [];
    this.mostrarEncuesta = false;
    this.votoEnviado     = false;
    this.mostrarEscaladaWA   = false;
    this.mostrarBannerGuardar = false;
    this.sessionId = crypto.randomUUID();
    sessionStorage.setItem(this.SESSION_KEY, this.sessionId);
  }

  private esEmailValido(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 60);
  }
}
