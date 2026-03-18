import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApiDataComponent } from './components/api-data/api-data.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';
import { PagosComponent } from './components/pagos/pagos.component';
import { AcercaComponent } from './components/acerca/acerca.component';
import { ConcesionariosComponent } from './components/concesionarios/concesionarios.component';
import { PlanesComponent } from './components/planes/planes.component';
import { PromocionesComponent } from './components/promociones/promociones.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { SimuladorComponent } from './components/simulador/simulador.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '',        redirectTo: '/home',      pathMatch: 'full' },
  { path: 'home',   component: HomeComponent },
  { path: 'login',  component: LoginComponent },
  { path: 'acerca', component: AcercaComponent },
  { path: 'concesionarios', component: ConcesionariosComponent },
  { path: 'planes', component: PlanesComponent },
  { path: 'promociones', component: PromocionesComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'simulador', component: SimuladorComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'pedidos',   component: PedidosComponent,   canActivate: [authGuard] },
  { path: 'pagos',     component: PagosComponent,     canActivate: [authGuard, adminGuard] },
  { path: 'api-data',  component: ApiDataComponent,   canActivate: [authGuard] },
  { path: 'usuarios',  component: DashboardComponent, canActivate: [authGuard, adminGuard] },
  { path: '**',        redirectTo: '/home' }
];
