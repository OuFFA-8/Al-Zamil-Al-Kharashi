import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  // ✅ تعديل الشرط ليشمل روابط الـ API الخاصة بك
  // إذا كان الرابط لا يحتوي على /api/v1 (أو مسار الـ API العام)، مرره بدون تعديل
  if (!req.url.includes('/api/v1')) {
    return next(req);
  }

  const token = auth.token; // تأكد أن auth.token يسحب القيمة من localStorage/Cookie

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        console.warn('Unauthorized! Logging out...');
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};
