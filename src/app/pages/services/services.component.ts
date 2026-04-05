import { Component, Input, Signal, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ServiceItem,
  ServicesDataService,
} from '../../core/services/services/services-data.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css',
})
export class ServicesComponent {
  translateService = inject(TranslateService);
  public services: Signal<ServiceItem[]>;

  @Input() sectionSubtitle: string = 'services.main.span';
  @Input() sectionTitle: string = 'services.main.title';
  @Input() sectionDescription: string = 'services.main.paragraph';

  constructor(private servicesDataService: ServicesDataService) {
    this.services = this.servicesDataService.services;
  }

  // Check if current language is Arabic
  isArabic(): boolean {
    const currentLang =
      this.translateService.currentLang || this.translateService.defaultLang;
    return currentLang === 'ar';
  }

  // Get text direction based on current language
  getTextDirection(): string {
    return this.isArabic() ? 'rtl' : 'ltr';
  }

  scrollToContent(event: MouseEvent): void {
    event.preventDefault();
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
