import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { PedidoService } from '../../core/services/pedido.service';
import { CepService } from '../../core/services/cep.service';

@Component({
  selector: 'app-pagamento',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pagamento.component.html',
  styleUrls: ['./pagamento.component.css'],
})
export class PagamentoComponent implements OnInit {
  totalProdutos: number = 0;
  frete: number = 0;
  processando = false;
  buscandoCep = false;
  erroCep = '';

  itensCarrinho: CartItem[] = [];

  dadosCartao = {
    nome: '',
    numero: '',
    validade: '',
    cvv: '',
  };

  endereco = {
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
  };

  constructor(
    private servicoCarrinho: CartService,
    private pedidoService: PedidoService,
    private cepService: CepService,
    private roteador: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit() {
    this.servicoCarrinho.cart$.subscribe((itens) => {
      this.itensCarrinho = itens;
      this.totalProdutos = itens.reduce(
        (acc, item) => acc + item.price * item.qty,
        0
      );
    });

    if (this.totalProdutos === 0 && isPlatformBrowser(this.platformId)) {
      this.roteador.navigate(['/carrinho']);
    }
  }

  buscarEnderecoPorCep() {
    const cep = this.endereco.cep.replace(/\D/g, '');
    if (cep.length !== 8) return;

    this.buscandoCep = true;
    this.erroCep = '';

    this.cepService.buscarCep(cep).subscribe({
      next: (endereco) => {
        this.buscandoCep = false;
        if (endereco.erro) {
          this.erroCep = 'CEP não encontrado.';
          return;
        }
        this.endereco.rua    = endereco.logradouro ?? '';
        this.endereco.bairro = endereco.bairro     ?? '';
        this.endereco.cidade = endereco.localidade  ?? '';
        this.endereco.estado = endereco.uf          ?? '';
        this.frete = this.cepService.calcularFretePorUF(endereco.uf);
      },
      error: () => {
        this.buscandoCep = false;
        this.erroCep = 'Erro ao buscar CEP. Tente novamente.';
      },
    });
  }

  finalizarPedido(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach((campo) => {
        form.controls[campo].markAsTouched();
      });
      return;
    }

    if (this.processando || this.itensCarrinho.length === 0) return;

    this.processando = true;

    const itensPedido = this.itensCarrinho.map((item) => ({
      produtoId: item.id,
      quantidade: item.qty,
    }));

    // Passo 1: Criar o pedido
    this.pedidoService.criar(itensPedido, this.endereco).subscribe({
      next: (pedido) => {
        const valorTotal = pedido.total ?? this.totalProdutos + this.frete;

        // Passo 2: Processar pagamento
        this.pedidoService
          .processarPagamento(pedido.id, valorTotal, 'CARTAO')
          .subscribe({
            next: (pagamento) => {
              this.processando = false;

              if (pagamento.status === 'APROVADO') {
                this.servicoCarrinho.limparCarrinho();
                if (isPlatformBrowser(this.platformId)) {
                  alert(
                    'Pedido confirmado! Em breve a peça chega aí!'
                  );
                }
                this.roteador.navigate(['/']);
              } else {
                alert(
                  'Pagamento não aprovado. Verifique os dados do cartão e tente novamente.'
                );
              }
            },
            error: () => {
              this.processando = false;
              alert('Erro ao processar pagamento. Tente novamente.');
            },
          });
      },
      error: () => {
        this.processando = false;
        alert('Erro ao criar pedido. Tente novamente.');
      },
    });
  }
}
