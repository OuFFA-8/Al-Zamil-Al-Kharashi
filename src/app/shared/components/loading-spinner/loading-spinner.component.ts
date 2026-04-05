// loading-spinner.component.ts
import { Component, ViewEncapsulation } from '@angular/core'; // استورد ViewEncapsulation
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-[9999]"
    >
      <!-- الحاوية الجديدة للحركة -->
      <div class="relative w-32 h-32 flex items-center justify-center">
        <!-- الهالة الضوئية التي ستدور (عنصر وهمي) -->
        <div class="glow-orb animate-orbit-glow"></div>
        
        <!-- شعار الشركة في الأعلى -->
        <img
          src="/images/-٢- شعار الزامل.webp"
          alt="شعار الشركة"
          class="relative w-24 h-24 z-10" 
        />
      </div>
    </div>
  `,
  // سنضيف الـ CSS الخاص بالهالة هنا
  styles: [`
    .glow-orb {
      position: absolute;
      width: 100%;
      height: 100%;
      background: conic-gradient(
        from 180deg at 50% 50%,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0) 50%,
        #ffffff 90%, /* لون الهالة - يمكن تغييره للون علامتك التجارية */
        rgba(255, 255, 255, 0) 100%
      );
      border-radius: 50%;
      z-index: 5;
    }
  `],
  encapsulation: ViewEncapsulation.None // مهم لكي يعمل الـ CSS بشكل صحيح مع Tailwind
})
export class LoadingSpinnerComponent {}