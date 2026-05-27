import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutoService, Produto } from '../../core/services/produto.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-detalhe-produto',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './detalhe-produto.component.html',
  styleUrls: ['./detalhe-produto.component.css'],
})
export class DetalheProdutoComponent implements OnInit {
  produto: Produto | null = null;
  carregando = true;
  quantidade: number = 1;
  abaAtiva: string = 'descricao';
  private produtoId: number | null = null;

  constructor(
    private rotaAtiva: ActivatedRoute,
    private roteador: Router,
    private produtoService: ProdutoService,
    private servicoCarrinho: CartService,
  ) {}

  ngOnInit() {
    const idParam = this.rotaAtiva.snapshot.paramMap.get('id');

    if (!idParam) {
      this.roteador.navigate(['/produtos']);
      return;
    }

    const id = parseInt(idParam, 10);

    if (isNaN(id)) {
      this.roteador.navigate(['/produtos']);
      return;
    }

    this.produtoId = id;

    this.produtoService.getProdutoById(id).subscribe({
      next: (produto) => {
        this.produto = { ...produto, id: produto.id ?? id };
        this.carregando = false;
      },
      error: () => {
        this.carregando = false;
        this.roteador.navigate(['/produtos']);
      },
    });
  }

  adicionarAoCarrinho() {
    if (!this.produto) return;

    // Garante que o id está presente (fallback para o id da rota)
    if (!this.produto.id) {
      if (this.produtoId) {
        this.produto = { ...this.produto, id: this.produtoId };
      } else {
        alert('Erro ao identificar o produto. Tente recarregar a página.');
        return;
      }
    }

    const qtd = Math.floor(Number(this.quantidade));
    if (!qtd || qtd < 1) {
      alert('Quantidade inválida. Informe ao menos 1 unidade.');
      this.quantidade = 1;
      return;
    }

    if (this.produto.estoque !== undefined && qtd > this.produto.estoque) {
      alert(`Quantidade indisponível. Estoque atual: ${this.produto.estoque} unidade(s).`);
      this.quantidade = this.produto.estoque;
      return;
    }

    this.quantidade = qtd;
    this.servicoCarrinho.adicionarAoCarrinho(this.produto, qtd);
  }

  comprarAgora() {
    if (!this.produto) return;
    this.adicionarAoCarrinho();
    this.roteador.navigate(['/carrinho']);
  }

  mudarAba(aba: string) {
    this.abaAtiva = aba;
  }
}
