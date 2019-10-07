import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripeConnectButtonComponent } from './stripe-connect-button.component';

describe('StripeConnectButtonComponent', () => {
  let component: StripeConnectButtonComponent;
  let fixture: ComponentFixture<StripeConnectButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripeConnectButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripeConnectButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
