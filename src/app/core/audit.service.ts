import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuditEntry } from './models';

const AUDIT_URL = '/audit-api/api/v1/audit';

@Injectable({ providedIn: 'root' })
export class AuditService {
  constructor(private readonly http: HttpClient) {}

  list(cardNumber?: string): Observable<AuditEntry[]> {
    const params = cardNumber ? new HttpParams().set('cardNumber', cardNumber) : undefined;
    return this.http.get<AuditEntry[]>(AUDIT_URL, { params });
  }
}
