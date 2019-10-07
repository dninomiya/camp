import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumDialogComponent } from './premium-dialog.component';

describe('PremiumDialogComponent', () => {
  let component: PremiumDialogComponent;
  let fixture: ComponentFixture<PremiumDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
