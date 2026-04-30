import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itensNoCarrinho = new BehaviorSubject<any[]>([]);

  cart$ = this.itensNoCarrinho.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.carregarCarrinhoSalvo();
  }

  private carregarCarrinhoSalvo() {
    if (isPlatformBrowser(this.platformId)) {
      const salvo = localStorage.getItem('carrinho_bigode');
      if (salvo) {
        try {
          const dados = JSON.parse(salvo);
          this.itensNoCarrinho.next(dados);
        } catch (e) {
          console.error('Erro ao ler carrinho do localStorage', e);
          this.itensNoCarrinho.next([]);
        }
      }
    }
  }

  adicionarAoCarrinho(produto: any, quantidade: number) {
    console.log('Adicionando ao carrinho:', produto.name);

    const itensAtuais = this.itensNoCarrinho.value;
    const itemExistente = itensAtuais.find((p) => p.id === produto.id);

    let novosItens;
    if (itemExistente) {
      novosItens = itensAtuais.map((p) =>
        p.id === produto.id ? { ...p, qty: p.qty + quantidade } : p,
      );
    } else {
      novosItens = [...itensAtuais, { ...produto, qty: quantidade }];
    }

    this.itensNoCarrinho.next(novosItens);
    this.salvarNoStorage(novosItens);
  }

  removerItem(id: string) {
    const atualizados = this.itensNoCarrinho.value.filter((p) => p.id !== id);
    this.itensNoCarrinho.next(atualizados);
    this.salvarNoStorage(atualizados);
  }

  private salvarNoStorage(itens: any[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('carrinho_bigode', JSON.stringify(itens));
    }
  }
}
