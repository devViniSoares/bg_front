import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: 'CLIENTE' | 'ADMIN';
}

const API_URL = 'http://localhost:8080/usuarios';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private http: HttpClient) {}

  /** Lista todos os usuários (admin only). */
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(API_URL);
  }

  /** Altera o tipo de um usuário (CLIENTE ↔ ADMIN). */
  alterarTipo(id: number, tipo: 'CLIENTE' | 'ADMIN'): Observable<Usuario> {
    return this.http.patch<Usuario>(`${API_URL}/${id}/tipo`, { tipo });
  }
}
