import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { finalize } from 'rxjs';
import { AuthorizationService } from '../../core/authorization.service';
import { ApiFailure, CardSnapshot } from '../../core/models';

@Component({
  selector: 'app-card',
  imports: [DecimalPipe],
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {
  private readonly authorizationService = inject(AuthorizationService);

  readonly pans = [
    '4539148803436467',
    '5211000000001234',
    '4111111111111111',
    '4024007196559937',
    '3782822463100051'
  ];

  readonly selectedPan = signal('');
  readonly card = signal<CardSnapshot | null>(null);
  readonly failure = signal<ApiFailure | null>(null);
  readonly loading = signal(false);

  ngOnInit(): void {
    this.select(this.pans[0]);
  }

  select(pan: string): void {
    this.selectedPan.set(pan);
    this.loading.set(true);
    this.failure.set(null);
    this.authorizationService.getCard(pan)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (card) => this.card.set(card),
        error: (failure: ApiFailure) => {
          this.failure.set(failure);
          this.card.set(null);
        }
      });
  }

  mask(pan: string): string {
    return `${pan.slice(0, 4)} ${'•'.repeat(pan.length - 8)} ${pan.slice(-4)}`;
  }
}
