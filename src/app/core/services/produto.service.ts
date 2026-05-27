import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  marca: string;
  modelo: string;
  imagemUrl: string;
}

export interface ProdutosPaginados {
  content: Produto[];
  totalPages: number;
  totalElements: number;
  number: number;   
  size: number;
}

export interface FiltrosProduto {
  page?: number;
  size?: number;
  nome?: string;
  categoria?: string;
  marca?: string;
  modelo?: string;
}

const API_URL = 'http://localhost:8080/produtos';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  constructor(private http: HttpClient) {}

  
  getProdutos(filtros?: FiltrosProduto): Observable<ProdutosPaginados | Produto[]> {
    if (!filtros) {
      return this.http.get<ProdutosPaginados | Produto[]>(API_URL);
    }

    let params = new HttpParams();
    Object.entries(filtros).forEach(([chave, valor]) => {
      if (valor !== null && valor !== undefined && valor !== '') {
        params = params.set(chave, valor.toString());
      }
    });

    return this.http.get<ProdutosPaginados | Produto[]>(API_URL, { params });
  }

  getProdutoById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${API_URL}/${id}`);
  }

  getCategorias(): Observable<string[]> {
    return this.http.get<string[]>(`${API_URL}/categorias`);
  }

  /** Retorna as marcas disponíveis (endpoint /produtos/marcas). */
  getMarcas(): Observable<string[]> {
    return this.http.get<string[]>(`${API_URL}/marcas`);
  }

  criarProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(API_URL, produto);
  }

  atualizarProduto(id: number, produto: Produto): Observable<Produto> {
    return this.http.put<Produto>(`${API_URL}/${id}`, produto);
  }

  excluirProduto(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/${id}`);
  }
}
