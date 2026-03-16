import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Signals para el estado
  private userRole = signal<string | null>(localStorage.getItem('role'));
  private userToken = signal<string | null>(localStorage.getItem('token'));

  // Computed properties
  public isAuthenticated = computed(() => this.userToken() !== null);
  public role = computed(() => this.userRole());

  constructor(private router: Router, private http: HttpClient) {}

  login(email: string, password: string) {
    // Apuntamos al API Gateway
    return this.http.post<any>('/api/usuarios/auth/login', { email, password }).pipe(
      tap(res => {
        this.userRole.set(res.Role);
        this.userToken.set(res.Token);
        localStorage.setItem('role', res.Role);
        localStorage.setItem('token', res.Token);
      })
    );
  }

  logout() {
    this.userRole.set(null);
    this.userToken.set(null);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.userToken();
  }
}