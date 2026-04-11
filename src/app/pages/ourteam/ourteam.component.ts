import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  TranslatePipe,
  TranslateService,
  LangChangeEvent,
} from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {
  Section,
  TeamDataService,
} from '../../core/services/team-data/team-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ourteam',
  standalone: true,
  imports: [CommonModule, TranslatePipe, RouterLink],
  templateUrl: './ourteam.component.html',
  styleUrl: './ourteam.component.css',
})
export class OurteamComponent implements OnInit, OnDestroy {
  private teamDataService = inject(TeamDataService);
  private translateService = inject(TranslateService);
  private sub = new Subscription();
  private firstLoad = true;

  teamMembers: Section[] = [];
  loading = true;
  currentLang = 'ar';

  selectedMember = signal<Section | null>(null);
  isModalOpen = signal(false);

  ngOnInit(): void {
    this.currentLang =
      this.translateService.currentLang ??
      this.translateService.defaultLang ??
      'ar';

    this.sub.add(
      this.translateService.onLangChange.subscribe((e: LangChangeEvent) => {
        this.currentLang = e.lang;
      }),
    );

    this.loading = true;

    // استدعاء البيانات مباشرة وتخطي الـ Subject مؤقتاً لحل المشكلة
    this.sub.add(
      this.teamDataService.getMembers(1, 100).subscribe({
        next: (res) => {
          if (res && res.data) {
            // التعديل هنا: نستخدم دالة map بشكل مباشر وبسيط
            this.teamMembers = res.data.map((m: any) => ({
              ...m,
              // التأكد من تسمية الحقول لتطابق الـ Interface Section
              nameAr: m.name_ar,
              nameEn: m.name_en,
              titleAr: m.title_ar,
              titleEn: m.title_en,
              bioTitleAr: m.bio_title_ar,
              bioTitleEn: m.bio_title_en,
              bioTextAr: m.bio_text_ar,
              bioTextEn: m.bio_text_en,
              imageUrl: this.teamDataService.buildImageUrl(m),
            }));
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('خطأ في التحميل:', err);
          this.loading = false;
        },
      }),
    );
  }
  handleImageError(event: any) {
    // الخيار الأول: تحط مسار صورة افتراضية (لو عندك صورة في الـ assets)
    // event.target.src = 'assets/images/default-avatar.png';

    // الخيار التاني: لو مش عايز تعرض صورة خالص لو هي مش موجودة، امسح السطر اللي فوق وشغل السطر ده:
    event.target.style.display = 'none';
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    document.body.style.overflow = 'auto';
  }

  // ── Modal ──
  openModal(member: Section): void {
    this.selectedMember.set(member);
    this.isModalOpen.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.selectedMember.set(null);
    this.isModalOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  // ── Helpers ──
  scrollToContent(e: MouseEvent): void {
    e.preventDefault();
    document
      .getElementById('content-area')
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.onerror = null; // ✅ امنع الـ infinite loop
    img.style.display = 'none'; // أخبي الصورة المكسورة
    // أظهر الـ fallback avatar اللي جنبها
    const fallback = img.nextElementSibling as HTMLElement;
    if (fallback) fallback.style.display = 'flex';
  }

  get isArabic(): boolean {
    return this.currentLang === 'ar';
  }

  getName(m: Section): string {
    return this.isArabic ? m.nameAr : m.nameEn;
  }
  getTitle(m: Section): string {
    return this.isArabic ? m.titleAr : m.titleEn;
  }
  getBioTitle(m: Section): string {
    return this.isArabic ? m.bioTitleAr : m.bioTitleEn;
  }
  getBioText(m: Section): string {
    return this.isArabic ? m.bioTextAr : m.bioTextEn;
  }
}
