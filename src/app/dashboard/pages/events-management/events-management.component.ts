import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  EventDataService,
  ApiBlog,
} from '../../../core/services/eventData/event-data.service';
import { AlertService } from '../../services/alert.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-events-management',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './events-management.component.html',
  styleUrls: ['./events-management.component.css'],
})
export class EventsManagementComponent implements OnInit {
  private svc = inject(EventDataService);
  private alertSvc = inject(AlertService);

  readonly SERVER_URL = 'http://76.13.43.147:5000';

  blogs: ApiBlog[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;
  searchQuery = '';
  filterStatus = '';

  showModal = false;
  isEditing = false;
  savingBlog = false;
  editingId = '';

  showPreview = false;
  previewBlog: ApiBlog | null = null;

  form = this.emptyForm();
  imagePreview = '';
  existingImageUrl = '';
  selectedFile: File | null = null;

  ngOnInit(): void {
    this.loadBlogs();
  }

  emptyForm() {
    return {
      title_ar: '',
      title_en: '',
      description_ar: '',
      description_en: '',
      content_ar: '',
      content_en: '',
      category_ar: '',
      category_en: '',
      status: 'draft' as 'draft' | 'published',
      publishedDate: new Date().toISOString().split('T')[0],
    };
  }

  get stats() {
    return {
      total: this.totalCount,
      published: this.blogs.filter((b) => b.status === 'published').length,
      draft: this.blogs.filter((b) => b.status === 'draft').length,
    };
  }

  get currentImage(): string {
    return this.imagePreview || this.existingImageUrl;
  }

  getBlogImageUrl(blog: ApiBlog): string {
    const raw = blog.featureImage || (blog as any).photo || '';
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

  loadBlogs(): void {
    this.loading = true;
    this.error = '';
    this.svc
      .getBlogs(
        this.currentPage,
        this.pageSize,
        this.filterStatus,
        this.searchQuery,
      )
      .subscribe({
        next: (res) => {
          this.blogs = res.data;
          this.totalPages = res.totalPages;
          this.totalCount = res.documentCounts;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alertSvc.error(
            'فشل تحميل المقالات',
            err.error?.message || 'تعذّر الاتصال بالخادم',
          );
        },
      });
  }

  applyFilter(): void {
    this.currentPage = 1;
    this.loadBlogs();
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    this.loadBlogs();
  }

  openAdd(): void {
    this.form = this.emptyForm();
    this.imagePreview = '';
    this.existingImageUrl = '';
    this.selectedFile = null;
    this.isEditing = false;
    this.editingId = '';
    this.showModal = true;
  }

  openEdit(blog: ApiBlog): void {
    this.form = {
      title_ar: blog.title_ar,
      title_en: blog.title_en,
      description_ar: blog.description_ar,
      description_en: blog.description_en,
      content_ar: blog.content_ar,
      content_en: blog.content_en,
      category_ar: blog.category_ar,
      category_en: blog.category_en,
      status: blog.status,
      publishedDate: blog.publishedDate?.split('T')[0] ?? '',
    };
    this.imagePreview = '';
    this.selectedFile = null;
    this.existingImageUrl = this.getBlogImageUrl(blog);
    this.isEditing = true;
    this.editingId = blog._id;
    this.showModal = true;
  }

  openPreview(blog: ApiBlog): void {
    this.previewBlog = blog;
    this.showPreview = true;
  }

  saveModal(): void {
    if (!this.form.title_ar.trim() || !this.form.title_en.trim()) {
      this.alertSvc.error(
        'حقول مطلوبة',
        'يرجى إدخال عنوان المقال بالعربي والإنجليزي',
      );
      return;
    }
    if (!this.form.content_ar.trim() || !this.form.content_en.trim()) {
      this.alertSvc.error(
        'حقول مطلوبة',
        'يرجى إدخال محتوى المقال بالعربي والإنجليزي',
      );
      return;
    }

    this.savingBlog = true;
    const fd = new FormData();
    fd.append('title_ar', this.form.title_ar);
    fd.append('title_en', this.form.title_en);
    fd.append('description_ar', this.form.description_ar);
    fd.append('description_en', this.form.description_en);
    fd.append('content_ar', this.form.content_ar);
    fd.append('content_en', this.form.content_en);
    fd.append('category_ar', this.form.category_ar);
    fd.append('category_en', this.form.category_en);
    fd.append('status', this.form.status);
    fd.append('publishedDate', this.form.publishedDate);
    if (this.selectedFile) {
      fd.append(this.isEditing ? 'image' : 'featureImage', this.selectedFile);
    }

    const obs = this.isEditing
      ? this.svc.updateBlog(this.editingId, fd)
      : this.svc.createBlog(fd);

    obs.subscribe({
      next: () => {
        this.savingBlog = false;
        this.showModal = false;
        this.alertSvc.success(
          this.isEditing ? 'تم التحديث' : 'تمت الإضافة',
          this.isEditing ? 'تم تحديث المقال بنجاح' : 'تمت إضافة المقال بنجاح',
        );
        this.loadBlogs();
      },
      error: (err: any) => {
        this.savingBlog = false;
        this.alertSvc.error(
          'فشل الحفظ',
          err.error?.message || 'حدث خطأ أثناء الحفظ',
        );
      },
    });
  }

  toggleStatus(blog: ApiBlog): void {
    const isPublished = blog.status === 'published';
    const obs = isPublished
      ? this.svc.unpublishBlog(blog._id)
      : this.svc.publishBlog(blog._id);
    obs.subscribe({
      next: () => {
        this.alertSvc.success(
          isPublished ? 'تم إلغاء النشر' : 'تم النشر',
          isPublished ? 'تم إلغاء نشر المقال' : 'تم نشر المقال بنجاح',
        );
        this.loadBlogs();
      },
      error: (err: any) => {
        this.alertSvc.error('فشل العملية', err.error?.message || 'حدث خطأ');
      },
    });
  }

  deleteBlog(blog: ApiBlog): void {
    if (!confirm(`هل تريد حذف "${blog.title_ar}"؟`)) return;
    this.svc.deleteBlog(blog._id).subscribe({
      next: () => {
        this.alertSvc.success('تم الحذف', `تم حذف "${blog.title_ar}" بنجاح`);
        this.loadBlogs();
      },
      error: (err: any) => {
        this.alertSvc.error(
          'فشل الحذف',
          err.error?.message || 'حدث خطأ أثناء الحذف',
        );
      },
    });
  }

  formatDate(date: string): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('ar-SA');
  }
}
