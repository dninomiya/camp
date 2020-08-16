import { TestBed } from '@angular/core/testing';

import { IsaService } from './isa.service';

describe('IsaService', () => {
  let service: IsaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IsaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
