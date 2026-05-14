import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  nome: string = '';
  email: string = '';
  senha: string = '';
  confirmarSenha: string = '';
  celular: string = '';
  cpf: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.email || !this.senha) {
      alert('Por favor, preencha pelo menos o e-mail e a senha.');
      return;
    }

    if (this.confirmarSenha && this.senha !== this.confirmarSenha) {
      alert('As senhas não coincidem! Verifique e tente novamente.');
      return;
    }

    const novoUsuario = {
      nome: this.nome,
      email: this.email,
      senha: this.senha
    };

    const cadastroAprovado = this.authService.register(novoUsuario);

    if (cadastroAprovado) {
      alert('Cadastro realizado com sucesso! Agora é só fazer o login.');
      this.router.navigate(['/login']); 
    } else {
      alert('Opa! Esse e-mail já está cadastrado. Tente fazer o login ou use outro e-mail.');
    }
  }
}