import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.css']
})
export class PagamentoComponent implements OnInit {
  totalProdutos: number = 0;
  frete: number = 55.00;

  dadosCartao = {
    nome: '',
    numero: '',
    validade: '',
    cvv: ''
  };

  constructor(
    private servicoCarrinho: CartService,
    private roteador: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.servicoCarrinho.cart$.subscribe(itens => {
      this.totalProdutos = itens.reduce((acc, item) => acc + (item.price * item.qty), 0);
    });

    if (this.totalProdutos === 0 && isPlatformBrowser(this.platformId)) {
       this.roteador.navigate(['/carrinho']);
    }
  }

  finalizarPedido(form: NgForm) {
  if (form.invalid) {
    Object.keys(form.controls).forEach(campo => {
      form.controls[campo].markAsTouched();
    });
    return;
  }

  if (isPlatformBrowser(this.platformId)) {
    alert('Aí sim! Pedido confirmado. Agora é com a gente, logo menos a peça chega aí!');
    
    this.servicoCarrinho.limparCarrinho();
    this.roteador.navigate(['/']); 
  }
}
}