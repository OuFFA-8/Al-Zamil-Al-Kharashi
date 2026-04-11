import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface ApiMember {
  _id: string;
  member_id: string;
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
  photo?: string;
  imageUrl?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberFormData {
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

export interface Section {
  _id: string;
  member_id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  bioTitleAr: string;
  bioTitleEn: string;
  bioTextAr: string;
  bioTextEn: string;
  email: string;
  phone: string;
  website: string;
  specializations: string[];
  status: 'active' | 'inactive';
  displayOrder: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface MembersListResponse {
  status: string;
  result: number;
  data: ApiMember[];
  page: number;
  limit: number;
  documentCounts: number;
  totalPages: number;
}

export interface MemberResponse {
  status: string;
  data: ApiMember;
}

export interface MembersStatsResponse {
  status: string;
  data: { allMembers: number; activeMembers: number };
}

@Injectable({ providedIn: 'root' })
export class TeamDataService {
  private http = inject(HttpClient);

  readonly BASE_URL = 'http://76.13.43.147:5000/api/v1';
  readonly UPLOADS_URL = 'http://76.13.43.147:5000/uploads/members';

  private membersSubject = new BehaviorSubject<Section[]>([]);
  private loaded = false;

  members$ = this.membersSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  initForWebsite(): void {
    if (!isPlatformBrowser(this.platformId) || this.loaded) return;
    this.loaded = true;
    this.loadAll();
  }

  private loadAll(): void {
    this.fetchAllPages(1, []);
  }

  private fetchAllPages(page: number, accumulated: Section[]): void {
    this.http
      .get<MembersListResponse>(
        `${this.BASE_URL}/members?page=${page}&limit=100&sort=displayOrder`,
      )
      .pipe(
        catchError((err) => {
          console.error('TeamDataService: loadAll failed', err);
          return of(null);
        }),
      )
      .subscribe((res) => {
        if (!res) {
          this.membersSubject.next(accumulated);
          return;
        }
        const all = [...accumulated, ...res.data.map((m) => this.toSection(m))];
        if (page < res.totalPages) {
          this.fetchAllPages(page + 1, all);
        } else {
          this.membersSubject.next(all);
        }
      });
  }

  buildImageUrl(m: ApiMember): string {
    const fromApi = m.photo || m.imageUrl || m.image || '';
    if (fromApi.startsWith('http')) return fromApi;
    if (fromApi)
      return `http://76.13.43.147:5000${fromApi.startsWith('/') ? '' : '/'}${fromApi}`;
    if (m.member_id) return `${this.UPLOADS_URL}/${m.member_id}.png`;
    return '';
  }

  private toSection(m: ApiMember): Section {
    return {
      _id: m._id,
      member_id: m.member_id,
      nameAr: m.name_ar,
      nameEn: m.name_en,
      titleAr: m.title_ar,
      titleEn: m.title_en,
      bioTitleAr: m.bio_title_ar,
      bioTitleEn: m.bio_title_en,
      bioTextAr: m.bio_text_ar,
      bioTextEn: m.bio_text_en,
      email: m.email,
      phone: m.phone,
      website: m.website,
      specializations: m.specializations ?? [],
      status: m.status,
      displayOrder: m.displayOrder,
      imageUrl: this.buildImageUrl(m),
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    };
  }

  // ─── Public: Website ───

  getTeamMembersObservable(): Observable<Section[]> {
    this.initForWebsite();
    return this.members$.pipe(
      map((members) =>
        members
          // .filter((m) => m.status === 'active')
          .sort((a, b) => a.displayOrder - b.displayOrder),
      ),
    );
  }

  getTeamMembers(): Section[] {
    return (
      this.membersSubject
        .getValue()
        // .filter((m) => m.status === 'active')
        .sort((a, b) => a.displayOrder - b.displayOrder)
    );
  }

  getMemberById(id: string): Observable<Section | undefined> {
    return this.members$.pipe(
      map((members) => members.find((m) => m._id === id || m.member_id === id)),
    );
  }

  refresh(): void {
    this.loadAll();
  }

  // ─── Public: Dashboard ───

  getMembers(page = 1, limit = 10): Observable<MembersListResponse> {
    return this.http.get<MembersListResponse>(
      `${this.BASE_URL}/members?page=${page}&limit=${limit}`,
    );
  }

  getMembersStats(): Observable<{ allMembers: number; activeMembers: number }> {
    return this.http
      .get<MembersStatsResponse>(`${this.BASE_URL}/admin/members/stats`)
      .pipe(map((res) => res.data));
  }

  // دالة التحويل الذكية داخل السيرفيس
  private convertToFormData(data: any): FormData {
    const fd = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key];

      // لو القيمة ملف (صورة) أو نص مش فاضي، ضيفها
      if (value instanceof File || value instanceof Blob) {
        fd.append(key, value);
      } else if (Array.isArray(value)) {
        value.forEach((v) => fd.append(key, v));
      } else if (value !== '' && value !== null && value !== undefined) {
        fd.append(key, value.toString());
      }
    });
    return fd;
  }

  createMember(data: any): Observable<ApiMember> {
    const fd = this.convertToFormData(data);
    return this.http.post<MemberResponse>(`${this.BASE_URL}/members`, fd).pipe(
      map((res) => res.data),
      tap((newMember) => {
        const current = this.membersSubject.getValue();
        this.membersSubject.next([...current, this.toSection(newMember)]);
      }),
    );
  }

  updateMember(id: string, data: any): Observable<ApiMember> {
    const fd = this.convertToFormData(data);
    return this.http
      .patch<MemberResponse>(`${this.BASE_URL}/members/${id}`, fd)
      .pipe(
        map((res) => res.data),
        tap((updated) => {
          const current = this.membersSubject.getValue();
          this.membersSubject.next(
            current.map((m) => (m._id === id ? this.toSection(updated) : m)),
          );
        }),
      );
  }

  deleteMember(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/members/${id}`).pipe(
      tap(() => {
        const current = this.membersSubject.getValue();
        this.membersSubject.next(current.filter((m) => m._id !== id));
      }),
    );
  }
}
