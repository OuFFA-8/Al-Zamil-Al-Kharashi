import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AlertComponent } from '../../shared/components/alert/alert/alert.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    HeaderComponent,
    AlertComponent,
  ],
  template: `
    <div class="dash-layout">
      <app-dashboard-sidebar
        [collapsed]="sidebarCollapsed"
        (toggleCollapse)="sidebarCollapsed = !sidebarCollapsed"
      />
      <div class="dash-main">
        <app-dashboard-header [breadcrumb]="breadcrumb" />
        <main class="dash-content">
          <app-alert></app-alert>
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      .dash-layout {
        display: flex;
        min-height: 100vh;
        background: #f5f6fa;
      }
      .dash-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .dash-content {
        flex: 1;
        padding: 28px;
        overflow-y: auto;
      }
    `,
  ],
})
export class DashboardLayoutComponent {
  sidebarCollapsed = false;
  breadcrumb = '';
}
