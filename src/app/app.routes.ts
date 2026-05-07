import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProdutosComponent } from './pages/produtos/produtos.component';
import { DetalheProdutoComponent } from './pages/detalhe-produto/detalhe-produto.component';
import { CarrinhoComponent } from './pages/carrinho/carrinho.component';
import { PagamentoComponent } from './pages/pagamento/pagamento.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'produtos', component: ProdutosComponent },
  { path: 'produto/:id', component: DetalheProdutoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'carrinho', component: CarrinhoComponent }, 
  { path: 'pagamento', component: PagamentoComponent },
  { path: '**', redirectTo: '' } 
];