import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { first, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DevTokenService } from './dev-token.service';

const CORE_API_PATTERN = /^\/api\//;
const PUBLIC_ENDPOINT = '/api/v1/dev/tokens';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const tokenService = inject(DevTokenService);

  if (!CORE_API_PATTERN.test(request.url) || request.url.includes(PUBLIC_ENDPOINT)) {
    return next(request);
  }

  return tokenService.getToken().pipe(
    first(),
    switchMap((token) => next(request.clone({
      setHeaders: { Authorization: `Bearer ${token.accessToken}` }
    }))),
    tap({
      error: (error) => {
        if (error.status === 401) {
          tokenService.invalidate();
        }
      }
    })
  );
};
