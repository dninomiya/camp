import { FormControl } from '@angular/forms';
import { PaymentService } from 'src/app/services/stripe/payment.service';
import { Component, OnInit } from '@angular/core';
import Stripe from 'stripe';

@Component({
  selector: 'app-coupon-manage',
  templateUrl: './coupon-manage.component.html',
  styleUrls: ['./coupon-manage.component.scss'],
})
export class CouponManageComponent implements OnInit {
  coupons: Stripe.Coupon[];
  couponControl = new FormControl();

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.paymentService.getCoupons().then((coupons) => {
      this.coupons = coupons;
      this.paymentService.getActiveCoupon().then((id) => {
        this.couponControl.setValue(id);
      });
    });
  }

  save() {
    this.paymentService.setCoupon(this.couponControl.value);
  }
}
