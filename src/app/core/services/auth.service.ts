import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  getRegisteredUsers() {
    if (typeof localStorage !== 'undefined') {
      return JSON.parse(localStorage.getItem('users') || '[]');
    }
    return [];
  }

  register(email: string, senha: string): boolean {
    const users = this.getRegisteredUsers();
    if (users.find((u: any) => u.email === email)) return false;
    
    users.push({ email, senha });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('users', JSON.stringify(users));
    }
    return true;
  }

  login(email: string, senha: string): boolean {
    const users = this.getRegisteredUsers();
    const user = users.find((u: any) => u.email === email && u.senha === senha);
    
    if (user) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', email.split('@')[0]);
      }
      return true;
    }
    return false;
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('cart');
    }
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  }

  getUserName(): string {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('userName') || 'Cliente';
    }
    return 'Cliente';
  }
}