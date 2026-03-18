import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { tap, finalize } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CurrentUser {
  email: string;
  name: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _token    = signal<string | null>(localStorage.getItem('token'));
  private _role     = signal<string | null>(localStorage.getItem('role'));
  private _user     = signal<CurrentUser | null>(
    JSON.parse(localStorage.getItem('currentUser') ?? 'null')
  );

  isLoading     = signal(false);
  isAuthenticated = computed(() => this._token() !== null);
  role          = computed(() => this._role());
  currentUser   = computed(() => this._user());
  isAdmin       = computed(() => this._role()?.toLowerCase() === 'admin');

  constructor(private router: Router, private http: HttpClient) {}

  login(email: string, password: string) {
    this.isLoading.set(true);
    return this.http.post<any>(`${environment.apiUrl}/api/usuarios/auth/login`, { email, password }).pipe(
      tap(res => {
        const role: string  = res?.role     ?? res?.Role     ?? 'User';
        const token: string = res?.token    ?? res?.Token    ?? '';
        const user: CurrentUser = {
          email: res?.email    ?? res?.Email    ?? email,
          name:  res?.fullName ?? res?.FullName ?? email,
          role
        };

        this._token.set(token);
        this._role.set(role);
        this._user.set(user);

        localStorage.setItem('token',       token);
        localStorage.setItem('role',        role);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }),
      finalize(() => this.isLoading.set(false))
    );
  }

  logout() {
    this._token.set(null);
    this._role.set(null);
    this._user.set(null);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this._token();
  }
}
