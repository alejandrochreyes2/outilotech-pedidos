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
  { path: '',        redirectTo: '/home',      pathMatch: 'full' },
  { path: 'productos/:slug', component: ProductoDetalleComponent },
  { path: 'carrito', component: CarritoComponent },
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
  { path: 'mac',        redirectTo: 'home', pathMatch: 'full' },
  { path: 'iphone',     redirectTo: 'home', pathMatch: 'full' },
  { path: 'ipad',       redirectTo: 'home', pathMatch: 'full' },
  { path: 'watch',      redirectTo: 'home', pathMatch: 'full' },
  { path: 'airpods',    redirectTo: 'home', pathMatch: 'full' },
  { path: 'tv',         redirectTo: 'home', pathMatch: 'full' },
  { path: 'ofertas',    redirectTo: 'home', pathMatch: 'full' },
  { path: 'apple',      redirectTo: 'home', pathMatch: 'full' },
  { path: 'samsung',    redirectTo: 'home', pathMatch: 'full' },
  { path: 'motorola',   redirectTo: 'home', pathMatch: 'full' },

  { path: 'checkout', loadComponent: () => import('./components/checkout/checkout.component').then(m => m.CheckoutComponent) },
  { path: 'nosotros', loadComponent: () => import('./components/nosotros/nosotros.component').then(m => m.NosotrosComponent) },
  { path: 'mision-vision', loadComponent: () => import('./components/mision-vision/mision-vision.component').then(m => m.MisionVisionComponent) },
  { path: 'servicios',  loadComponent: () => import('./components/servicios/servicios.component').then(m => m.ServiciosComponent) },
  { path: 'seguridad-forense', loadComponent: () => import('./components/seguridad-forense/seguridad-forense.component').then(m => m.SeguridadForenseComponent) },
  { path: 'iso27001', loadComponent: () => import('./components/iso27001/iso27001.component').then(m => m.Iso27001Component) },
  { path: 'certificados', loadComponent: () => import('./components/certificados/certificados.component').then(m => m.CertificadosComponent) },
  { path: 'software-medida', loadComponent: () => import('./components/software-medida/software-medida.component').then(m => m.SoftwareMedidaComponent) },
  { path: '**',        redirectTo: '/home' }
];
