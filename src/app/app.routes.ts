import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { DetalheProdutoComponent } from './pages/detalhe-produto/detalhe-produto.component';
import { LoginComponent } from './pages/login/login.component';
import { CadastroComponent } from './pages/cadastro/cadastro.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { PagamentoComponent } from './pages/pagamento/pagamento.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'produto/:id', component: DetalheProdutoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'carrinho', component: CarrinhoComponent, canActivate: [AuthGuard] },
  { path: 'pagamento', component: PagamentoComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];