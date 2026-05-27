import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ItemPedidoRequest {
  produtoId: number;
  quantidade: number;
}

export interface EnderecoEntrega {
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface ItemPedido {
  id: number;
  quantidade: number;
  produto: {
    id: number;
    nome: string;
    preco: number;
    imagemUrl: string;
  };
}

export interface Pedido {
  id: number;
  status: 'AGUARDANDO' | 'CONFIRMADO' | 'ENTREGUE' | 'CANCELADO';
  total: number;
  itens: ItemPedido[];
  usuario?: { id: number; nome: string; email: string };
  enderecoEntrega?: EnderecoEntrega;
  createdAt?: string;
}

export interface PagamentoResponse {
  status: 'APROVADO' | 'RECUSADO';
  mensagem?: string;
}

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class PedidoService {
  constructor(private http: HttpClient) {}

  
  listar(page = 0, size = 50): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${API_URL}/pedidos`, { params });
  }

  buscarPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${API_URL}/pedidos/${id}`);
  }

 
  criar(itens: ItemPedidoRequest[], enderecoEntrega: EnderecoEntrega): Observable<Pedido> {
    return this.http.post<Pedido>(`${API_URL}/pedidos`, { itens, enderecoEntrega });
  }

  
  processarPagamento(
    pedidoId: number,
    valor: number,
    metodoPagamento: 'PIX' | 'CARTAO'
  ): Observable<PagamentoResponse> {
    return this.http.post<PagamentoResponse>(
      `${API_URL}/pedidos/${pedidoId}/pagamento`,
      { pedidoId, valor, metodoPagamento }
    );
  }

  
  atualizarStatus(id: number, status: string): Observable<Pedido> {
    return this.http.put<Pedido>(`${API_URL}/pedidos/${id}`, { status });
  }
}
