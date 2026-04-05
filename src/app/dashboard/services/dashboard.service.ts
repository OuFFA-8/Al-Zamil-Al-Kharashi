import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {
  ContactMessage,
  Event,
  DashboardStats,
} from '../models/dashboard.models';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/admin';

  // ── STATIC DATA مؤقتاً لحد ما الـ API يجهز ──

  private staticStats: DashboardStats = {
    totalMessages: 6,
    unreadMessages: 0,
    todayMessages: 0,
    thisWeekMessages: 0,
    totalTeamMembers: 0,
    activeMembers: 0,
    seniorMembers: 0,
    totalEvents: 5,
    publishedEvents: 4,
  };

  private staticMessages: ContactMessage[] = [
    {
      id: 1,
      name: 'ساره بن خضير',
      email: 'aasarah91@gmail.com',
      phone: '0508769203',
      service: 'Legal',
      message:
        'طالبة قانون في جامعة الملك سعود بمعدل 4.67 حاصلة على عدة دورات في الصياغة القانونية...',
      status: 'read',
      date: '1/24/2026 3:10:49 AM',
    },
    {
      id: 2,
      name: 'نوف الشويعر',
      email: 'n.alshowaier2002@gmail.com',
      phone: '0501401508',
      service: 'Employment',
      message: 'حابه استشارة',
      status: 'read',
      date: '1/20/2026 4:28:26 PM',
    },
    {
      id: 3,
      name: 'Sarah Saleh',
      email: 'neet_heart@hotmail.com',
      phone: '0505774494',
      service: 'Corporate',
      message: 'ارغب في استشارة قانونيه',
      status: 'read',
      date: '1/19/2026 10:53:01 PM',
    },
    {
      id: 4,
      name: 'عبدالله المكيتزي',
      email: 'a.al-makenzi@hotmail.com',
      phone: '0542525005',
      service: 'Corporate',
      message: 'السلام عليكم ورحمة الله وبركاته...',
      status: 'read',
      date: '1/11/2026 9:38:19 AM',
    },
    {
      id: 5,
      name: 'Hamoud Aloufi',
      email: 'hamoud.h.aloufi@gmail.com',
      phone: '0541419417',
      service: 'Corporate',
      message:
        "Hi, I'm a Saudi licensed lawyer with over 8 years experience...",
      status: 'read',
      date: '12/20/2025 9:35:35 PM',
    },
    {
      id: 6,
      name: 'محمد الزرزني',
      email: 'mnh6060@gmail.com',
      phone: '0536681418',
      service: 'Legal',
      message: 'السادة المحترمين في شركة الزامل...',
      status: 'read',
      date: '12/14/2025 11:35:21 AM',
    },
  ];

  private staticEvents: Event[] = [
    {
      id: 1,
      titleAr: 'ملتقى القانون التجاري',
      titleEn: 'Commercial Law Forum',
      descriptionAr: 'ملتقى متخصص في القانون التجاري السعودي',
      descriptionEn: 'A specialized forum on Saudi commercial law',
      date: '2026-02-15',
      location: 'الرياض',
      image: '',
      status: 'published',
      createdAt: '2026-01-10',
    },
    {
      id: 2,
      titleAr: 'ورشة عمل قانون العمل',
      titleEn: 'Labor Law Workshop',
      descriptionAr: 'ورشة عمل حول التعديلات الجديدة في نظام العمل',
      descriptionEn: 'Workshop on new amendments in labor law',
      date: '2026-03-01',
      location: 'جدة',
      image: '',
      status: 'published',
      createdAt: '2026-01-20',
    },
    {
      id: 3,
      titleAr: 'مؤتمر الاستثمار الأجنبي',
      titleEn: 'Foreign Investment Conference',
      descriptionAr: 'مؤتمر حول الاستثمار الأجنبي في المملكة',
      descriptionEn: 'Conference on foreign investment in Saudi Arabia',
      date: '2026-04-10',
      location: 'الرياض',
      image: '',
      status: 'draft',
      createdAt: '2026-02-01',
    },
  ];

  // ── STATS ──
  getStats(): Observable<DashboardStats> {
    // TODO: return this.http.get<DashboardStats>(`${this.API_URL}/stats`);
    return of(this.staticStats);
  }

  // ── MESSAGES ──
  getMessages(): Observable<ContactMessage[]> {
    // TODO: return this.http.get<ContactMessage[]>(`${this.API_URL}/messages`);
    return of(this.staticMessages);
  }

  markAsRead(id: number): Observable<void> {
    const msg = this.staticMessages.find((m) => m.id === id);
    if (msg) msg.status = 'read';
    return of(void 0);
  }

  deleteMessage(id: number): Observable<void> {
    this.staticMessages = this.staticMessages.filter((m) => m.id !== id);
    return of(void 0);
  }

  // ── EVENTS ──
  getEvents(): Observable<Event[]> {
    // TODO: return this.http.get<Event[]>(`${this.API_URL}/events`);
    return of(this.staticEvents);
  }

  addEvent(event: Partial<Event>): Observable<Event> {
    const newEvent = { ...event, id: Date.now() } as Event;
    this.staticEvents.push(newEvent);
    return of(newEvent);
  }

  updateEvent(id: number, data: Partial<Event>): Observable<Event> {
    const idx = this.staticEvents.findIndex((e) => e.id === id);
    if (idx !== -1)
      this.staticEvents[idx] = { ...this.staticEvents[idx], ...data };
    return of(this.staticEvents[idx]);
  }

  deleteEvent(id: number): Observable<void> {
    this.staticEvents = this.staticEvents.filter((e) => e.id !== id);
    return of(void 0);
  }
}
