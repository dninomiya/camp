import { TestBed } from '@angular/core/testing';

import { StripeProductService } from './stripe-product.service';

describe('StripeProductService', () => {
  let service: StripeProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
