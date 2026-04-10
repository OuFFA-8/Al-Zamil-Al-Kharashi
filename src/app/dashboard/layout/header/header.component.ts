import { Component, Input, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MyTranslateService } from '../../../core/services/myTranslate/my-translate.service';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() breadcrumb = '';

  private auth = inject(AuthService);
  private translateService = inject(MyTranslateService);

  currentLang = localStorage.getItem('lang') || 'ar';
  dropdownOpen = false;

  get currentUser() {
    return this.auth.currentUser ?? { name: 'Admin', role: 'admin' };
  }

  get userInitials(): string {
    const name: string = (this.currentUser as any).name || 'AU';
    return name
      .split(' ')
      .map((w: string) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  switchLang(lang: string) {
    this.currentLang = lang;
    this.translateService.changeLangTranslate(lang);
  }

  logout() {
    this.auth.logout();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-wrap')) {
      this.dropdownOpen = false;
    }
  }
}
