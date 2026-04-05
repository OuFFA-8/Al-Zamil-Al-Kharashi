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

  teamMembers: Section[] = [];
  loading = true;
  currentLang = 'ar';

  selectedMember = signal<Section | null>(null);
  isModalOpen = signal(false);

  ngOnInit(): void {
    // تحديد اللغة الأولية
    this.currentLang =
      this.translateService.currentLang ??
      this.translateService.defaultLang ??
      'ar';

    // الاستماع لتغيير اللغة — ده هو الحل الصح
    this.sub.add(
      this.translateService.onLangChange.subscribe((e: LangChangeEvent) => {
        this.currentLang = e.lang;
      }),
    );

    this.sub.add(
      this.teamDataService.getTeamMembersObservable().subscribe((members) => {
        this.teamMembers = members;
        this.loading = false;
      }),
    );
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
    (event.target as HTMLImageElement).src = '/images/1.jpg';
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
