import { TestBed, async, inject } from '@angular/core/testing';

import { FrontRunnerAdminGuard } from './front-runner-admin.guard';

describe('FrontRunnerAdminGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FrontRunnerAdminGuard]
    });
  });

  it('should ...', inject([FrontRunnerAdminGuard], (guard: FrontRunnerAdminGuard) => {
    expect(guard).toBeTruthy();
  }));
});
