import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDisconnectStripeDialogComponent } from './confirm-disconnect-stripe-dialog.component';

describe('ConfirmDisconnectStripeDialogComponent', () => {
  let component: ConfirmDisconnectStripeDialogComponent;
  let fixture: ComponentFixture<ConfirmDisconnectStripeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmDisconnectStripeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDisconnectStripeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
