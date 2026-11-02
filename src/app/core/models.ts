export type PaymentDecision = 'APPROVED' | 'DECLINED';

export interface CardAuthorizationRequest {
  cardNumber: string;
  cardExpiry: string;
  amount: number;
  currency: string;
  merchantId: string;
  merchantName?: string;
}

export interface CardAuthorizationResponse {
  transactionId: string;
  decision: PaymentDecision;
  responseCode: string;
  declineCode?: string;
  authorizationCode?: string;
  remainingBalance?: number;
  timestamp: string;
}

export interface ErrorResponse {
  code: string;
  message: string;
  timestamp: string;
}

export interface AuditEntry {
  transactionId: string;
  maskedCardNumber: string;
  decision: string;
  responseCode: string;
  authorizationCode?: string;
  amount: number;
  currency: string;
  merchantId: string;
  merchantName?: string;
  transactionTs: string;
  receivedAt: string;
}

export interface CardSnapshot {
  maskedCardNumber: string;
  status: string;
  currentBalance: number;
  availableBalance: number;
  currency: string;
  cacheHit: boolean;
}

export interface DevTokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface ApiFailure {
  code: string;
  message: string;
}

export interface SeedCard {
  pan: string;
  expiry: string;
  label: string;
  badge: string;
  amount: number;
}
