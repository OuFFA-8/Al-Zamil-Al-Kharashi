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
  featureImage?: string; // ← الاسم الحقيقي
  photo?: string; // ← احتياطي
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

  private workItemsSubject = new BehaviorSubject<WorkItem[]>([]);

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.loadEvents();
    }
  }

  // ← يقرأ featureImage أولاً ثم photo احتياطاً
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

  private loadEvents(): void {
    const lang =
      (typeof window !== 'undefined' && localStorage.getItem('lang')) || 'ar';
    this.http
      .get<BlogsListResponse>(
        `${this.BASE_URL}/blogs?limit=100&status=published&sort=-createdAt`,
      )
      .pipe(
        map((res) => res.data.map((b) => this.toWorkItem(b, lang))),
        catchError((err) => {
          console.error('EventDataService: failed to load blogs', err);
          return of(this.getStaticFallback());
        }),
        tap((items) => this.workItemsSubject.next(items)),
      )
      .subscribe();
  }

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

  createBlog(data: FormData): Observable<ApiBlog> {
    return this.http.post<BlogResponse>(`${this.BASE_URL}/blogs`, data).pipe(
      map((r) => r.data),
      tap(() => this.loadEvents()),
    );
  }

  updateBlog(id: string, data: FormData): Observable<ApiBlog> {
    return this.http
      .patch<BlogResponse>(`${this.BASE_URL}/blogs/${id}`, data)
      .pipe(
        map((r) => r.data),
        tap(() => this.loadEvents()),
      );
  }

  deleteBlog(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.BASE_URL}/blogs/${id}`)
      .pipe(tap(() => this.loadEvents()));
  }

  publishBlog(id: string): Observable<ApiBlog> {
    const fd = new FormData();
    fd.append('status', 'published');
    return this.http
      .patch<BlogResponse>(`${this.BASE_URL}/blogs/${id}`, fd)
      .pipe(
        map((r) => r.data),
        tap(() => this.loadEvents()),
      );
  }

  unpublishBlog(id: string): Observable<ApiBlog> {
    return this.http
      .patch<BlogResponse>(`${this.BASE_URL}/blogs/${id}/unpublish`, {})
      .pipe(
        map((r) => r.data),
        tap(() => this.loadEvents()),
      );
  }

  private getStaticFallback(): WorkItem[] {
    return [
      {
        _id: '1',
        imageUrl: '/images/event.webp',
        date: 'event.item1.date',
        category: 'event.item1.category',
        title: 'event.item1.title',
        description: 'event.item1.description',
        content: '',
        titleAr: '',
        titleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        contentAr: '',
        contentEn: '',
        categoryAr: '',
        categoryEn: '',
        status: 'published',
        author: '',
        publishedDate: '',
        createdAt: '',
      },
    ];
  }
}
