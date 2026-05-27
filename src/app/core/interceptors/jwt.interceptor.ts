import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

const API_URL = 'http://localhost:8080';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const http = inject(HttpClient);

  const addToken = (request: typeof req) => {
    if (isPlatformBrowser(platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        return request.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        });
      }
    }
    return request;
  };

  return next(addToken(req)).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status === 401 &&
        isPlatformBrowser(platformId) &&
        !req.url.includes('/auth/')
      ) {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          return http
            .post<{ token: string }>(`${API_URL}/auth/refresh`, { refreshToken })
            .pipe(
              switchMap(res => {
                localStorage.setItem('token', res.token);
                return next(addToken(req)); 
              }),
              catchError(refreshError => {
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('usuarioSessao');
                localStorage.removeItem('carrinho_bigode');
                return throwError(() => refreshError);
              })
            );
        }
      }
      return throwError(() => error);
    })
  );
};
