import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  nome = '';
  email = '';
  senha = '';
  loading = false;
  erro = '';
  sucesso = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) {}

  onSubmit() {
    this.erro = '';
    this.sucesso = '';

    if (!this.nome || !this.email || !this.senha) {
      this.erro = 'Por favor, preencha todos os campos.';
      return;
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(this.email);
    if (!emailValido) {
      this.erro = 'Informe um e-mail válido (ex: nome@dominio.com).';
      return;
    }

    if (this.senha.length < 6) {
      this.erro = 'A senha deve ter no mínimo 6 caracteres.';
      return;
    }

    this.loading = true;

    this.authService.cadastro({ nome: this.nome, email: this.email, senha: this.senha }).subscribe({
      next: () => {
        this.sucesso = 'Cadastro realizado com sucesso! Redirecionando para o login...';
        this.loading = false;
        this.cdr.detectChanges();
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.erro = 'Este e-mail já está cadastrado.';
        } else if (err.status === 400) {
          this.erro = 'Verifique os dados: e-mail válido e senha com no mínimo 6 caracteres.';
        } else {
          this.erro = 'Não foi possível realizar o cadastro. Tente novamente.';
        }
        this.loading = false;
      }
    });
  }
}
