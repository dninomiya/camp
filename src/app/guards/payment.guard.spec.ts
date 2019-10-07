import { TestBed, async, inject } from '@angular/core/testing';

import { PaymentGuard } from './payment.guard';

describe('PaymentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentGuard]
    });
  });

  it('should ...', inject([PaymentGuard], (guard: PaymentGuard) => {
    expect(guard).toBeTruthy();
  }));
});
