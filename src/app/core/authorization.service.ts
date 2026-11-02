import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CardAuthorizationRequest,
  CardAuthorizationResponse,
  CardSnapshot
} from './models';

const AUTHORIZE_URL = '/api/v1/cards/authorizations';

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
  constructor(private readonly http: HttpClient) {}

  authorize(request: CardAuthorizationRequest): Observable<CardAuthorizationResponse> {
    return this.http.post<CardAuthorizationResponse>(AUTHORIZE_URL, request);
  }

  getCard(cardNumber: string): Observable<CardSnapshot> {
    return this.http.get<CardSnapshot>(`/api/v1/cards/${cardNumber}`);
  }
}
