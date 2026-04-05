import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../../services/alert.service';
import {
  MessageService,
  ApiMessage,
} from '../../../core/services/message/message.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './contact-messages.component.html',
  styleUrls: ['./contact-messages.component.css'],
})
export class ContactMessagesComponent implements OnInit {
  private msgSvc = inject(MessageService);
  private alertSvc = inject(AlertService);

  messages: ApiMessage[] = [];
  loading = false;
  currentPage = 1;
  pageSize = 10;
  totalPages = 1;
  totalCount = 0;
  searchQuery = '';
  statusFilter = '';

  selectedMsg: ApiMessage | null = null;
  showDrawer = false;
  savingNotes = false;
  notesInput = '';

  // aliases للـ HTML القديم
  filterStatus = '';
  showDetailModal = false;
  selectedMessage: ApiMessage | null = null;

  stats = {
    totalMessages: 0,
    unreadMessages: 0,
    todayMessages: 0,
    thisWeekMessages: 0,
  };

  ngOnInit(): void {
    this.loadMessages();
    this.loadStats();
  }

  loadMessages(): void {
    this.loading = true;
    this.msgSvc
      .getMessages(
        this.currentPage,
        this.pageSize,
        this.statusFilter,
        this.searchQuery,
      )
      .subscribe({
        next: (res) => {
          this.messages = res.data;
          this.totalPages = res.totalPages;
          this.totalCount = res.documentCounts;
          this.loading = false;
        },
        error: (err: any) => {
          this.loading = false;
          this.alertSvc.error(
            'فشل تحميل الرسائل',
            err.error?.message || 'تعذّر الاتصال بالخادم',
          );
        },
      });
  }

  loadStats(): void {
    this.msgSvc.getStats().subscribe({
      next: (s) => (this.stats = s),
      error: () => {},
    });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(p: number): void {
    if (p < 1 || p > this.totalPages) return;
    this.currentPage = p;
    this.loadMessages();
  }

  openMessage(msg: ApiMessage): void {
    this.selectedMsg = msg;
    this.notesInput = msg.notes || '';
    this.showDrawer = true;
    if (msg.status === 'unread') this.changeStatus(msg, 'read');
  }

  closeDrawer(): void {
    this.showDrawer = false;
    this.selectedMsg = null;
  }

  changeStatus(msg: ApiMessage, status: 'read' | 'unread' | 'replied'): void {
    this.msgSvc.updateStatus(msg._id, status).subscribe({
      next: () => {
        msg.status = status;
        if (this.selectedMsg?._id === msg._id) this.selectedMsg.status = status;
        if (this.selectedMessage?._id === msg._id)
          this.selectedMessage.status = status;
        const label =
          status === 'read'
            ? 'مقروءة'
            : status === 'replied'
              ? 'تم الرد'
              : 'غير مقروءة';
        this.alertSvc.success(
          'تم التحديث',
          `تم تغيير حالة الرسالة إلى ${label}`,
        );
        this.loadStats();
      },
      error: (err: any) => {
        this.alertSvc.error('فشل التحديث', err.error?.message || 'حدث خطأ');
      },
    });
  }

  saveNotes(): void {
    if (!this.selectedMsg) return;
    this.savingNotes = true;
    this.msgSvc.addNotes(this.selectedMsg._id, this.notesInput).subscribe({
      next: () => {
        this.savingNotes = false;
        if (this.selectedMsg) this.selectedMsg.notes = this.notesInput;
        if (this.selectedMessage) this.selectedMessage.notes = this.notesInput;
        this.alertSvc.success('تم الحفظ', 'تم حفظ الملاحظات بنجاح');
      },
      error: (err: any) => {
        this.savingNotes = false;
        this.alertSvc.error(
          'فشل الحفظ',
          err.error?.message || 'حدث خطأ أثناء حفظ الملاحظات',
        );
      },
    });
  }

  deleteMessage(msg: ApiMessage): void {
    if (!confirm(`هل تريد حذف رسالة ${msg.first_name} ${msg.last_name}؟`))
      return;
    this.msgSvc.deleteMessage(msg._id).subscribe({
      next: () => {
        this.alertSvc.success('تم الحذف', 'تم حذف الرسالة بنجاح');
        if (this.selectedMsg?._id === msg._id) this.closeDrawer();
        if (this.selectedMessage?._id === msg._id) this.closeModal();
        this.loadMessages();
        this.loadStats();
      },
      error: (err: any) => {
        this.alertSvc.error(
          'فشل الحذف',
          err.error?.message || 'حدث خطأ أثناء الحذف',
        );
      },
    });
  }

  // ── aliases للـ HTML القديم ──

  applyFilter(): void {
    this.statusFilter = this.filterStatus;
    this.currentPage = 1;
    this.loadMessages();
  }

  viewMessage(msg: ApiMessage): void {
    this.selectedMessage = msg;
    this.showDetailModal = true;
    this.openMessage(msg);
  }

  closeModal(): void {
    this.showDetailModal = false;
    this.selectedMessage = null;
    this.closeDrawer();
  }

  markReplied(msg: ApiMessage): void {
    this.changeStatus(msg, 'replied');
  }

  getStatusLabel(status: string): string {
    return status === 'unread'
      ? 'جديد'
      : status === 'replied'
        ? 'تم الرد'
        : 'مقروء';
  }

  exportCSV(): void {
    const rows = this.messages.map(
      (m) =>
        `"${m.first_name} ${m.last_name}","${m.email}","${m.phone || ''}","${m.service}","${this.getStatusLabel(m.status)}","${this.formatDate(m.createdAt)}"`,
    );
    const csv = [
      'الاسم,البريد الإلكتروني,الهاتف,الخدمة,الحالة,التاريخ',
      ...rows,
    ].join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── helpers ──

  getFullName(msg: ApiMessage): string {
    return `${msg.first_name} ${msg.last_name}`;
  }
  formatDate(d: string): string {
    return d ? new Date(d).toLocaleDateString('ar-SA') : '';
  }
  badgeClass(s: string): string {
    return s === 'unread'
      ? 'bd-new'
      : s === 'replied'
        ? 'bd-replied'
        : 'bd-read';
  }
  badgeLabel(s: string): string {
    return s === 'unread' ? 'جديد' : s === 'replied' ? 'تم الرد' : 'مقروء';
  }
}
