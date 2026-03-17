import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor(public auth: AuthService) {}

  ngOnInit() {
    this.buildMenu();
  }

  buildMenu() {
    const allItems = [
      { label: 'Dashboard',   link: '/dashboard', icon: '📊' },
      { label: 'Pedidos',     link: '/pedidos',   icon: '📦' },
      { label: 'Pagos',       link: '/pagos',     icon: '💳' },
      { label: 'API Pública', link: '/api-data',  icon: '🌐' },
      { label: 'Usuarios',    link: '/usuarios',  icon: '👥' }
    ];
    this.menuItems = this.auth.isAdmin() ? allItems : allItems.slice(0, 3);
  }

  logout() {
    this.auth.logout();
  }
}
