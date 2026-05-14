import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-detalhe-produto',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './detalhe-produto.component.html',
  styleUrls: ['./detalhe-produto.component.css'],
})
export class DetalheProdutoComponent implements OnInit {
  produto: any;
  quantidade: number = 1;
  abaAtiva: string = 'descricao';

  constructor(
    private rotaAtiva: ActivatedRoute,
    private roteador: Router,
    private servicoProduto: ProductService,
    private servicoCarrinho: CartService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    const idProduto = this.rotaAtiva.snapshot.paramMap.get('id');

    if (idProduto) {
      this.produto = this.servicoProduto.getProductById(idProduto);
    }

    if (!this.produto) {
      if (isPlatformBrowser(this.platformId)) {
        alert('Produto não encontrado!');
      }
      this.roteador.navigate(['/produtos']);
    }
  }

  adicionarAoCarrinho() {
    if (isPlatformBrowser(this.platformId) && !localStorage.getItem('usuarioSessao')) {
      this.roteador.navigate(['/login']);
      return;
    }
    this.servicoCarrinho.adicionarAoCarrinho(this.produto, this.quantidade);
  }

  comprarAgora() {
    if (isPlatformBrowser(this.platformId) && !localStorage.getItem('usuarioSessao')) {
      this.roteador.navigate(['/login']);
      return;
    }
    this.adicionarAoCarrinho();
    this.roteador.navigate(['/carrinho']);
  }

  mudarAba(aba: string) {
    this.abaAtiva = aba;
  }
}
