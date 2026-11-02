import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'checkout' },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'FinCard POS · Checkout'
  },
  {
    path: 'audit',
    loadComponent: () => import('./features/audit/audit.component').then(m => m.AuditComponent),
    title: 'FinCard POS · Auditoría'
  },
  {
    path: 'card',
    loadComponent: () => import('./features/card/card.component').then(m => m.CardComponent),
    title: 'FinCard POS · Tarjeta'
  },
  { path: '**', redirectTo: 'checkout' }
];
