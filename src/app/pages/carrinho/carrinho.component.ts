import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css']
})
export class CarrinhoComponent implements OnInit {
  itensCarrinho: any[] = [];
  subtotal = 0;
  frete = 55.00;
  totalFinal = 0;

  constructor(
    private servicoCarrinho: CartService, 
    private roteador: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.servicoCarrinho.cart$.subscribe(carrinho => {
      this.itensCarrinho = carrinho;
      this.calcularTotais();
    });
  }

  calcularTotais() {
    this.subtotal = this.itensCarrinho.reduce((acc, item) => acc + (item.price * item.qty), 0);
    this.totalFinal = this.subtotal > 0 ? this.subtotal + this.frete : 0;
  }

  removerItem(id: string) {
    this.servicoCarrinho.removerItem(id);
  }

  alterarQuantidade(id: string, event: any) {
    const novaQuantidade = parseInt(event.target.value, 10);
    if (novaQuantidade > 0) {
      this.servicoCarrinho.atualizarQuantidade(id, novaQuantidade);
    } else {
      this.removerItem(id);
    }
  }

  irParaPagamento() {
    if (this.itensCarrinho.length > 0) {
      this.roteador.navigate(['/pagamento']);
    } else {
      if (isPlatformBrowser(this.platformId)) {
        alert('Seu carrinho está vazio!');
      }
    }
  }
}