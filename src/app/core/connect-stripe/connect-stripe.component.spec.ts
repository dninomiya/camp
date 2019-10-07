import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectStripeComponent } from './connect-stripe.component';

describe('ConnectStripeComponent', () => {
  let component: ConnectStripeComponent;
  let fixture: ComponentFixture<ConnectStripeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectStripeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectStripeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
