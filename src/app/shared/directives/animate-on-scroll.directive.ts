// src/app/shared/directives/animate-on-scroll.directive.ts
import { Directive, ElementRef, HostBinding, Input, AfterViewInit, OnDestroy, Renderer2, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appAnimateOnScroll]', // هذا هو الـ attribute الذي ستستخدمه
  standalone: true,
})
export class AnimateOnScrollDirective implements AfterViewInit, OnDestroy {
  @Input() animationClass = 'animate-fade-in-up'; // كلاس الأنيميشن الافتراضي (سنعرفه لاحقًا)
  @Input() once = true; // هل يعمل الأنيميشن مرة واحدة فقط؟
  @Input() rootMargin = '0px 0px -100px 0px'; // متى يعتبر العنصر "مرئيًا" (100 بكسل من الأسفل)
  @Input() threshold = 0.1; // نسبة ظهور العنصر لتشغيل الأنيميشن (10%)

  private observer: IntersectionObserver | undefined;

  // نستخدم HostBinding لإضافة الكلاسات الأولية للعنصر
  @HostBinding('class.opacity-0') initialOpacity = true; // ابدأ شفافًا
  // يمكنك إضافة كلاسات أخرى هنا للحالة الأولية، مثل transform: translateY(50px)
  // ولكن من الأفضل التحكم بها عبر كلاسات Tailwind في القالب مع كلاس الأنيميشن

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initObserver();
    }
  }

  private initObserver(): void {
    const options = {
      root: null, // يراقب بالنسبة للـ viewport
      rootMargin: this.rootMargin,
      threshold: this.threshold,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // العنصر دخل الـ viewport
          this.renderer.addClass(this.el.nativeElement, this.animationClass);
          this.initialOpacity = false; // إزالة الشفافية الأولية للسماح للأنيميشن بالتحكم

          // إذا كان يجب أن يعمل مرة واحدة فقط، توقف عن المراقبة
          if (this.once && this.observer) {
            this.observer.unobserve(this.el.nativeElement);
            this.observer.disconnect();
          }
        } else if (!this.once && !entry.isIntersecting) {
          // (اختياري) إذا لم يكن يعمل مرة واحدة، أعد العنصر للحالة الأولية عند الخروج
          // this.renderer.removeClass(this.el.nativeElement, this.animationClass);
          // this.initialOpacity = true;
        }
      });
    }, options);

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}