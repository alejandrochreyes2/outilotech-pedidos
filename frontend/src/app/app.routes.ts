import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApiDataComponent } from './components/api-data/api-data.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: 'login',      component: LoginComponent },
  { path: 'dashboard',  component: DashboardComponent, canActivate: [authGuard] },
  { path: 'pedidos',    component: PedidosComponent,   canActivate: [authGuard] },
  { path: 'pagos',      component: PagosComponent,     canActivate: [authGuard, adminGuard] },
  { path: 'api-data',   component: ApiDataComponent,   canActivate: [authGuard] },
  { path: 'usuarios',   component: DashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: '',           redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**',         redirectTo: '/dashboard' }
];
