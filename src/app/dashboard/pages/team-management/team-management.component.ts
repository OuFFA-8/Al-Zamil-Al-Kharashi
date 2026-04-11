import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { TeamDataService } from '../../../core/services/team-data/team-data.service';
import { AlertService } from '../../services/alert.service';

interface MemberForm {
  name_ar: string;
  name_en: string;
  title_ar: string;
  title_en: string;
  bio_title_ar: string;
  bio_title_en: string;
  bio_text_ar: string;
  bio_text_en: string;
  email: string;
  phone: string;
  website: string;
  specializations: string[];
  status: 'active' | 'inactive';
  displayOrder: number;
}

@Component({
  selector: 'app-team-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './team-management.component.html',
  styleUrls: ['./team-management.component.css'],
})
export class TeamManagementComponent implements OnInit {
  private teamService = inject(TeamDataService);
  private alertSvc = inject(AlertService);

  readonly SERVER_URL = 'http://76.13.43.147:5000';

  members: any[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;
  searchQuery = '';
  stats = { allMembers: 0, activeMembers: 0 };

  showModal = false;
  isEditing = false;
  savingMember = false;
  editingId = '';

  form: MemberForm = this.emptyForm();
  specializationsInput = '';
  imagePreview = '';
  existingImageUrl = '';
  selectedFile: File | null = null;
  isMobile = signal(false);

  ngOnInit(): void {
    this.reload();
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    // لو العرض أقل من 768px نعتبره موبايل
    this.isMobile.set(window.innerWidth < 768);
  }

  emptyForm(): MemberForm {
    return {
      name_ar: '',
      name_en: '',
      title_ar: '',
      title_en: '',
      bio_title_ar: '',
      bio_title_en: '',
      bio_text_ar: '',
      bio_text_en: '',
      email: '',
      phone: '',
      website: '',
      specializations: [],
      status: 'active',
      displayOrder: 1,
    };
  }

  get currentImage(): string {
    return this.imagePreview || this.existingImageUrl;
  }

  getMemberImageUrl(member: any): string {
    const raw = member.photo || member.imageUrl || member.image || '';
    if (!raw) return '';
    return raw.startsWith('http') ? raw : `${this.SERVER_URL}/${raw}`;
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      this.alertSvc.warning(
        'الصورة كبيرة جداً',
        'الحد الأقصى لحجم الصورة هو 5MB',
      );
      return;
    }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => (this.imagePreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.selectedFile = null;
    this.imagePreview = '';
    this.existingImageUrl = '';
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
  onModalImgError(event: Event): void {
    this.existingImageUrl = '';
    this.imagePreview = '';
  }

  loadMembers(): void {
    this.loading = true;
    this.error = '';
    this.teamService.getMembers(this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.members = res.data;
        this.totalPages = res.totalPages;
        this.totalCount = res.documentCounts;
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        this.alertSvc.error(
          'فشل تحميل البيانات',
          err.error?.message || 'تعذّر الاتصال بالخادم',
        );
      },
    });
  }

  loadStats(): void {
    this.teamService.getMembersStats().subscribe({
      next: (data) => (this.stats = data),
      error: () => {},
    });
  }

  reload(): void {
    this.loadMembers();
    this.loadStats();
  }

  get filteredMembers(): any[] {
    if (!this.searchQuery.trim()) return this.members;
    const q = this.searchQuery.toLowerCase();
    return this.members.filter(
      (m) =>
        m.name_ar.toLowerCase().includes(q) ||
        m.name_en.toLowerCase().includes(q) ||
        m.title_en.toLowerCase().includes(q),
    );
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadMembers();
  }

  openAdd(): void {
    this.form = this.emptyForm();
    this.specializationsInput = '';
    this.imagePreview = '';
    this.existingImageUrl = '';
    this.selectedFile = null;
    this.isEditing = false;
    this.editingId = '';
    this.showModal = true;
  }

  openEdit(member: any): void {
    this.form = {
      name_ar: member.name_ar,
      name_en: member.name_en,
      title_ar: member.title_ar,
      title_en: member.title_en,
      bio_title_ar: member.bio_title_ar,
      bio_title_en: member.bio_title_en,
      bio_text_ar: member.bio_text_ar,
      bio_text_en: member.bio_text_en,
      email: member.email,
      phone: member.phone,
      website: member.website,
      specializations: [...member.specializations],
      status: member.status,
      displayOrder: member.displayOrder,
    };
    this.specializationsInput = member.specializations.join(', ');
    this.imagePreview = '';
    this.selectedFile = null;
    this.existingImageUrl = this.getMemberImageUrl(member);
    this.isEditing = true;
    this.editingId = member._id;
    this.showModal = true;
  }

  syncSpecializations(): void {
    this.form.specializations = this.specializationsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  saveModal(): void {
    this.syncSpecializations();

    if (!this.form.name_ar.trim() || !this.form.name_en.trim()) {
      this.alertSvc.error(
        'حقول مطلوبة',
        'يرجى إدخال اسم العضو بالعربي والإنجليزي',
      );
      return;
    }
    if (!this.form.title_ar.trim() || !this.form.title_en.trim()) {
      this.alertSvc.error(
        'حقول مطلوبة',
        'يرجى إدخال المنصب الوظيفي بالعربي والإنجليزي',
      );
      return;
    }

    this.savingMember = true;

    const fd = new FormData();
    fd.append('name_ar', this.form.name_ar);
    fd.append('name_en', this.form.name_en);
    fd.append('title_ar', this.form.title_ar);
    fd.append('title_en', this.form.title_en);
    fd.append('bio_title_ar', this.form.bio_title_ar);
    fd.append('bio_title_en', this.form.bio_title_en);
    fd.append('bio_text_ar', this.form.bio_text_ar);
    fd.append('bio_text_en', this.form.bio_text_en);
    fd.append('email', this.form.email);
    fd.append('phone', this.form.phone);
    if (this.form.website && this.form.website.trim()) {
      fd.append('website', this.form.website.trim());
    }
    fd.append('status', this.form.status);
    fd.append('displayOrder', this.form.displayOrder.toString());
    this.form.specializations.forEach((s) => fd.append('specializations', s));
    if (this.selectedFile) fd.append('image', this.selectedFile);

    const obs = this.isEditing
      ? this.teamService.updateMember(this.editingId, fd)
      : this.teamService.createMember(fd);

    obs.subscribe({
      next: () => {
        this.savingMember = false;
        this.showModal = false;
        this.alertSvc.success(
          this.isEditing ? 'تم التحديث' : 'تمت الإضافة',
          this.isEditing
            ? 'تم تحديث بيانات العضو بنجاح'
            : 'تمت إضافة العضو إلى الفريق',
        );
        this.reload();
      },
      error: (err: any) => {
        this.savingMember = false;
        this.alertSvc.error(
          'فشل الحفظ',
          err.error?.message || 'حدث خطأ أثناء الحفظ',
        );
      },
    });
  }

  deleteMember(member: any): void {
    if (!confirm(`هل تريد حذف "${member.name_ar}"؟`)) return;
    this.teamService.deleteMember(member._id).subscribe({
      next: () => {
        this.alertSvc.success('تم الحذف', `تم حذف "${member.name_ar}" بنجاح`);
        this.reload();
      },
      error: (err: any) => {
        this.alertSvc.error(
          'فشل الحذف',
          err.error?.message || 'حدث خطأ أثناء الحذف',
        );
      },
    });
  }
}
