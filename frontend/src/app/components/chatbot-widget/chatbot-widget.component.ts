import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';
import { AuthService } from '../../services/auth.service';

interface DisplayMessage {
  role: 'user' | 'assistant';
  content: string;
  isTyping?: boolean;
}

@Component({
  selector: 'app-chatbot-widget',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chatbot-widget.component.html',
  styleUrls: ['./chatbot-widget.component.css']
})
export class ChatbotWidgetComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private chatbotService = inject(ChatbotService);
  private authService    = inject(AuthService);
  private elementRef     = inject(ElementRef);

  // Estado del panel
  isOpen    = false;
  isLoading = false;
  avatarError = false;

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

  private readonly WELCOME =
    '¡Hola! Soy Jhon, el asistente IA de Outiltech 🤖\n' +
    '¿En qué puedo ayudarte hoy?\n\n' +
    'Puedo orientarte sobre productos, precios, garantías, servicios de software, o conectarte directamente con nuestro equipo.';

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
        this.messages = [{ role: 'assistant', content: this.WELCOME }];
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
    const texts: Record<string, string> = {
      ventas:   'Hola estoy interesado en los productos de outiltech',
      posventa: 'Hola, estoy interesado en servicio posventa de outiltech',
    };
    window.open(`https://wa.me/573133082905?text=${encodeURIComponent(texts[tipo])}`, '_blank');
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
        this.messages.push({ role: 'assistant', content: resp.respuesta });
        this.historial.push({ role: 'assistant', content: resp.respuesta });
        this.isLoading = false;
        this.scrollToBottom();
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
