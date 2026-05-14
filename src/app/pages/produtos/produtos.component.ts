import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css'],
})
export class ProdutosComponent implements OnInit {
  produtosOriginais: any[] = [];
  produtosExibidos: any[] = [];
  filtroPreco: number = 5000;
  categoriasSelecionadas: { [key: string]: boolean } = {
    Motor: false,
    Freio: false,
    Suspensão: false,
    Iluminação: false,
  };

  constructor(
    private servicoProduto: ProductService,
    private servicoCarrinho: CartService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.produtosOriginais = this.servicoProduto.getProducts();

    this.route.queryParams.subscribe(params => {
      this.produtosExibidos = [...this.produtosOriginais];
      this.filtroPreco = 5000;
      Object.keys(this.categoriasSelecionadas).forEach(cat => this.categoriasSelecionadas[cat] = false);

      if (params['busca']) {
        this.filtrarPorTexto(params['busca']);
      } else if (params['categoria']) {
        const cat = params['categoria'];
        if (this.categoriasSelecionadas.hasOwnProperty(cat)) {
          this.categoriasSelecionadas[cat] = true;
        }
        this.aplicarFiltros();
      }
    });
  }

  filtrarPorTexto(termo: string) {
    this.produtosExibidos = this.produtosOriginais.filter((p) =>
      p.name.toLowerCase().includes(termo.toLowerCase()),
    );
  }

  aplicarFiltros() {
    const categoriasAtivas = Object.keys(this.categoriasSelecionadas).filter(
      (cat) => this.categoriasSelecionadas[cat],
    );

    this.produtosExibidos = this.produtosOriginais.filter((p) => {
      const passaPreco = p.price <= this.filtroPreco;
      const passaCategoria =
        categoriasAtivas.length === 0 || categoriasAtivas.includes(p.category);
      return passaPreco && passaCategoria;
    });
  }

  adicionarAoCarrinho(event: Event, produto: any) {
    event.preventDefault();
    this.servicoCarrinho.adicionarAoCarrinho(produto, 1);
  }

  limparTudo() {
    this.filtroPreco = 5000;
    Object.keys(this.categoriasSelecionadas).forEach(cat => {
      this.categoriasSelecionadas[cat] = false;
    });
    this.produtosExibidos = [...this.produtosOriginais];
  }

  atualizarPreco(event: any) {
    this.filtroPreco = event.target.value;
  }
  alternarCategoria(cat: string, event: any) {
    this.categoriasSelecionadas[cat] = event.target.checked;
  }
}
