import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ProdutoService, Produto, ProdutosPaginados } from '../../core/services/produto.service';
import { PedidoService, Pedido } from '../../core/services/pedido.service';
import { UsuarioService, Usuario } from '../../core/services/usuario.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private produtoService: ProdutoService,
    private pedidoService: PedidoService,
    private usuarioService: UsuarioService,
  ) {}

  menuAtivo: string = 'relatorio';
  subAbaRelatorio: string = 'estoque';
  modoEdicao: boolean = false;
  produtos: Produto[] = [];

  // Pedidos concluídos
  pedidosConcluidos: Pedido[] = [];
  carregandoPedidos = false;

  // Usuários
  usuarios: Usuario[] = [];
  carregandoUsuarios = false;
  alterandoTipo: Set<number> = new Set();
  idUsuarioLogado: number | null = null;

  nomeAdmin = '';

  categorias = ['Motor', 'Freio', 'Iluminação', 'Suspensão'];

  produtoForm: any = {
    nome: '',
    fabricante: '',
    modelo: '',
    preco: '',
    codigo: '',
    estoque: '',
    descricao: '',
    categoria: '',
    imagemUrl: '',
  };

  ngOnInit() {
    this.nomeAdmin = this.authService.getUserName();
    this.idUsuarioLogado = this.authService.getUserId();
    this.carregarProdutos();
  }

  carregarProdutos() {
    this.produtoService.getProdutos().subscribe({
      next: (resposta) => {
        if (resposta && (resposta as ProdutosPaginados).content) {
          this.produtos = (resposta as ProdutosPaginados).content;
        } else if (Array.isArray(resposta)) {
          this.produtos = resposta as Produto[];
        }
      },
      error: () => alert('Erro ao carregar produtos.'),
    });
  }

  trocarMenu(menu: string) {
    this.menuAtivo = menu;
    if (menu === 'usuarios') {
      this.carregarUsuarios();
    }
  }

  trocarSubAba(aba: string) {
    this.subAbaRelatorio = aba;
    if (aba === 'vendas') {
      this.carregarPedidosConcluidos();
    }
  }

  carregarPedidosConcluidos() {
    this.carregandoPedidos = true;
    this.pedidoService.listar(0, 100).subscribe({
      next: (resposta) => {
        const lista: Pedido[] = resposta?.content ?? (Array.isArray(resposta) ? resposta : []);
        // Mostra pedidos CONFIRMADOS (pagamento aprovado) e ENTREGUES
        this.pedidosConcluidos = lista.filter(
          (p) => p.status === 'CONFIRMADO' || p.status === 'ENTREGUE'
        );
        this.carregandoPedidos = false;
      },
      error: () => {
        this.carregandoPedidos = false;
        console.error('Erro ao carregar pedidos.');
      },
    });
  }

  carregarUsuarios() {
    this.carregandoUsuarios = true;
    this.usuarioService.listar().subscribe({
      next: (resposta: any) => {
        this.usuarios = resposta?.content ?? (Array.isArray(resposta) ? resposta : []);
        this.carregandoUsuarios = false;
      },
      error: () => {
        this.carregandoUsuarios = false;
        alert('Erro ao carregar usuários.');
      },
    });
  }

  alterarTipoUsuario(usuario: Usuario) {
    const novoTipo: 'CLIENTE' | 'ADMIN' = usuario.tipo === 'ADMIN' ? 'CLIENTE' : 'ADMIN';
    const confirmMsg = `Alterar "${usuario.nome}" de ${usuario.tipo} para ${novoTipo}?`;
    if (!confirm(confirmMsg)) return;

    this.alterandoTipo.add(usuario.id);
    this.usuarioService.alterarTipo(usuario.id, novoTipo).subscribe({
      next: (atualizado) => {
        usuario.tipo = atualizado.tipo;
        this.alterandoTipo.delete(usuario.id);
      },
      error: () => {
        this.alterandoTipo.delete(usuario.id);
        alert('Erro ao alterar tipo de usuário.');
      },
    });
  }

  editarProduto(produto: any) {
    this.modoEdicao = true;
    this.produtoForm = {
      id: produto.id,
      nome: produto.nome,
      fabricante: produto.marca ?? '',
      modelo: produto.modelo ?? '',
      preco: produto.preco,
      codigo: '',
      estoque: produto.estoque,
      descricao: produto.descricao,
      categoria: produto.categoria ?? '',
      imagemUrl: produto.imagemUrl ?? '',
    };
    this.menuAtivo = 'criar';
  }

  limparFormulario() {
    this.modoEdicao = false;
    this.produtoForm = {
      nome: '',
      fabricante: '',
      modelo: '',
      preco: '',
      codigo: '',
      estoque: '',
      descricao: '',
      categoria: '',
      imagemUrl: '',
    };
  }

  cancelarEdicao() {
    this.limparFormulario();
    this.menuAtivo = 'relatorio';
  }

  salvarProduto() {
    const payload: Produto = {
      nome: this.produtoForm.nome,
      marca: this.produtoForm.fabricante,
      modelo: this.produtoForm.modelo,
      preco: parseFloat(this.produtoForm.preco),
      estoque: parseInt(this.produtoForm.estoque, 10),
      descricao: this.produtoForm.descricao,
      categoria: this.produtoForm.categoria,
      imagemUrl: this.produtoForm.imagemUrl,
    };

    if (this.modoEdicao && this.produtoForm.id) {
      this.produtoService.atualizarProduto(this.produtoForm.id, payload).subscribe({
        next: () => {
          alert('Alterações salvas com sucesso.');
          this.limparFormulario();
          this.menuAtivo = 'relatorio';
          this.carregarProdutos();
        },
        error: () => alert('Erro ao salvar alterações.'),
      });
    } else {
      this.produtoService.criarProduto(payload).subscribe({
        next: () => {
          alert('Novo produto cadastrado.');
          this.limparFormulario();
          this.menuAtivo = 'relatorio';
          this.carregarProdutos();
        },
        error: () => alert('Erro ao cadastrar produto.'),
      });
    }
  }

  excluirProduto(id: number) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    this.produtoService.excluirProduto(id).subscribe({
      next: () => this.carregarProdutos(),
      error: () => alert('Erro ao excluir produto.'),
    });
  }

  sairDoAdmin() {
    this.authService.logout();
  }
}
