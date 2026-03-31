import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  username = '';
  password = '';
  error    = '';
  showPwd  = false;

  slides = [
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=85',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&q=85',
    'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=85',
    'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=1200&q=85'
  ];

  currentSlide = signal(0);
  private timer: any;

  get isLoading() { return this.auth.isLoading(); }

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.timer = setInterval(() => {
      this.currentSlide.update(i => (i + 1) % this.slides.length);
    }, 10000);
  }

  ngOnDestroy() { clearInterval(this.timer); }

  prev() {
    clearInterval(this.timer);
    this.currentSlide.update(i => (i - 1 + this.slides.length) % this.slides.length);
    this.ngOnInit();
  }

  next() {
    clearInterval(this.timer);
    this.currentSlide.update(i => (i + 1) % this.slides.length);
    this.ngOnInit();
  }

  goTo(index: number) {
    clearInterval(this.timer);
    this.currentSlide.set(index);
    this.ngOnInit();
  }

  onSubmit() {
    this.error = '';
    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.status === 401
          ? 'Credenciales incorrectas'
          : 'Error de conexión o inesperado';
      }
    });
  }
}
