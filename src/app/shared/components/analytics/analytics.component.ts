import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  template: '',
  styles: []
})
export class AnalyticsComponent {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      // Load Vercel Analytics using the inject method
      this.loadAnalytics();
    }
  }

  private async loadAnalytics(): Promise<void> {
    try {
      // Import and inject Vercel Analytics
      const { inject } = await import('@vercel/analytics');
      inject();
    } catch (error) {
      console.error('Failed to load Vercel Analytics:', error);
    }
  }
}
