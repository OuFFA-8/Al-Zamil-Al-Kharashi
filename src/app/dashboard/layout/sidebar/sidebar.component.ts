import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  labelKey: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive, TranslatePipe],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  private auth = inject(AuthService);

  navItems: NavItem[] = [
    {
      labelKey: 'dashboard.nav.dashboard',
      icon: 'grid',
      route: '/admin/dashboard',
    },
    { labelKey: 'dashboard.nav.team', icon: 'users', route: '/admin/team' },
    {
      labelKey: 'dashboard.nav.events',
      icon: 'calendar',
      route: '/admin/events',
    },
    {
      labelKey: 'dashboard.nav.messages',
      icon: 'mail',
      route: '/admin/messages',
    },
  ];

  logout() {
    this.auth.logout();
  }
}
