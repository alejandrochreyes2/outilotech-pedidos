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
    'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80',
    'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80'
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
