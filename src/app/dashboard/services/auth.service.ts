import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { AdminUser } from '../models/dashboard.models';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  status: string;
  token: string;
  admin: AdminUser;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly TOKEN_KEY = 'zk_admin_token';
  private readonly USER_KEY = 'zk_admin_user';

  private readonly API_URL = 'http://api.zk-legal.com';

  private currentUserSubject = new BehaviorSubject<AdminUser | null>(
    this.getUserFromStorage(),
  );
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  private getUserFromStorage(): AdminUser | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const user = localStorage.getItem(this.USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  get isLoggedIn(): boolean {
    if (!isPlatformBrowser(this.platformId)) return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  get token(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  get currentUser(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/api/v1/auth/login`, credentials)
      .pipe(
        tap((response) => {
          // الـ API بيرجع response.admin مش response.user
          localStorage.setItem(this.TOKEN_KEY, response.token);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.admin));
          this.currentUserSubject.next(response.admin);
        }),
        catchError((err) => throwError(() => err)),
      );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/admin/login']);
  }
}
