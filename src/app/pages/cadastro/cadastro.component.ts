import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent {
  email = '';
  senha = '';
  celular = '';
  cpf = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email || !this.senha || !this.celular || !this.cpf) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    if (this.authService.register(this.email, this.senha)) {
      alert('Cadastro realizado com sucesso! Você já pode fazer login.');
      this.router.navigate(['/login']);
    } else {
      alert('Este email já está cadastrado. Por favor, faça login.');
      this.router.navigate(['/login']);
    }
  }
}