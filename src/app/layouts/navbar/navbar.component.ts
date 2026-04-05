import { Component, HostListener, inject, signal, computed, DestroyRef, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // CommonModule مهم للـ @if
import { TranslatePipe, TranslateService } from '@ngx-translate/core'; // TranslatePipe مهم لـ {{ 'key' | translate }}
import { MyTranslateService } from '../../core/services/myTranslate/my-translate.service';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// تأكد من تهيئة Flowbite إذا كنت تعتمد على الـ JS الخاص به للـ dropdowns/collapse
// import 'flowbite';

@Component({
  selector: 'app-navbar',
  imports: [
    CommonModule, // ضروري لـ @if
    TranslatePipe, // ضروري لـ  `translate` pipe
    RouterLink,
    RouterLinkActive

  ],
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit {

  @ViewChild('mobileMenuButton') mobileMenuButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('mobileMenu') mobileMenu!: ElementRef<HTMLDivElement>;

  private readonly myTranslateService = inject(MyTranslateService);
  readonly translateService = inject(TranslateService); // public للوصول من الـ template
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly platformId = inject(PLATFORM_ID);

  // دالة لتغيير اللغة الفعلية
  change(lang: string): void {
    this.myTranslateService.changeLangTranslate(lang);
  }

  // دالة لمعرفة اللغة الحالية (قد لا تكون ضرورية إذا كنت تستخدم translateService.currentLang مباشرة في الـ @if)
  currentLang(lang: string): boolean {
    return this.translateService.currentLang === lang;
  }

  // Check if current language is Arabic
  isArabic(): boolean {
    const currentLang = this.translateService.currentLang || this.translateService.defaultLang;
    return currentLang === 'ar';
  }

  // دالة لتبديل اللغة مباشرة
  toggleLanguage(): void {
    const current = this.translateService.currentLang;
    const targetLang = current === 'ar' ? 'en' : 'ar';
    this.change(targetLang);
    
    // Reload the page to refresh database content with new language
    // Preserve the current route to avoid 404 errors
    const currentUrl = this.router.url;
    setTimeout(() => {
      window.location.href = currentUrl;
    }, 100);
  }

  readonly isScrolled = signal(false);
  readonly isHomePage = signal(this.checkIsHome(this.router.url));
  readonly showBackground = computed(() => !this.isHomePage() || this.isScrolled());

  constructor() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map(event => this.checkIsHome(event.urlAfterRedirects)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(isHome => {
      this.isHomePage.set(isHome);
    });

    if (isPlatformBrowser(this.platformId)) {
        this.handleScroll();
    }
  }

  ngAfterViewInit(): void {
    if (!this.mobileMenuButton || !this.mobileMenu) {
      console.warn('NavbarComponent: Mobile menu button or menu element not found via ViewChild. Ensure #mobileMenuButton and #mobileMenu are correctly set in the template.');
    }
    // إذا كنت تحتاج لتهيئة Flowbite هنا:
    // if (isPlatformBrowser(this.platformId) && typeof initFlowbite !== 'undefined') {
    //   initFlowbite();
    // }
  }

  private checkIsHome(url: string): boolean {
    return url === '/' || url === '/home' || url === '/services' || url === '/ourteam' || url === '/events' || url === '/branches'|| url === '/service/1' || url === '/service/2' || url === '/service/3'|| url === '/service/4'|| url === '/service/5'|| url === '/service/6'|| url === '/service/7' || url === '/service/8' || url === '/service/9' ;
  }

  @HostListener('window:scroll')
  onScroll(): void {
     if (isPlatformBrowser(this.platformId)) {
       this.handleScroll();
     }
  }

  private handleScroll(): void {
     if (isPlatformBrowser(this.platformId)) {
        const scrolled = window.scrollY > 200;
        if (this.isScrolled() !== scrolled) {
          this.isScrolled.set(scrolled);
        }
     }
  }

  closeMobileMenuOnClick(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.mobileMenuButton && this.mobileMenuButton.nativeElement &&
          this.mobileMenu && this.mobileMenu.nativeElement) {
        const isMenuExpanded = this.mobileMenuButton.nativeElement.getAttribute('aria-expanded') === 'true';
        const isMenuVisible = !this.mobileMenu.nativeElement.classList.contains('hidden');

        if (isMenuExpanded && isMenuVisible) {
          this.mobileMenuButton.nativeElement.click();
        }
      } else {
        console.warn('NavbarComponent: mobileMenuButton or mobileMenu not available to closeMobileMenuOnClick.');
      }
    }
  }
}