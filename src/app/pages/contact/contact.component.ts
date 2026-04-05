import { MessageService } from './../../core/services/message/message.service';
import {
  Component,
  ChangeDetectorRef,
  OnInit,
  Renderer2,
  ElementRef,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  inject,
} from '@angular/core';
import { isPlatformBrowser, CommonModule, DOCUMENT } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  query,
} from '@angular/animations';
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertService } from '../../dashboard/services/alert.service';
import { AlertComponent } from "../../shared/components/alert/alert/alert.component";
interface BranchDetails {
  id: number;
  name: string;
  shortName: string;
  addressLines: string;
  phoneNumbers?: string;
  emails: string[];
  mapEmbedUrl: string;
  socialLinks?: SocialLink[];
  mainHeading?: string;
  subHeading?: string;
  hours?: string;
  MutualNumber: string;
  backgroundImageUrl: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-contact',
  imports: [CommonModule, SafeUrlPipe, TranslatePipe, FormsModule, AlertComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  animations: [
    trigger('detailsSequence', [
      transition(':enter', [
        query(
          '.details-title-anim',
          [style({ opacity: 0, transform: 'translateY(-40px)' })],
          { optional: true },
        ),
        query(
          '.map-container-anim',
          [style({ opacity: 0, transform: 'translateX(50px)' })],
          { optional: true },
        ),
        query(
          '.contact-details-anim',
          [style({ opacity: 0, transform: 'translateX(-50px)' })],
          { optional: true },
        ),
        query(
          '.details-title-anim',
          [
            animate(
              '400ms ease-out',
              style({ opacity: 1, transform: 'translateY(0)' }),
            ),
          ],
          { optional: true },
        ),
        query(
          '.map-container-anim',
          [
            animate(
              '500ms 200ms ease-out',
              style({ opacity: 1, transform: 'translateX(0)' }),
            ),
          ],
          { optional: true },
        ),
        query(
          '.contact-details-anim',
          [
            animate(
              '500ms 400ms ease-out',
              style({ opacity: 1, transform: 'translateX(0)' }),
            ),
          ],
          { optional: true },
        ),
      ]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ContactComponent implements OnInit, OnDestroy {
  isSubmitting = false;
  formMessage: { type: 'success' | 'error'; text: string } | null = null;

  allBranchesData: BranchDetails[] = [
    {
      id: 1,
      name: 'branches.location1',
      shortName: 'branches.location1',
      addressLines: 'branches.addressLine1',
      phoneNumbers: '0114733303',
      MutualNumber: '920009756',
      hours: 'Sat-Thur 8:30am - 5pm',
      emails: ['zk@zk-legal.com'],
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4221.407487119673!2d46.719560481823365!3d24.69267349002198!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e2f038f92ad4285%3A0x2c70c9947f5734ac!2sZamil%20and%20Kharashi%20for%20Law%20Firm!5e0!3m2!1sen!2sus!4v1746333306077!5m2!1sen!2sus',
      socialLinks: [],
      backgroundImageUrl: '/images/الرياض.webp',
    },
    {
      id: 2,
      name: 'branches.location2',
      shortName: 'branches.location2',
      addressLines: 'branches.addressLine2',
      phoneNumbers: '0138147677',
      MutualNumber: '920009756',
      hours: 'Sat-Thur 8:30am - 5pm',
      emails: ['info@zk-legal.com'],
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7151.15395905835!2d50.199194!3d26.340194!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e49e8b72d39626b%3A0xfac87c3508eeb3f6!2sNSH%20Tower%2C%206389%20King%20Fahd%20Road%2C%20Al%20Rakah%20Al%20Janubiyah%2C%20Al%20Khobar%2034227%2C%20Saudi%20Arabia!5e0!3m2!1sen!2sus!4v1746333187166!5m2!1sen!2sus',
      socialLinks: [],
      backgroundImageUrl: '/images/الخبر.webp',
    },
    {
      id: 3,
      name: 'branches.location3',
      shortName: 'branches.location3',
      addressLines: 'branches.addressLine3',
      MutualNumber: '920009756',
      hours: 'Sat-Thur 8:30am - 5pm',
      emails: ['jed@zk-legal.com'],
      mapEmbedUrl:
        'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7419.153308684319!2d39.108289!3d21.602442!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x15c3dbabb0e53c41%3A0xf11d981517c55a1f!2sThe%20Headquarters%20Business%20Park!5e0!3m2!1sen!2sus!4v1746332044326!5m2!1sen!2sus',
      socialLinks: [],
      backgroundImageUrl: '/images/جدة.webp',
    },
  ];

  selectedBranch: BranchDetails | null = null;

  private alertSvc = inject(AlertService);

  constructor(
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    if (this.allBranchesData.length > 0) {
      setTimeout(() => this.selectBranch(this.allBranchesData[0], true), 0);
    }
  }

  selectBranch(branch: BranchDetails, isInitialLoad = false): void {
    if (!isInitialLoad && this.selectedBranch?.id === branch.id) return;
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(
        this.document.body,
        'backgroundImage',
        `url('${branch.backgroundImageUrl}')`,
      );
    }
    this.selectedBranch = null;
    this.cdRef.detectChanges();
    setTimeout(() => {
      this.selectedBranch = branch;
      this.cdRef.detectChanges();
    }, 0);
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.setStyle(this.document.body, 'backgroundImage', '');
    }
  }

  getRectangleClasses(branch: BranchDetails): string {
    const base =
      'relative w-full sm:w-auto bg-white rounded-lg shadow-md p-4 cursor-pointer transition-all duration-300 ease-in-out border-2 border-transparent ';
    const hover = 'hover:shadow-lg hover:border-[#061933] hover:scale-[1.06] ';
    return this.selectedBranch?.id === branch.id
      ? `${base} border-[#061933] ring-2 ring-[#061933] shadow-lg scale-[1.02]`
      : `${base} ${hover}`;
  }

  scrollToContent(event: MouseEvent): void {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      const contentArea = document.getElementById('content-area');
      if (contentArea)
        contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  onSubmit(form: NgForm): void {
    if (!form.valid || this.isSubmitting) return;

    this.isSubmitting = true;
    const v = form.value;

    // بناء الـ payload بدون phone لو مش سعودي
    const contactData: any = {
      first_name: v.first_name,
      last_name: v.last_name,
      email: v.email,
      service: v.service || 'General',
      message: v.message,
    };

    // أضف الـ phone بس لو موجود (الـ backend هيتحقق منه)
    if (v.phone && v.phone.trim()) {
      contactData.phone = v.phone.trim();
    }

    this.messageService.createMessage(contactData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.alertSvc.success(
          'تم الإرسال بنجاح',
          'تم إرسال رسالتك بنجاح، سنتواصل معك قريباً',
        );
        form.resetForm();
      },
      error: (err) => {
        this.isSubmitting = false;
        const msg =
          err.error?.message || 'حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى';
        // لو خطأ رقم الهاتف، اعرض رسالة واضحة
        if (
          msg.toLowerCase().includes('phone') ||
          msg.toLowerCase().includes('saudi')
        ) {
          this.alertSvc.warning(
            'رقم الهاتف غير مقبول',
            'يرجى إدخال رقم سعودي أو ترك الحقل فارغاً',
          );
        } else {
          this.alertSvc.error('فشل الإرسال', msg);
        }
      },
    });
  }
}
