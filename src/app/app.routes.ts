import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from './dashboard/guards/auth.guard';
import { DashboardLayoutComponent } from './dashboard/layout/dashboard-layout.component';

export const routes: Routes = [
  // ── PUBLIC ──
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
    title: 'الزامل والخرّاشي',
  },
  {
    path: 'services',
    loadComponent: () =>
      import('./pages/services/services.component').then(
        (m) => m.ServicesComponent,
      ),
    title: 'الزامل والخرّاشي',
  },
  {
    path: 'ourteam',
    loadComponent: () =>
      import('./pages/ourteam/ourteam.component').then(
        (m) => m.OurteamComponent,
      ),
    title: 'الزامل والخرّاشي',
  },
  {
    path: 'events',
    loadComponent: () =>
      import('./pages/events/events.component').then((m) => m.EventsComponent),
    title: 'الزامل والخرّاشي',
  },
  {
    path: 'branches',
    loadComponent: () =>
      import('./pages/branches/branches.component').then(
        (m) => m.BranchesComponent,
      ),
    title: 'الزامل والخرّاشي',
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./pages/contact/contact.component').then(
        (m) => m.ContactComponent,
      ),
    title: 'الزامل والخرّاشي',
  },
  {
    path: 'service/:id',
    loadComponent: () =>
      import('./pages/service-detail/service-detail.component').then(
        (m) => m.ServiceDetailComponent,
      ),
    title: 'الزامل والخرّاشي',
  },

  // team-details اتشالت — المعلومات دلوقتي في popup في صفحة ourteam

  // ── ADMIN ──
  {
    path: 'admin/login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./dashboard/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/pages/overview/overview.component').then(
            (m) => m.DashboardOverviewComponent,
          ),
      },
      {
        path: 'team',
        loadComponent: () =>
          import('./dashboard/pages/team-management/team-management.component').then(
            (m) => m.TeamManagementComponent,
          ),
      },
      {
        path: 'events',
        loadComponent: () =>
          import('./dashboard/pages/events-management/events-management.component').then(
            (m) => m.EventsManagementComponent,
          ),
      },
      {
        path: 'messages',
        loadComponent: () =>
          import('./dashboard/pages/contact-messages/contact-messages.component').then(
            (m) => m.ContactMessagesComponent,
          ),
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },

  // ── 404 ──
  {
    path: '**',
    loadComponent: () =>
      import('./pages/notfound/notfound.component').then(
        (m) => m.NotfoundComponent,
      ),
  },
];
