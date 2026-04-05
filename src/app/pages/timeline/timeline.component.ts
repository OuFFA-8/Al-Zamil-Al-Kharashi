import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

interface Section {
  id: number;
  navTitle: string;
  navNumber: string;
  contentTitle: string;
  contentText1: string;
  contentText2?: string;
  contentText3?: string;
  contentText4?: string;
  contentText5?: string;
  imageUrl: string;
}

@Component({
  selector: 'app-timeline',
  imports: [TranslatePipe],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})
export class TimelineComponent implements OnInit {
  translateService = inject(TranslateService);

  sections: Section[] = [
    { id: 1, navTitle: 'timeline.1.title', contentTitle: 'timeline.1.mainTitle', navNumber: '2013', contentText1: 'timeline.1.paragraph', imageUrl: '/images/timeline4.webp', contentText2: 'timeline.1.paragraph2', contentText3: 'timeline.1.paragraph3', contentText4: 'timeline.1.paragraph4' },
    { id: 2, navTitle: 'timeline.2.title', contentTitle: 'timeline.2.mainTitle', navNumber: '2015', contentText1: 'timeline.2.paragraph', imageUrl: '/images/timeline2.webp', },
    { id: 3, navTitle: 'timeline.3.title', contentTitle: 'timeline.3.mainTitle', navNumber: '2200', contentText1: 'timeline.3.paragraph', imageUrl: '/images/timeline1.webp', },
    { id: 4, navTitle: 'timeline.4.title', contentTitle: 'timeline.4.mainTitle', navNumber: '2004', contentText1: 'timeline.4.paragraph', imageUrl: '/images/timeline3.webp',  contentText2: 'timeline.4.paragraph2', contentText3: 'timeline.4.paragraph3', contentText4: 'timeline.4.paragraph4', contentText5: 'timeline.4.paragraph5'}
  ];

  selectedSection: Section | null = null;
  ngOnInit(): void {
    if (this.sections.length > 0) {
      this.selectedSection = this.sections[0];
    }
  }

  selectSection(section: Section): void {
    this.selectedSection = section;
  }

  // Check if current language is Arabic
  isArabic(): boolean {
    const currentLang = this.translateService.currentLang || this.translateService.defaultLang;
    return currentLang === 'ar';
  }

  // Get text direction based on current language
  getTextDirection(): string {
    return this.isArabic() ? 'rtl' : 'ltr';
  }

}