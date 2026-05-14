import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  constructor(private authService: AuthService) {}
  menuAtivo: string = 'relatorio'; 
  subAbaRelatorio: string = 'estoque';

  // Controle de tela
  modoEdicao: boolean = false;

  imagemPreview: string | null = null;

  produtoForm: any = {
    nome: '', fabricante: '', preco: '', codigo: '', estoque: '', descricao: ''
  };

  aoSelecionarImagem(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => this.imagemPreview = e.target?.result as string;
      reader.readAsDataURL(input.files[0]);
    }
  }

  estoqueMock = [
    { id: 1, nome: 'Farol LED Projetor Tuning XENON', categoria: 'Iluminação', fabricante: 'XenonTech', preco: '1250.00', estoque: 45, codigo: 'ILU-001', descricao: 'Farol top de linha.' },
    { id: 2, nome: 'Pastilha de Freio Alta performace', categoria: 'Freio', fabricante: 'Brembo', preco: '450.90', estoque: 23, codigo: 'FRE-002', descricao: 'Pastilha de cerâmica.' }
  ];


  editarProduto(produto: any) {
    this.modoEdicao = true;
    this.produtoForm = { ...produto }; 
    this.menuAtivo = 'criar'; 
  }

  limparFormulario() {
    this.modoEdicao = false;
    this.produtoForm = { nome: '', fabricante: '', preco: '', codigo: '', estoque: '', descricao: '' };
  }

  cancelarEdicao() {
    this.limparFormulario();
    this.menuAtivo = 'relatorio'; 
  }

  salvarProduto() {
    if (this.modoEdicao) {
      alert('Boa! Alterações salvas com sucesso.');
    } else {
      alert('Show! Novo produto cadastrado.');
    }
    this.limparFormulario();
    this.menuAtivo = 'relatorio';
  }

  sairDoAdmin() {
    this.authService.logout();
  }
}