import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DevTokenResponse } from './models';

const TOKEN_URL = '/api/v1/dev/tokens';

@Injectable({ providedIn: 'root' })
export class DevTokenService {
  private cachedToken: string | null = null;
  private expiresAtMs = 0;
  private inflight$: Observable<DevTokenResponse> | null = null;

  constructor(private readonly http: HttpClient) {}

  getToken(): Observable<DevTokenResponse> {
    if (this.isFresh()) {
      return new Observable<DevTokenResponse>((observer) => {
        observer.next({
          accessToken: this.cachedToken!,
          tokenType: 'Bearer',
          expiresIn: 0
        });
        observer.complete();
      });
    }
    if (this.inflight$) {
      return this.inflight$;
    }
    this.inflight$ = this.http.post<DevTokenResponse>(TOKEN_URL, {});
    return new Observable<DevTokenResponse>((observer) => {
      this.inflight$!.subscribe({
        next: (response) => {
          this.cachedToken = response.accessToken;
          this.expiresAtMs = Date.now() + (response.expiresIn - 60) * 1000;
          observer.next(response);
          observer.complete();
        },
        error: (error) => observer.error(error),
        complete: () => {
          this.inflight$ = null;
        }
      });
    });
  }

  invalidate(): void {
    this.cachedToken = null;
    this.expiresAtMs = 0;
  }

  private isFresh(): boolean {
    return this.cachedToken !== null && Date.now() < this.expiresAtMs;
  }
}
