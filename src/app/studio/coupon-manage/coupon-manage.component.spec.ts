import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CouponManageComponent } from './coupon-manage.component';

describe('CouponManageComponent', () => {
  let component: CouponManageComponent;
  let fixture: ComponentFixture<CouponManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
