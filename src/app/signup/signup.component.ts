import { switchMap, debounceTime, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { PriceWithProduct } from './../interfaces/price';
import { FormBuilder, Validators } from '@angular/forms';
import { LoadingService } from './../services/loading.service';
import { PlanData } from './../interfaces/plan';
import { PaymentService } from './../services/stripe/payment.service';
import { PlanPipe } from './../shared/plan.pipe';
import { User } from './../interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { PlanService } from 'src/app/services/plan.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, NgZone } from '@angular/core';
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
  isLoading: boolean;
  canceled: boolean;
  coupon: Stripe.Coupon;
  customer: Stripe.Customer;
  activePrice: string;
  plan: PlanData;
  planId: string;
  invoiceLoading: boolean;
  invoice: Stripe.Invoice;
  form = this.fb.group({
    price: [[], [Validators.required]],
  });

  get isCouponTarget(): boolean {
    const price: Stripe.Price = this.form.get('price').value[0];
    if (!price) {
      return false;
    }
    return (
      price?.recurring?.interval === 'month' &&
      price?.recurring?.interval_count === 1
    );
  }

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.route.queryParamMap
      .pipe(
        switchMap((queryMap) => {
          this.planId = queryMap.get('planId');
          return this.planService.getProductId(this.planId);
        })
      )
      .subscribe((productId: string) => {
        this.loadingService.startLoading();
        this.paymentService.getPrices(productId).then((prices) => {
          this.prices = prices;
        });

        this.paymentService.getProduct(productId).then((product) => {
          this.product = product;
          this.loadingService.endLoading();
        });

        this.planService.getPlan(this.planId).then((plan) => {
          this.plan = plan;
        });

        this.paymentService.getActivePriceId().then((priceId) => {
          this.activePrice = priceId;
        });
      });

    this.getMethod();

    if (!this.authService.user.plan || this.authService.user.plan === 'free') {
      this.paymentService.getActiveCoupon().then((id) => {
        if (id) {
          this.paymentService.getCoupon(id).then((coupon) => {
            this.coupon = coupon;
          });
        }
      });
    }
  }

  ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        tap(() => (this.invoiceLoading = true)),
        debounceTime(1000),
        switchMap((value) => {
          this.invoiceLoading = true;
          return this.paymentService.getStripeRetrieveUpcoming(
            value.price[0].id,
            this.isCouponTarget && this.coupon?.id
          );
        })
      )
      .subscribe((invoice) => {
        this.ngZone.run(() => {
          this.invoiceLoading = false;
          this.invoice = invoice;
        });
      });
  }

  getMethod() {
    this.paymentService
      .getPaymentMethod()
      .then((method) => (this.method = method));
  }

  createSubscription() {
    const snackBar = this.snackBar.open('プランに登録しています...', null, {
      duration: null,
    });

    this.isLoading = true;
    this.paymentService
      .createSubscription({
        priceId: this.form.value.price[0].id,
        couponId: this.isCouponTarget && this.coupon?.id,
        planId: this.planId,
      })
      .then(() => {
        snackBar.dismiss();
        this.snackBar.open(`${this.plan.name}プランを開始しました`);
        this.router.navigate(['/mypage']);
      })
      .catch((error) => {
        this.snackBar.open('エラーが発生しました');
        console.error(error);
      })
      .finally(() => (this.isLoading = false));
  }
}
