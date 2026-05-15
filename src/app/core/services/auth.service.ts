import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface LoginResponse {
  token: string;
  tipo: string;
  id: number;
  nome: string;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
}

const API_URL = 'http://localhost:8080';
const TOKEN_KEY = 'token';
const USER_KEY = 'usuarioSessao';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, senha: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, { email, senha }).pipe(
      tap(response => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(TOKEN_KEY, response.token);
          localStorage.setItem(USER_KEY, JSON.stringify({
            id: response.id,
            nome: response.nome,
            tipo: response.tipo
          }));
        }
      })
    );
  }

  cadastro(dados: CadastroRequest): Observable<string> {
    return this.http.post(`${API_URL}/auth/cadastro`, dados, { responseType: 'text' });
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem('cart');
    }
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem(TOKEN_KEY);
    }
    return false;
  }

  isAdmin(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) return JSON.parse(raw).tipo === 'ADMIN';
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }

  getUserName(): string {
    if (isPlatformBrowser(this.platformId)) {
      const raw = localStorage.getItem(USER_KEY);
      if (raw) return JSON.parse(raw).nome ?? 'Cliente';
    }
    return 'Cliente';
  }
}
