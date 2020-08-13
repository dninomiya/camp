import { environment } from 'src/environments/environment';
import { PriceWithProduct } from './../interfaces/price';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from './../services/loading.service';
import { PLAN } from './../services/plan.service';
import { Plan } from './../interfaces/plan';
import { PaymentService } from './../services/stripe/payment.service';
import { PlanPipe } from './../shared/plan.pipe';
import { User } from './../interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { PlanService } from 'src/app/services/plan.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import Stripe from 'stripe';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [PlanPipe],
})
export class SignupComponent implements OnInit {
  product: Stripe.Product;
  prices: PriceWithProduct[];
  user$ = this.authService.authUser$;
  user: User;
  isUpgrade: boolean;
  method: Stripe.PaymentMethod;
  loading: boolean;
  canceled: boolean;
  coupon: Stripe.Coupon;
  campaign = this.planService.isCampaign;
  customer: Stripe.Customer;
  activePrice: string;
  plan: Omit<Plan, 'id'>;
  planId: string;
  form = this.fb.group({
    price: [[], [Validators.required]],
  });

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.route.queryParamMap.subscribe((queryMap) => {
      this.loadingService.startLoading();
      this.planId = queryMap.get('planId');
      const productId = environment.stripe.product[this.planId].id;

      this.paymentService.getPrices(productId).then((prices) => {
        this.prices = prices;
      });

      this.paymentService.getProduct(productId).then((product) => {
        this.product = product;
        this.loadingService.endLoading();
      });

      this.plan = PLAN[this.planId];

      this.paymentService.getActivePriceId().then((priceId) => {
        console.log(priceId);
        this.activePrice = priceId;
      });
    });

    this.getMethod();

    this.paymentService
      .getCoupon(environment.stripe.campaignCoupon)
      .then((coupon) => (this.coupon = coupon));
  }

  ngOnInit(): void {}

  getMethod() {
    this.paymentService
      .getPaymentMethod()
      .then((method) => (this.method = method));
  }

  createSubscription() {
    const snackBar = this.snackBar.open('プランに登録しています...');

    this.loading = true;

    this.paymentService
      .createSubscription({
        priceId: this.form.value.price[0].id,
        couponId: this.coupon?.id,
        planId: this.planId,
      })
      .then(() => {
        snackBar.dismiss();
        this.snackBar.open(`${this.plan.title}プランを開始しました`, null, {
          duration: 2000,
        });
        this.router.navigate(['/mypage']);
      });
  }

  getSignUpLabel(planId: string): string {
    if (!this.user) {
      return '';
    }

    if (!this.user.plan || this.user.plan === 'free') {
      return (this.user.trialUsed ? '' : '無料で') + 'はじめる';
    } else {
      const newPlanIndex = this.planService.plans.findIndex(
        (plan) => plan.id === planId
      );
      const oldPlanIndex = this.planService.plans.findIndex(
        (plan) => plan.id === this.user.plan
      );
      return newPlanIndex > oldPlanIndex ? 'アップグレード' : 'ダウングレード';
    }
  }
}
