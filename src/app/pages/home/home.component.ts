import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'] 
})
export class HomeComponent implements OnInit {
  produtosEmDestaque: any[] = [];

  constructor(
    private servicoProduto: ProductService,
    private servicoCarrinho: CartService,
    @Inject(PLATFORM_ID) private platformId: Object 
  ) {}

  ngOnInit() {
    this.produtosEmDestaque = [
      this.servicoProduto.getProductById('T300-HP-01'),
      this.servicoProduto.getProductById('PA-CE-04'),
      this.servicoProduto.getProductById('AM-ES-ADJ')
    ];
  }

  adicionarAoCarrinho(event: Event, produto: any) { 
    event.preventDefault();
    event.stopPropagation();
    
    this.servicoCarrinho.adicionarAoCarrinho(produto, 1);
  }
}