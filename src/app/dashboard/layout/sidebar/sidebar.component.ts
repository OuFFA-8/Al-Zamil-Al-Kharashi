import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterModule, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() collapsed = false;
  @Output() toggleCollapse = new EventEmitter<void>();

  private auth = inject(AuthService);

  // ← Settings اتشالت
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'grid', route: '/admin/dashboard' },
    { label: 'Team Management', icon: 'users', route: '/admin/team' },
    { label: 'Events', icon: 'calendar', route: '/admin/events' },
    { label: 'Contact Messages', icon: 'mail', route: '/admin/messages' },
  ];

  logout() {
    this.auth.logout();
  }
}
