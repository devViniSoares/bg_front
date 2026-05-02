import { Component, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  senha: string = '';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  onSubmit() {
    if (this.email && this.senha) {
      if (isPlatformBrowser(this.platformId)) {
        const dadosUsuario = {
          email: this.email,
          nome: 'Vinícius',
          timestamp: new Date().getTime(),
        };
        localStorage.setItem('usuarioSessao', JSON.stringify(dadosUsuario));
      }

      this.router.navigate(['/']);
    } else {
      alert('Preencha os campos corretamente.');
    }
  }
}
