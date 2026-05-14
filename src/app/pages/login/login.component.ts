import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service'; // Chame o porteiro

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  senha: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const loginValidado = this.authService.login(this.email, this.senha);

    if (loginValidado) {
      
      if (this.email === 'admin@bigode.com') {
        this.router.navigate(['/admin']);
      } else {
        alert(`Bem-vindo de volta, ${this.authService.getUserName()}!`);
        this.router.navigate(['/']);
      }

    } else {
      alert('E-mail ou senha incorretos! Tente novamente.');
    }
  }
}