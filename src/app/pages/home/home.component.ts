import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProdutoService, Produto, ProdutosPaginados } from '../../core/services/produto.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  produtosEmDestaque: Produto[] = [];

  constructor(
    private produtoService: ProdutoService,
    private servicoCarrinho: CartService,
  ) {}

  ngOnInit() {
    // Busca mais itens para garantir 3 com estoque após filtrar os zerados
    this.produtoService.getProdutos({ page: 0, size: 10 }).subscribe({
      next: (resposta) => {
        let lista: Produto[] = [];

        if (resposta && (resposta as ProdutosPaginados).content) {
          lista = (resposta as ProdutosPaginados).content;
        } else if (Array.isArray(resposta)) {
          lista = resposta as Produto[];
        }

        this.produtosEmDestaque = lista.filter((p) => p.estoque > 0).slice(0, 3);
      },
      error: (err) => console.error('Erro ao carregar produtos em destaque', err),
    });
  }

  adicionarAoCarrinho(event: Event, produto: Produto) {
    event.preventDefault();
    event.stopPropagation();
    this.servicoCarrinho.adicionarAoCarrinho(produto, 1);
  }
}
