import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProdutoService, Produto, ProdutosPaginados, FiltrosProduto } from '../../core/services/produto.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
})
export class ProdutosComponent implements OnInit {
  produtosExibidos: Produto[] = [];
  carregando = false;

  // Paginação
  paginaAtual = 0;
  totalPaginas = 0;
  tamanhoPagina = 20;

  // Filtros
  filtroPreco: number = 30000;
  categoriasSelecionadas: { [key: string]: boolean } = {
    Motor: false,
    Freio: false,
    Suspensão: false,
    Iluminação: false,
  };
  termoBusca = '';

  constructor(
    private produtoService: ProdutoService,
    private servicoCarrinho: CartService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      // Reseta estado
      this.paginaAtual = 0;
      this.filtroPreco = 30000;
      Object.keys(this.categoriasSelecionadas).forEach(
        (cat) => (this.categoriasSelecionadas[cat] = false)
      );
      this.termoBusca = '';

      if (params['busca']) {
        this.termoBusca = params['busca'];
      } else if (params['categoria']) {
        const cat = params['categoria'];
        if (Object.prototype.hasOwnProperty.call(this.categoriasSelecionadas, cat)) {
          this.categoriasSelecionadas[cat] = true;
        }
      }

      this.carregarProdutos();
    });
  }

  carregarProdutos() {
    this.carregando = true;

    const categoriasAtivas = Object.keys(this.categoriasSelecionadas).filter(
      (cat) => this.categoriasSelecionadas[cat]
    );

    const filtros: FiltrosProduto = {
      page: this.paginaAtual,
      size: this.tamanhoPagina,
    };

    if (categoriasAtivas.length === 1) filtros.categoria = categoriasAtivas[0];
    if (this.termoBusca.trim()) filtros.nome = this.termoBusca.trim();

    this.produtoService.getProdutos(filtros).subscribe({
      next: (resposta) => {
        let lista: Produto[];

        if (resposta && (resposta as ProdutosPaginados).content) {
          const paginado = resposta as ProdutosPaginados;
          lista = paginado.content;
          this.totalPaginas = paginado.totalPages ?? 1;
        } else if (Array.isArray(resposta)) {
          lista = resposta as Produto[];
          this.totalPaginas = 1;
        } else {
          lista = [];
          this.totalPaginas = 0;
        }

        // Filtros aplicados no cliente: oculta sem estoque + filtro de preço
        this.produtosExibidos = lista.filter(
          (p) =>
            p.estoque > 0 &&
            (this.filtroPreco >= 30000 || p.preco <= this.filtroPreco)
        );

        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos', err);
        this.carregando = false;
      },
    });
  }

  aplicarFiltros() {
    this.paginaAtual = 0;
    this.carregarProdutos();
  }

  limparTudo() {
    this.filtroPreco = 5000;
    Object.keys(this.categoriasSelecionadas).forEach(
      (cat) => (this.categoriasSelecionadas[cat] = false)
    );
    this.termoBusca = '';
    this.paginaAtual = 0;
    this.carregarProdutos();
  }

  mudarPagina(pagina: number) {
    if (pagina >= 0 && pagina < this.totalPaginas) {
      this.paginaAtual = pagina;
      this.carregarProdutos();
    }
  }

  atualizarPreco(event: Event) {
    this.filtroPreco = +(event.target as HTMLInputElement).value;
  }

  alternarCategoria(cat: string, event: Event) {
    this.categoriasSelecionadas[cat] = (event.target as HTMLInputElement).checked;
  }

  adicionarAoCarrinho(event: Event, produto: Produto) {
    event.preventDefault();
    this.servicoCarrinho.adicionarAoCarrinho(produto, 1);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i);
  }
}
