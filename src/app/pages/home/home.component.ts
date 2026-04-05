import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  HostListener,
  NgModule,
  Signal,
  signal,
  inject,
} from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { CommonModule } from '@angular/common';
import { TimelineComponent } from '../timeline/timeline.component';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NavbarComponent } from '../../layouts/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { AnimateOnScrollDirective } from '../../shared/directives/animate-on-scroll.directive';
import {
  ServiceItem,
  ServicesDataService,
} from '../../core/services/services/services-data.service';

interface Logo {
  id: number;
  src: string;
  alt: string; // إضافة وصف بديل للوجو لتحسين إمكانية الوصول
}

@Component({
  selector: 'app-home',
  imports: [
    CarouselComponent,
    CommonModule,
    TimelineComponent,
    TranslatePipe,
    RouterLink,
    AnimateOnScrollDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewInit {
  public services: Signal<ServiceItem[]>;
  translateService = inject(TranslateService);

  constructor(private servicesDataService: ServicesDataService) {
    this.services = this.servicesDataService.services;
  }

  // Check if current language is Arabic
  isArabic(): boolean {
    const currentLang =
      this.translateService.currentLang || this.translateService.defaultLang;
    return currentLang === 'ar';
  }

  open1 = false;
  open2 = false;
  open3 = false;
  open4 = false;
  open5 = false;
  open6 = false;
  open7 = false;
  open8 = false;
  open9 = false;

  toggleOpen1() {
    this.open1 = !this.open1;
  }
  toggleOpen2() {
    this.open2 = !this.open2;
  }
  toggleOpen3() {
    this.open3 = !this.open3;
  }
  toggleOpen4() {
    this.open4 = !this.open4;
  }
  toggleOpen5() {
    this.open5 = !this.open5;
  }
  toggleOpen6() {
    this.open6 = !this.open6;
  }
  toggleOpen7() {
    this.open7 = !this.open7;
  }
  toggleOpen8() {
    this.open8 = !this.open8;
  }
  toggleOpen9() {
    this.open9 = !this.open9;
  }

  counter1 = 0;
  counter2 = 0;
  counter3 = 0;
  counter4 = 0;
  private hasAnimated = false;

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      const counterSection = document.querySelector('#counterSection');

      if (!counterSection) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.hasAnimated) {
              this.startCounter();
              this.hasAnimated = true;
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 },
      );

      observer.observe(counterSection);
    }
  }

  startCounter() {
    this.animateValue('counter1', 45, 2000);
    this.animateValue('counter2', 10000, 2000);
    this.animateValue('counter3', 1400, 2000);
    this.animateValue('counter4', 1000, 2000);
  }

  animateValue(
    counterName: 'counter1' | 'counter2' | 'counter3' | 'counter4',
    end: number,
    duration: number,
  ) {
    const steps = 100; // عدد الخطوات
    let currentStep = 0;
    const increment = end / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      currentStep++;
      (this as any)[counterName] = Math.round(increment * currentStep);
      if (currentStep >= steps) {
        (this as any)[counterName] = end; // لضمان أن الرقم النهائي مضبوط 100%
        clearInterval(timer);
      }
    }, stepTime);
  }

  readonly logos = signal<Logo[]>([
    { id: 1, src: '/images/logo-1.webp', alt: 'شعار 1' },
    { id: 2, src: '/images/logo-2.webp', alt: 'شعار 2' },
    { id: 3, src: '/images/logo-3.webp', alt: 'شعار 3' },
    { id: 4, src: '/images/logo-4.webp', alt: 'شعار 4' },
    { id: 5, src: '/images/logo-5.webp', alt: 'شعار 5' },
    { id: 6, src: '/images/logo-6.webp', alt: 'شعار 6' },
  ]);

  readonly duplicatedLogos = computed(() => {
    const currentLogos = this.logos();
    if (!Array.isArray(currentLogos) || currentLogos.length === 0) {
      return [];
    }
    return [...currentLogos, ...currentLogos];
  });

  readonly logoCount = computed(() => this.logos().length);

  readonly animationDuration = computed(
    () => `${(this.logos()?.length || 10) * 6}s`,
  );
}
