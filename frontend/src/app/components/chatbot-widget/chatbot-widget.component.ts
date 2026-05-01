import { Component, ViewChild, ElementRef, HostListener, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../services/chatbot.service';

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
export class ChatbotWidgetComponent {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private chatbotService = inject(ChatbotService);
  private elementRef = inject(ElementRef);

  isOpen = false;
  isLoading = false;
  currentInput = '';
  avatarError = false;
  messages: DisplayMessage[] = [];
  private historial: ChatMessage[] = [];

  private readonly WELCOME =
    '¡Hola! Soy Jhon, el asistente IA de Outiltech 🤖\n' +
    '¿En qué puedo ayudarte hoy?\n\n' +
    'Puedo orientarte sobre productos, precios, garantías, servicios de software, o conectarte directamente con nuestro equipo.';

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      this.messages = [{ role: 'assistant', content: this.WELCOME }];
    }
    this.scrollToBottom();
  }

  close() {
    this.isOpen = false;
  }

  openWhatsApp(tipo: 'ventas' | 'posventa') {
    const texts: Record<string, string> = {
      ventas: 'Hola estoy interesado en los productos de outiltech',
      posventa: 'Hola, estoy interesado en servicio posventa de outiltech',
    };
    window.open(`https://wa.me/573133082905?text=${encodeURIComponent(texts[tipo])}`, '_blank');
  }

  onAvatarError() {
    this.avatarError = true;
  }

  sendMessage() {
    const msg = this.currentInput.trim();
    if (!msg || this.isLoading) return;

    this.messages.push({ role: 'user', content: msg });
    this.historial.push({ role: 'user', content: msg });
    this.currentInput = '';
    this.isLoading = true;

    this.messages.push({ role: 'assistant', content: '', isTyping: true });
    this.scrollToBottom();

    this.chatbotService.enviarMensaje(msg, this.historial.slice(0, -1)).subscribe({
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

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 60);
  }
}
