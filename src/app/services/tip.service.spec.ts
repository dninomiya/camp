import { TestBed } from '@angular/core/testing';

import { TipService } from './tip.service';

describe('TipService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TipService = TestBed.get(TipService);
    expect(service).toBeTruthy();
  });
});
