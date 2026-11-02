import { Component, DestroyRef, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { catchError, of, startWith, switchMap } from 'rxjs';
import { AuditService } from '../../core/audit.service';
import { ApiFailure, AuditEntry } from '../../core/models';

@Component({
  selector: 'app-audit',
  imports: [DatePipe, DecimalPipe],
  templateUrl: './audit.component.html',
})
export class AuditComponent {
  private readonly auditService = inject(AuditService);
  private readonly destroyRef = inject(DestroyRef);

  readonly entries = signal<AuditEntry[]>([]);
  readonly failure = signal<ApiFailure | null>(null);
  readonly filter = signal('');

  constructor() {
    interval(15000)
      .pipe(
        startWith(0),
        switchMap(() => this.auditService.list(this.filter()).pipe(
          catchError(() => of(null))
        )),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (entries) => {
          if (entries) {
            this.entries.set(entries);
            this.failure.set(null);
          }
        }
      });
  }

  onFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    this.filter.set(value);
    this.refresh();
  }

  refresh(): void {
    this.auditService.list(this.filter()).subscribe({
      next: (entries) => {
        this.entries.set(entries);
        this.failure.set(null);
      },
      error: (failure: ApiFailure) => this.failure.set(failure)
    });
  }
}
