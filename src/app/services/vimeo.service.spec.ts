import { TestBed } from '@angular/core/testing';

import { VimeoService } from './vimeo.service';

describe('VimeoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VimeoService = TestBed.get(VimeoService);
    expect(service).toBeTruthy();
  });
});
