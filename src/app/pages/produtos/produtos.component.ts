import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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
    Elétrica: false,
  };

  constructor(
    private servicoProduto: ProductService,
    private servicoCarrinho: CartService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.produtosOriginais = this.servicoProduto.getProducts();

    if (isPlatformBrowser(this.platformId)) {
      const buscaSalva = localStorage.getItem('ultimaBuscaBigode');
      if (buscaSalva) {
        this.filtrarPorTexto(buscaSalva);
      } else {
        this.produtosExibidos = [...this.produtosOriginais];
      }
    } else {
      this.produtosExibidos = [...this.produtosOriginais];
    }
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

  atualizarPreco(event: any) {
    this.filtroPreco = event.target.value;
  }
  alternarCategoria(cat: string, event: any) {
    this.categoriasSelecionadas[cat] = event.target.checked;
  }
}
