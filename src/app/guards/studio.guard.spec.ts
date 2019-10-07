import { TestBed, async, inject } from '@angular/core/testing';

import { StudioGuard } from './studio.guard';

describe('StudioGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StudioGuard]
    });
  });

  it('should ...', inject([StudioGuard], (guard: StudioGuard) => {
    expect(guard).toBeTruthy();
  }));
});
