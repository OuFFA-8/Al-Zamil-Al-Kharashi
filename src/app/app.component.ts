import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterOutlet,
  NavigationStart,
  NavigationCancel,
  NavigationError,
  Event as RouterEvent,
} from '@angular/router';
import { filter, tap } from 'rxjs/operators';
import { initFlowbite } from 'flowbite';
import { FlowbiteService } from './core/services/flowbite/flowbite.service';
import { NavbarComponent } from './layouts/navbar/navbar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { DOCUMENT, CommonModule, isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { AnalyticsComponent } from './shared/components/analytics/analytics.component';
import { LoadingService } from './core/services/loading/loading.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    AnalyticsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'elzamel';
  private localStorageKey = 'preferred_lang';

  isLoading$: Observable<boolean>;
  isAdminRoute = false;

  constructor(
    private flowbiteService: FlowbiteService,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private loadingService: LoadingService,
  ) {
    this.isLoading$ = this.loadingService.loading$;

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isAdminRoute = e.urlAfterRedirects.startsWith('/admin');

        if (isPlatformBrowser(this.platformId)) {
          this.http.post('https://api.zk-legal.com/', {}).subscribe();
        }
      });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem(this.localStorageKey);
      const currentLang = savedLang || 'ar';

      if (currentLang === 'ar') {
        this.document.documentElement.lang = 'ar';
        this.document.documentElement.dir = 'rtl';
      } else {
        this.document.documentElement.lang = currentLang;
        this.document.documentElement.dir = 'ltr';
      }

      this.flowbiteService.loadFlowbite((flowbite) => {
        initFlowbite();
      });

      window.addEventListener('load', () => {
        setTimeout(() => this.loadingService.hide(), 1000);
      });

      this.router.events
        .pipe(
          filter(
            (
              event: RouterEvent,
            ): event is
              | NavigationStart
              | NavigationEnd
              | NavigationCancel
              | NavigationError =>
              event instanceof NavigationStart ||
              event instanceof NavigationEnd ||
              event instanceof NavigationCancel ||
              event instanceof NavigationError,
          ),
        )
        .subscribe((event: RouterEvent) => {
          if (event instanceof NavigationStart) {
            this.loadingService.show();
            return;
          }
          if (event instanceof NavigationEnd) {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
            setTimeout(() => this.loadingService.hide(), 1000);
          } else if (
            event instanceof NavigationCancel ||
            event instanceof NavigationError
          ) {
            setTimeout(() => this.loadingService.hide(), 1000);
          }
        });

      setTimeout(() => {
        if (!(this.router.navigated && this.router.url === '/')) {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      }, 0);
    }
  }
}
