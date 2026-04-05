import { Component, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  translateService = inject(TranslateService);

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
