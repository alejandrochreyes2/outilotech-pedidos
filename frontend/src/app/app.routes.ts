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
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';
import { CarritoComponent } from './components/carrito/carrito.component';

export const routes: Routes = [
  { path: '',        component: HomeComponent,  pathMatch: 'full' },
  { path: 'productos/:slug', component: ProductoDetalleComponent },
  { path: 'carrito', component: CarritoComponent },
  { path: 'home',   redirectTo: '/',           pathMatch: 'full' },
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
  { path: 'mac',        redirectTo: '/',    pathMatch: 'full' },
  { path: 'iphone',     redirectTo: '/',    pathMatch: 'full' },
  { path: 'ipad',       redirectTo: '/',    pathMatch: 'full' },
  { path: 'watch',      redirectTo: '/',    pathMatch: 'full' },
  { path: 'airpods',    redirectTo: '/',    pathMatch: 'full' },
  { path: 'tv',         redirectTo: '/',    pathMatch: 'full' },
  { path: 'ofertas',    redirectTo: '/',    pathMatch: 'full' },
  { path: 'apple',      redirectTo: '/',    pathMatch: 'full' },
  { path: 'samsung',    redirectTo: '/',    pathMatch: 'full' },
  { path: 'motorola',   redirectTo: '/',    pathMatch: 'full' },

  { path: 'jhon-ia', loadComponent: () => import('./components/jhon-dashboard/jhon-dashboard.component').then(m => m.JhonDashboardComponent), canActivate: [authGuard] },
  { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'payment-result', loadComponent: () => import('./components/payment-result/payment-result.component').then(m => m.PaymentResultComponent) },
  { path: 'nosotros', loadComponent: () => import('./components/nosotros/nosotros.component').then(m => m.NosotrosComponent) },
  { path: 'mision-vision', loadComponent: () => import('./components/mision-vision/mision-vision.component').then(m => m.MisionVisionComponent) },
  { path: 'servicios',  loadComponent: () => import('./components/servicios/servicios.component').then(m => m.ServiciosComponent) },
  { path: 'seguridad-forense', loadComponent: () => import('./components/seguridad-forense/seguridad-forense.component').then(m => m.SeguridadForenseComponent) },
  { path: 'iso27001', loadComponent: () => import('./components/iso27001/iso27001.component').then(m => m.Iso27001Component) },
  { path: 'certificados', loadComponent: () => import('./components/certificados/certificados.component').then(m => m.CertificadosComponent) },
  { path: 'software-medida', loadComponent: () => import('./components/software-medida/software-medida.component').then(m => m.SoftwareMedidaComponent) },
  { path: 'portafolio-dev', loadComponent: () => import('./components/portafolio/portafolio.component').then(m => m.PortafolioComponent) },
  { path: 'portafolio-gerente', redirectTo: '/portafolio', pathMatch: 'full' },
  { path: 'portafolio', loadComponent: () => import('./components/portafolio-gerente/portafolio-gerente.component').then(m => m.PortafolioGerenteComponent) },
  { path: '**',        redirectTo: '/' }
];
