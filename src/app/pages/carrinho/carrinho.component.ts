import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { CepService, EnderecoViaCep } from '../../core/services/cep.service';

@Component({
  selector: 'app-carrinho',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './carrinho.component.html',
  styleUrls: ['./carrinho.component.css'],
})
export class CarrinhoComponent implements OnInit {
  itensCarrinho: CartItem[] = [];
  subtotal = 0;
  frete = 0;
  totalFinal = 0;

  // Frete / CEP
  cepInput = '';
  buscandoCep = false;
  enderecoFrete: EnderecoViaCep | null = null;
  erroCep = '';

  constructor(
    private servicoCarrinho: CartService,
    private cepService: CepService,
    private roteador: Router,
  ) {}

  ngOnInit() {
    this.servicoCarrinho.cart$.subscribe((carrinho) => {
      this.itensCarrinho = carrinho;
      this.calcularTotais();
    });
  }

  calcularTotais() {
    this.subtotal = this.itensCarrinho.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );
    this.totalFinal = this.subtotal > 0 ? this.subtotal + this.frete : 0;
  }

  removerItem(produtoId: number) {
    this.servicoCarrinho.removerItem(produtoId);
  }

  decrementarQtd(produtoId: number) {
    const item = this.itensCarrinho.find(i => i.id === produtoId);
    if (!item) return;
    if (item.qty <= 1) {
      this.removerItem(produtoId);
    } else {
      this.servicoCarrinho.atualizarQuantidade(produtoId, item.qty - 1);
    }
  }

  incrementarQtd(item: CartItem) {
    if (item.estoque !== undefined && item.qty >= item.estoque) return;
    this.servicoCarrinho.atualizarQuantidade(item.id, item.qty + 1);
  }

  // ─── Frete via CEP ────────────────────────────────────────────────────────

  calcularFrete() {
    const cep = this.cepInput.replace(/\D/g, '');
    if (cep.length !== 8) {
      this.erroCep = 'Digite um CEP válido com 8 dígitos.';
      return;
    }

    this.buscandoCep = true;
    this.erroCep = '';
    this.enderecoFrete = null;

    this.cepService.buscarCep(cep).subscribe({
      next: (endereco) => {
        this.buscandoCep = false;
        if (endereco.erro) {
          this.erroCep = 'CEP não encontrado. Verifique e tente novamente.';
          return;
        }
        this.enderecoFrete = endereco;
        this.frete = this.cepService.calcularFretePorUF(endereco.uf);
        this.calcularTotais();
      },
      error: () => {
        this.buscandoCep = false;
        this.erroCep = 'Erro ao buscar CEP. Tente novamente.';
      },
    });
  }

  irParaPagamento() {
    if (this.itensCarrinho.length > 0) {
      this.roteador.navigate(['/pagamento']);
    }
  }
}
