import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';

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
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.servicoCarrinho.cart$.subscribe((itens) => {
      this.cartCount = itens.reduce((total, item) => total + item.qty, 0);
    });

    if (isPlatformBrowser(this.platformId)) {
      this.carregarBuscaSalva();
    }
  }

  estaLogado(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('usuarioSessao') !== null;
    }
    return false;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      const confirmacao = confirm("Já vai, mestre? Quer mesmo sair da conta?");
      if (confirmacao) {
        localStorage.removeItem('usuarioSessao');
        this.router.navigate(['/login']);
      }
    }
  }

  handleUserIconClick(event: Event) {
    event.preventDefault();
    if (this.estaLogado()) {
      this.logout();
    } else {
      this.router.navigate(['/login']);
    }
  }

  executarBusca() {
    if (this.termoBusca.trim()) {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('ultimaBuscaBigode', this.termoBusca);
      }
      this.router.navigate(['/produtos']);
    }
  }

  limparBuscaGlobal() {
    this.termoBusca = '';
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('ultimaBuscaBigode'); 
    }
  }

  carregarBuscaSalva() {
    if (isPlatformBrowser(this.platformId)) {
      const salvo = localStorage.getItem('ultimaBuscaBigode');
      if (salvo) {
        this.termoBusca = salvo;
      }
    }
  }
}
