import { Component, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthorizationService } from '../../core/authorization.service';
import { ApiFailure, CardAuthorizationRequest, CardAuthorizationResponse, SeedCard } from '../../core/models';

const SEED_CARDS: SeedCard[] = [
  { pan: '4539148803436467', expiry: '10/29', label: 'Débito activo', badge: 'APPROVED', amount: 75 },
  { pan: '5211000000001234', expiry: '10/29', label: 'Saldo corto', badge: '51', amount: 100 },
  { pan: '4111111111111111', expiry: '10/30', label: 'Bloqueada', badge: '07', amount: 50 },
  { pan: '4024007196559937', expiry: '01/25', label: 'Expirada', badge: '54', amount: 50 },
  { pan: '3782822463100051', expiry: '10/27', label: 'Crédito', badge: 'CREDIT', amount: 250 }
];

const CARD_NUMBER_PATTERN = /^[0-9]{13,19}$/;
const EXPIRY_PATTERN = /^(0[1-9]|1[0-2])\/[0-9]{2}$/;

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, DecimalPipe],
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authorizationService = inject(AuthorizationService);

  readonly seedCards = SEED_CARDS;
  readonly loading = signal(false);
  readonly response = signal<CardAuthorizationResponse | null>(null);
  readonly failure = signal<ApiFailure | null>(null);

  readonly form = this.fb.nonNullable.group({
    cardNumber: ['', [Validators.required, Validators.pattern(CARD_NUMBER_PATTERN)]],
    cardExpiry: ['', [Validators.required, Validators.pattern(EXPIRY_PATTERN)]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    currency: ['USD', [Validators.required, Validators.pattern(/^[A-Za-z]{3}$/)]],
    merchantId: ['MERCH-WEB', [Validators.required, Validators.maxLength(40)]],
    merchantName: ['FintCard Web POS', [Validators.maxLength(120)]]
  });

  applySeed(seed: SeedCard): void {
    this.form.patchValue({
      cardNumber: seed.pan,
      cardExpiry: seed.expiry,
      amount: seed.amount,
      currency: 'USD',
      merchantId: 'MERCH-WEB',
      merchantName: 'FintCard Web POS'
    });
    this.response.set(null);
    this.failure.set(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    if (raw.amount === null) {
      return;
    }
    const request: CardAuthorizationRequest = {
      cardNumber: raw.cardNumber,
      cardExpiry: raw.cardExpiry,
      amount: raw.amount,
      currency: raw.currency,
      merchantId: raw.merchantId,
      merchantName: raw.merchantName
    };
    this.loading.set(true);
    this.response.set(null);
    this.failure.set(null);
    this.authorizationService.authorize(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => this.response.set(response),
        error: (failure: ApiFailure) => this.failure.set(failure)
      });
  }

  isApproved(): boolean {
    return this.response()?.decision === 'APPROVED';
  }
}
