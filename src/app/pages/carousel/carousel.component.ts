import { Component, CUSTOM_ELEMENTS_SCHEMA, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { dir } from 'console';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [TranslatePipe]
})
export class CarouselComponent {
  swiperEl: HTMLElement | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.swiperEl = document.querySelector('swiper-container');

      if (this.swiperEl) {
        const params = {
          dir: 'rtl',
          injectStyles: [`
            .swiper-pagination {
              position: absolute;
              bottom: 10px !important;
              right: 10px !important;
              left: auto !important;
              top: auto !important;
              transform: none !important;
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 5px;
              width: auto;
            }
          
            .swiper-pagination-bullet {
              width: 25px;
              height: 25px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: #000;
              opacity: 1;
              background: rgba(0, 0, 0, 0.2);
              border-radius: 50%;
              transition: background 0.3s, color 0.3s;
            }
          
            .swiper-pagination-bullet-active {
              color: #061933;
              background: #d6d6d6;
            }
          `]
          
          
          ,
          pagination: {
            clickable: true,
            renderBullet: (index: number, className: string): string => {
              return '<span class="' + className + '">' + (index + 1) + "</span>";
            },
          },
          autoplay: {
            delay: 3000, 
            disableOnInteraction: false, 
          },
          loop: true,
          
        };
        Object.assign(this.swiperEl, params);
        (this.swiperEl as any).initialize();
      }
    }
  }
}
