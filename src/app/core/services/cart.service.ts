import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

export interface CartItem {
  
  id: number;
  carrinhoItemId?: number;
  name: string;
  price: number;
  img: string;
  qty: number;
  estoque?: number;
}

interface CarrinhoAPI {
  id: number;
  itens: CarrinhoItemAPI[];
  total: number;
}

interface CarrinhoItemAPI {
  id: number;
  quantidade: number;
  produto: {
    id: number;
    nome: string;
    preco: number;
    imagemUrl: string;
    estoque?: number;
  };
}

const API_URL = 'http://localhost:8080';
const STORAGE_KEY = 'carrinho_bigode';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private itensNoCarrinho = new BehaviorSubject<CartItem[]>([]);
  private _notificacao = new Subject<string>();
  private carrinhoId: number | null = null;

  cart$ = this.itensNoCarrinho.asObservable();
  notificacao$ = this._notificacao.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {
    this.carregarCarrinhoSalvo();
  }

  // ─── Helpers ──────────────────────────────────────────────────────────────

  private isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('token');
  }

  private mapItemAPI(item: CarrinhoItemAPI): CartItem {
    return {
      id: item.produto.id,
      carrinhoItemId: item.id,
      name: item.produto.nome,
      price: item.produto.preco,
      img: item.produto.imagemUrl,
      qty: item.quantidade,
      estoque: item.produto.estoque,
    };
  }


  private atualizarEstadoDoCarrinho(
    carrinho: CarrinhoAPI,
    estoqueExtras: Map<number, number> = new Map()
  ) {
    this.carrinhoId = carrinho.id;
    const itensAnteriores = this.itensNoCarrinho.value;

    const itens: CartItem[] = (carrinho.itens || []).map(i => {
      const item = this.mapItemAPI(i);

      if (item.estoque === undefined || item.estoque === null) {
        if (estoqueExtras.has(item.id)) {
          item.estoque = estoqueExtras.get(item.id);
        } else {
          const anterior = itensAnteriores.find(p => p.id === item.id);
          item.estoque = anterior?.estoque;
        }
      }

      return item;
    });

    this.itensNoCarrinho.next(itens);
    this.salvarNoStorage(itens);
  }

  private carregarCarrinhoSalvo() {
    if (isPlatformBrowser(this.platformId)) {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        try {
          this.itensNoCarrinho.next(JSON.parse(salvo));
        } catch {
          this.itensNoCarrinho.next([]);
        }
      }
    }
  }

  private salvarNoStorage(itens: CartItem[]) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
    }
  }

  // ─── API sync ─────────────────────────────────────────────────────────────

  carregarCarrinhoAPI() {
    if (!this.isLoggedIn()) return;

    this.http.get<CarrinhoAPI[]>(`${API_URL}/carrinho`).subscribe({
      next: (carrinhos) => {
        if (carrinhos && carrinhos.length > 0) {
          this.atualizarEstadoDoCarrinho(carrinhos[0]);
        } else {
          this.itensNoCarrinho.next([]);
          this.salvarNoStorage([]);
        }
      },
      error: (err) => console.error('Erro ao carregar carrinho da API', err),
    });
  }

  getCarrinhoId(): number | null {
    return this.carrinhoId;
  }

  // ─── Ações ────────────────────────────────────────────────────────────────

  adicionarAoCarrinho(produto: any, quantidade: number) {
    if (!isPlatformBrowser(this.platformId) || !localStorage.getItem('usuarioSessao')) {
      this._notificacao.next('Faça login para adicionar produtos ao carrinho.');
      return;
    }

    const nomeProduto = produto.nome ?? produto.name ?? 'Produto';

    if (this.isLoggedIn()) {
  
      const produtoId = Number(produto.id ?? produto.produtoId);
      if (!produtoId || isNaN(produtoId)) {
        this._notificacao.next('Erro ao identificar o produto. Tente recarregar a página.');
        return;
      }

      const estoque: number | undefined = produto.estoque;
      if (estoque !== undefined) {
        const itemNoCarrinho = this.itensNoCarrinho.value.find(p => p.id === produtoId);
        const qtdJaNoCarrinho = itemNoCarrinho?.qty ?? 0;
        const totalPretendido = qtdJaNoCarrinho + quantidade;

        if (totalPretendido > estoque) {
          const disponivelParaAdicionar = estoque - qtdJaNoCarrinho;
          if (disponivelParaAdicionar <= 0) {
            this._notificacao.next(`Estoque máximo já adicionado ao carrinho (${estoque} un.).`);
          } else {
            this._notificacao.next(
              `Estoque insuficiente. Você pode adicionar mais ${disponivelParaAdicionar} unidade(s).`
            );
          }
          return;
        }
      }

      const estoqueExtras = new Map<number, number>();
      if (estoque !== undefined) estoqueExtras.set(produtoId, estoque);

      const jaNoCarrinho = this.itensNoCarrinho.value.some(p => p.id === produtoId);
      if (jaNoCarrinho) {
        this._notificacao.next(`Produto já está no carrinho. Adicionando mais unidades!`);
      }

      this.http
        .post<CarrinhoAPI>(`${API_URL}/carrinho/item`, {
          produtoId,
          quantidade,
        })
        .subscribe({
          next: (carrinhoAtualizado) => {
            if (carrinhoAtualizado?.itens) {
              this.atualizarEstadoDoCarrinho(carrinhoAtualizado, estoqueExtras);
            }
            if (!jaNoCarrinho) {
              this._notificacao.next(`${nomeProduto} adicionado ao carrinho!`);
            }
          },
          error: (err: HttpErrorResponse) => {
            if (err.status === 400) {
              this._notificacao.next('Quantidade indisponível em estoque.');
            } else {
              this._notificacao.next('Erro ao adicionar ao carrinho. Tente novamente.');
            }
            console.error('[CartService] Erro ao adicionar item:', err);
          },
        });
    } else {
      const itensAtuais = this.itensNoCarrinho.value;
      const itemExistente = itensAtuais.find((p) => p.id === produto.id);
      let novosItens: CartItem[];

      if (itemExistente) {
        const novaQtd = itemExistente.qty + quantidade;
        const estoqueItem = itemExistente.estoque ?? produto.estoque;
        if (estoqueItem !== undefined && novaQtd > estoqueItem) {
          const disponivel = estoqueItem - itemExistente.qty;
          if (disponivel <= 0) {
            this._notificacao.next(`Estoque máximo já adicionado ao carrinho (${estoqueItem} un.).`);
          } else {
            this._notificacao.next(
              `Estoque insuficiente. Você pode adicionar mais ${disponivel} unidade(s).`
            );
          }
          return;
        }
        this._notificacao.next(`Produto já está no carrinho. Adicionando mais unidades!`);
        novosItens = itensAtuais.map((p) =>
          p.id === produto.id ? { ...p, qty: novaQtd } : p
        );
      } else {
        novosItens = [
          ...itensAtuais,
          {
            id: produto.id,
            name: produto.nome ?? produto.name,
            price: produto.preco ?? produto.price,
            img: produto.imagemUrl ?? produto.img,
            qty: quantidade,
            estoque: produto.estoque,
          },
        ];
      }

      this.itensNoCarrinho.next(novosItens);
      this.salvarNoStorage(novosItens);
      if (!itemExistente) {
        this._notificacao.next(`${nomeProduto} adicionado ao carrinho!`);
      }
    }
  }

  removerItem(produtoId: number) {
    const itensAtuais = this.itensNoCarrinho.value;
    const item = itensAtuais.find((p) => p.id === produtoId);

    const removerLocalmente = () => {
      const atualizados = itensAtuais.filter((p) => p.id !== produtoId);
      this.itensNoCarrinho.next(atualizados);
      this.salvarNoStorage(atualizados);
    };

    if (this.isLoggedIn() && item?.carrinhoItemId) {
      this.http
        .delete<void>(`${API_URL}/carrinho/item/${item.carrinhoItemId}`)
        .subscribe({
          next: () => removerLocalmente(),
          error: (err: HttpErrorResponse) => {
            // Mesmo com erro na API, remove do estado local para não prender o item
            removerLocalmente();
            console.error('[CartService] Erro ao remover item da API (removido localmente):', err);
          },
        });
    } else {
      removerLocalmente();
    }
  }

  atualizarQuantidade(produtoId: number, novaQuantidade: number) {
    const item = this.itensNoCarrinho.value.find(p => p.id === produtoId);
    if (!item) return;

    if (item.estoque !== undefined && novaQuantidade > item.estoque) {
      novaQuantidade = item.estoque;
    }

    // Atualiza localmente de imediato para UI responsiva
    const novosItens = this.itensNoCarrinho.value.map((p) =>
      p.id === produtoId ? { ...p, qty: novaQuantidade } : p
    );
    this.itensNoCarrinho.next(novosItens);
    this.salvarNoStorage(novosItens);

    // Sincroniza com o backend: calcula delta em relação ao estado atual
    if (this.isLoggedIn() && item.carrinhoItemId) {
      const delta = novaQuantidade - item.qty;
      if (delta === 0) return;

      if (delta > 0) {
        this.http.post<CarrinhoAPI>(`${API_URL}/carrinho/item`, {
          produtoId,
          quantidade: delta,
        }).subscribe({
          next: (carrinhoAtualizado) => {
            if (carrinhoAtualizado?.itens) {
              this.atualizarEstadoDoCarrinho(carrinhoAtualizado);
            }
          },
          error: (err) => console.error('[CartService] Erro ao atualizar quantidade:', err),
        });
      } else {
        // delta < 0: remove e recria com a quantidade correta
        this.http.delete<void>(`${API_URL}/carrinho/item/${item.carrinhoItemId}`).subscribe({
          next: () => {
            if (novaQuantidade > 0) {
              this.http.post<CarrinhoAPI>(`${API_URL}/carrinho/item`, {
                produtoId,
                quantidade: novaQuantidade,
              }).subscribe({
                next: (carrinhoAtualizado) => {
                  if (carrinhoAtualizado?.itens) {
                    this.atualizarEstadoDoCarrinho(carrinhoAtualizado);
                  }
                },
                error: (err) => console.error('[CartService] Erro ao recriar item:', err),
              });
            }
          },
          error: (err) => console.error('[CartService] Erro ao remover para atualizar quantidade:', err),
        });
      }
    }
  }

  limparCarrinho() {
    this.itensNoCarrinho.next([]);
    this.carrinhoId = null;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
}
