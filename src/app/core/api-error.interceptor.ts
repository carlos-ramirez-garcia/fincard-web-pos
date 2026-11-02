import { HttpInterceptorFn, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ApiFailure, ErrorResponse } from './models';

const TRANSPORT_CODES: Record<number, string> = {
  0: 'NETWORK_UNREACHABLE',
  401: 'UNAUTHORIZED',
  404: 'NOT_FOUND',
  405: 'METHOD_NOT_ALLOWED',
  500: 'INTERNAL_ERROR',
  502: 'UPSTREAM_UNAVAILABLE',
  503: 'SERVICE_UNAVAILABLE'
};

export const apiErrorInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(request).pipe(
    catchError((error: unknown) => {
      const failure = mapToApiFailure(error);
      return throwError(() => failure);
    })
  );
};

function mapToApiFailure(error: unknown): ApiFailure {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as ErrorResponse | null;
    if (body && typeof body.code === 'string' && typeof body.message === 'string') {
      return { code: body.code, message: body.message };
    }
    const code = TRANSPORT_CODES[error.status] ?? 'HTTP_ERROR';
    return { code, message: error.message || `HTTP ${error.status}` };
  }
  return { code: 'UNEXPECTED_ERROR', message: String(error) };
}
