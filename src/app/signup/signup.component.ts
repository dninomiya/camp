import { PaymentService } from './../services/stripe/payment.service';
import { PlanPipe } from './../shared/plan.pipe';
import { User } from './../interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';
import { Plan } from 'src/app/interfaces/plan';
import { PlanService } from 'src/app/services/plan.service';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  plan$: Observable<Plan> = this.route.queryParamMap.pipe(
    map((queryParamMap) => {
      return this.planService.getPlan(queryParamMap.get('planId'));
    }),
    tap((plan) => {
      if (!plan) {
        this.router.navigate(['not-found']);
      }
    })
  );

  prices: Stripe.Price[];
  user$ = this.authService.authUser$;
  user: User;
  isUpgrade: boolean;
  loading: boolean;
  canceled: boolean;
  campaign = this.planService.isCampaign;
  customer: Stripe.Customer;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.plan$.subscribe((plan) => {
      if (plan) {
        this.isUpgrade = this.planService.isUpgrade(this.user.plan, plan.id);
      }
    });

    this.route.queryParamMap.subscribe((queryMap) => {
      const productId = queryMap.get('id');
      this.paymentService.getPrices(productId).then((prices) => {
        this.prices = prices;
      });
    });
  }

  ngOnInit(): void {}

  signUp() {
    const snackBar = this.snackBar.open('プランに登録しています...');

    this.loading = true;

    // this.paymentService
    //   .createSubscription({
    //     priceId,
    //     couponId,
    //     trialUsed: this.user.trialUsed,
    //     subscriptionId,
    //   })
    //   .then(() => {
    //     snackBar.dismiss();
    //     this.snackBar.open(
    //       `${this.planPipe.transform(planId)}プランを開始しました`,
    //       null,
    //       {
    //         duration: 2000,
    //       }
    //     );
    //     this.router.navigate(['/mypage']);
    //   });
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
