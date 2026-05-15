import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

const API_URL = 'http://localhost:8080/produtos';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  constructor(private http: HttpClient) {}

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(API_URL);
  }

  getProdutoById(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${API_URL}/${id}`);
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
