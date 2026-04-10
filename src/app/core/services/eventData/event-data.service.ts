import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface ApiBlog {
  _id: string;
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  content_ar: string;
  content_en: string;
  category_ar: string;
  category_en: string;
  author: string;
  status: 'published' | 'draft';
  publishedDate: string;
  featureImage?: string;
  photo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BlogsListResponse {
  status: string;
  result: number;
  data: ApiBlog[];
  page: number;
  limit: number;
  documentCounts: number;
  totalPages: number;
}

export interface BlogResponse {
  status: string;
  data: ApiBlog;
}

export interface WorkItem {
  _id: string;
  imageUrl: string;
  date: string;
  category: string;
  title: string;
  description: string;
  content: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  contentAr: string;
  contentEn: string;
  categoryAr: string;
  categoryEn: string;
  status: 'published' | 'draft';
  author: string;
  publishedDate: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class EventDataService {
  readonly BASE_URL = 'http://76.13.43.147:5000/api/v1';
  readonly SERVER_URL = 'http://76.13.43.147:5000';

  // ✅ cache كامل للبيانات (published + draft) للداشبورد
  private allBlogsSubject = new BehaviorSubject<ApiBlog[]>([]);
  private workItemsSubject = new BehaviorSubject<WorkItem[]>([]);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadEvents();
    }
  }

  private getImageUrl(blog: ApiBlog): string {
    const raw = blog.featureImage || blog.photo || '';
    if (!raw) return '/images/event.webp';
    if (raw.startsWith('http')) return raw;
    return `${this.SERVER_URL}/${raw}`;
  }

  private toWorkItem(blog: ApiBlog, lang: string): WorkItem {
    const isAr = lang === 'ar';
    return {
      _id: blog._id,
      imageUrl: this.getImageUrl(blog),
      date: blog.publishedDate
        ? new Date(blog.publishedDate).toLocaleDateString(
            isAr ? 'ar-SA' : 'en-US',
          )
        : '',
      category: isAr ? blog.category_ar : blog.category_en,
      title: isAr ? blog.title_ar : blog.title_en,
      description: isAr ? blog.description_ar : blog.description_en,
      content: isAr ? blog.content_ar : blog.content_en,
      titleAr: blog.title_ar,
      titleEn: blog.title_en,
      descriptionAr: blog.description_ar,
      descriptionEn: blog.description_en,
      contentAr: blog.content_ar,
      contentEn: blog.content_en,
      categoryAr: blog.category_ar,
      categoryEn: blog.category_en,
      status: blog.status,
      author: blog.author,
      publishedDate: blog.publishedDate,
      createdAt: blog.createdAt,
    };
  }

  // ✅ يحدث الـ workItems من الـ allBlogs cache
  private syncWorkItems(): void {
    const lang =
      (typeof window !== 'undefined' && localStorage.getItem('lang')) || 'ar';
    const published = this.allBlogsSubject
      .getValue()
      .filter((b) => b.status === 'published');
    this.workItemsSubject.next(published.map((b) => this.toWorkItem(b, lang)));
  }

  private loadEvents(): void {
    this.http
      .get<BlogsListResponse>(
        `${this.BASE_URL}/blogs?limit=100&sort=-createdAt`,
      )
      .pipe(
        map((res) => res.data),
        catchError((err) => {
          console.error('EventDataService: failed to load blogs', err);
          return of([] as ApiBlog[]);
        }),
      )
      .subscribe((blogs) => {
        this.allBlogsSubject.next(blogs);
        this.syncWorkItems();
      });
  }

  // ─── Public: Website ───

  getEventsObservable(): Observable<WorkItem[]> {
    return this.workItemsSubject.asObservable();
  }
  getEvents(): WorkItem[] {
    return this.workItemsSubject.getValue();
  }
  getEventById(id: string): WorkItem | undefined {
    return this.workItemsSubject.getValue().find((i) => i._id === id);
  }
  getOtherEvents(currentId: string, count: number): WorkItem[] {
    return this.workItemsSubject
      .getValue()
      .filter((i) => i._id !== currentId)
      .slice(0, count);
  }
  refresh(): void {
    this.loadEvents();
  }

  // ─── Public: Dashboard ───

  getBlogs(
    page = 1,
    limit = 10,
    status = '',
    q = '',
  ): Observable<BlogsListResponse> {
    let url = `${this.BASE_URL}/blogs?page=${page}&limit=${limit}&sort=-createdAt`;
    if (status) url += `&status=${status}`;
    if (q) url += `&q=${encodeURIComponent(q)}`;
    return this.http.get<BlogsListResponse>(url);
  }

  // ✅ بعد create — نضيف للـ cache مباشرة
  createBlog(data: FormData): Observable<ApiBlog> {
    return this.http.post<BlogResponse>(`${this.BASE_URL}/blogs`, data).pipe(
      map((r) => r.data),
      tap((newBlog) => {
        const current = this.allBlogsSubject.getValue();
        this.allBlogsSubject.next([newBlog, ...current]);
        this.syncWorkItems();
      }),
    );
  }

  // ✅ بعد update — نحدث العنصر في الـ cache
  updateBlog(id: string, data: FormData): Observable<ApiBlog> {
    return this.http
      .patch<BlogResponse>(`${this.BASE_URL}/blogs/${id}`, data)
      .pipe(
        map((r) => r.data),
        tap((updated) => {
          const current = this.allBlogsSubject.getValue();
          this.allBlogsSubject.next(
            current.map((b) => (b._id === id ? updated : b)),
          );
          this.syncWorkItems();
        }),
      );
  }

  // ✅ بعد delete — نشيله من الـ cache
  deleteBlog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/blogs/${id}`).pipe(
      tap(() => {
        const current = this.allBlogsSubject.getValue();
        this.allBlogsSubject.next(current.filter((b) => b._id !== id));
        this.syncWorkItems();
      }),
    );
  }

  // ✅ publish — نحدث الـ status في الـ cache
  publishBlog(id: string): Observable<ApiBlog> {
    const fd = new FormData();
    fd.append('status', 'published');
    return this.http
      .patch<BlogResponse>(`${this.BASE_URL}/blogs/${id}`, fd)
      .pipe(
        map((r) => r.data),
        tap((updated) => {
          const current = this.allBlogsSubject.getValue();
          this.allBlogsSubject.next(
            current.map((b) => (b._id === id ? updated : b)),
          );
          this.syncWorkItems();
        }),
      );
  }

  // ✅ unpublish — نحدث الـ status في الـ cache
  unpublishBlog(id: string): Observable<ApiBlog> {
    return this.http
      .patch<BlogResponse>(`${this.BASE_URL}/blogs/${id}/unpublish`, {})
      .pipe(
        map((r) => r.data),
        tap((updated) => {
          const current = this.allBlogsSubject.getValue();
          this.allBlogsSubject.next(
            current.map((b) => (b._id === id ? updated : b)),
          );
          this.syncWorkItems();
        }),
      );
  }
}
