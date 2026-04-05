import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ServicesDataService, ServiceItem } from '../../core/services/services/services-data.service';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-service-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private servicesDataService = inject(ServicesDataService);
  translateService = inject(TranslateService);

  service = signal<ServiceItem | undefined>(undefined);

  // Check if current language is Arabic
  isArabic(): boolean {
    const currentLang = this.translateService.currentLang || this.translateService.defaultLang;
    return currentLang === 'ar';
  }

  // Get text direction based on current language
  getTextDirection(): string {
    return this.isArabic() ? 'rtl' : 'ltr';
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      window.scrollTo(0, 0);
      const serviceIdParam = params.get('id');

      if (serviceIdParam) {
        const serviceId = +serviceIdParam;

        if (!isNaN(serviceId)) {
          const foundService = this.servicesDataService.getServiceById(serviceId);

          if (foundService) {
            this.service.set(foundService); 
          } else {
            console.error(`Service with ID ${serviceId} not found.`);
          }
        } else {
          console.error(`Invalid service ID parameter: ${serviceIdParam}`);
        }
      } else {
        console.error('Service ID parameter not found in route.');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/services']);
  }

  scrollToContent(event: MouseEvent): void {
    event.preventDefault();
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
      contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}