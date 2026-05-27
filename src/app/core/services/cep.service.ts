import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EnderecoViaCep {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

const API_URL = 'http://localhost:8080';

@Injectable({ providedIn: 'root' })
export class CepService {
  constructor(private http: HttpClient) {}

  buscarCep(cep: string): Observable<EnderecoViaCep> {
    const cepLimpo = cep.replace(/\D/g, '');
    return this.http.get<EnderecoViaCep>(`${API_URL}/cep/${cepLimpo}`);
  }

  
  calcularFretePorUF(uf: string): number {
    const sudeste = ['SP', 'RJ', 'MG', 'ES'];
    const sul = ['PR', 'SC', 'RS'];
    const norte = ['AM', 'PA', 'AC', 'RO', 'RR', 'AP', 'TO'];
    if (sudeste.includes(uf)) return 25.0;
    if (sul.includes(uf))     return 35.0;
    if (norte.includes(uf))   return 75.0;
    return 55.0; 
  }
}
