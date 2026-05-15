import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProdutoService, Produto } from '../../core/services/produto.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private produtoService: ProdutoService
  ) {}

  menuAtivo: string = 'relatorio';
  subAbaRelatorio: string = 'estoque';
  modoEdicao: boolean = false;
  produtos: Produto[] = [];

  categorias = ['Motor', 'Freio', 'Iluminação', 'Suspensão'];

  produtoForm: any = {
    nome: '', fabricante: '', preco: '', codigo: '', estoque: '', descricao: '', categoria: '', imagemUrl: ''
  };

  ngOnInit() {
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtoService.getProdutos().subscribe({
      next: (lista) => this.produtos = lista,
      error: () => alert('Erro ao carregar produtos.')
    });
  }

  editarProduto(produto: any) {
    this.modoEdicao = true;
    this.produtoForm = {
      id: produto.id,
      nome: produto.nome,
      fabricante: produto.marca ?? '',
      preco: produto.preco,
      codigo: '',
      estoque: produto.estoque,
      descricao: produto.descricao,
      categoria: produto.categoria ?? '',
      imagemUrl: produto.imagemUrl ?? ''
    };
    this.menuAtivo = 'criar';
  }

  limparFormulario() {
    this.modoEdicao = false;
    this.produtoForm = { nome: '', fabricante: '', preco: '', codigo: '', estoque: '', descricao: '', categoria: '', imagemUrl: '' };
  }

  cancelarEdicao() {
    this.limparFormulario();
    this.menuAtivo = 'relatorio';
  }

  salvarProduto() {
    const payload: Produto = {
      nome: this.produtoForm.nome,
      marca: this.produtoForm.fabricante,
      preco: parseFloat(this.produtoForm.preco),
      estoque: parseInt(this.produtoForm.estoque, 10),
      descricao: this.produtoForm.descricao,
      categoria: this.produtoForm.categoria,
      modelo: '',
      imagemUrl: this.produtoForm.imagemUrl
    };

    if (this.modoEdicao && this.produtoForm.id) {
      this.produtoService.atualizarProduto(this.produtoForm.id, payload).subscribe({
        next: () => {
          alert('Alterações salvas com sucesso.');
          this.limparFormulario();
          this.menuAtivo = 'relatorio';
          this.carregarProdutos();
        },
        error: () => alert('Erro ao salvar alterações.')
      });
    } else {
      this.produtoService.criarProduto(payload).subscribe({
        next: () => {
          alert('Novo produto cadastrado.');
          this.limparFormulario();
          this.menuAtivo = 'relatorio';
          this.carregarProdutos();
        },
        error: () => alert('Erro ao cadastrar produto.')
      });
    }
  }

  excluirProduto(id: number) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    this.produtoService.excluirProduto(id).subscribe({
      next: () => this.carregarProdutos(),
      error: () => alert('Erro ao excluir produto.')
    });
  }

  sairDoAdmin() {
    this.authService.logout();
  }
}
