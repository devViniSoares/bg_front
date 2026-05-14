import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getRegisteredUsers() {
    if (isPlatformBrowser(this.platformId)) {
      return JSON.parse(localStorage.getItem('users') || '[]');
    }
    return [];
  }

    register(user: any): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const users = this.getRegisteredUsers();
      const userExists = users.find((u: any) => u.email === user.email);
      if (userExists) {
        return false; 
      }
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      return true;
    }
    return false;
  }

  login(email: string, senha: string): boolean {
    if (email === 'admin@bigode.com' && senha === 'admin123') {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('usuarioSessao', 'ativo');
        localStorage.setItem('emailUsuario', email);
        localStorage.setItem('userName', 'Admin');
      }
      return true; 
    }

    const users = this.getRegisteredUsers();
    const user = users.find((u: any) => u.email === email && u.senha === senha);
    
    if (user) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('usuarioSessao', 'ativo');
        localStorage.setItem('emailUsuario', email);
        localStorage.setItem('userName', user.nome || email.split('@')[0]);
      }
      return true; 
    }

    return false; 
  }

  estaLogado(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuarioSessao') === 'ativo';
    }
    return false;
  }

  getUserName(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userName') || 'Cliente';
    }
    return 'Cliente';
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuarioSessao');
      localStorage.removeItem('emailUsuario');
      localStorage.removeItem('userName');
      
      this.router.navigate(['/login']);
    }
  }
}