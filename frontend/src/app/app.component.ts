import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // Uso de Signals e Injectors (Angular 21 style)
  public auth = inject(AuthService);
  private _darkMode = false;

  get darkMode() {
    return this._darkMode;
  }

  toggleTheme() {
    this._darkMode = !this._darkMode;
    document.body.classList.toggle('dark-mode', this._darkMode);
  }
}