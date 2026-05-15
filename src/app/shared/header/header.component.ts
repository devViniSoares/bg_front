import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  termoBusca: string = '';
  cartCount: number = 0;

  constructor(
    private router: Router,
    private servicoCarrinho: CartService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.servicoCarrinho.cart$.subscribe((itens) => {
      this.cartCount = itens.reduce((total, item) => total + item.qty, 0);
    });
  }

  estaLogado(): boolean {
    return this.authService.isLoggedIn();
  }

  handleUserIconClick(event: Event) {
    event.preventDefault();
    if (this.estaLogado()) {
      if (confirm('Deseja sair da sua conta?')) {
        this.authService.logout();
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  executarBusca() {
    if (this.termoBusca.trim()) {
      this.router.navigate(['/produtos'], { queryParams: { busca: this.termoBusca } });
    }
  }

  limparBuscaGlobal() {
    this.termoBusca = '';
    this.router.navigate(['/produtos']);
  }
}
