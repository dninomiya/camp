import { PlanID } from './../interfaces/plan';
import { PlanPipe } from './../shared/plan.pipe';
import { User } from './../interfaces/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserPayment } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { Plan } from 'src/app/interfaces/plan';
import { PlanService } from 'src/app/services/plan.service';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [PlanPipe]
})
export class SignupComponent implements OnInit {
  plan$: Observable<Plan> = this.route.queryParamMap.pipe(
    map(queryParamMap => {
      return this.planService.getPlan(queryParamMap.get('planId'));
    }),
    tap(plan => {
      if (!plan) {
        this.router.navigate(['not-found']);
      }
    })
  );

  payment$: Observable<UserPayment> = this.authService.authUser$.pipe(
    switchMap(user => {
      this.user = user;
      this.canceled = user.isCaneclSubscription;
      return this.paymentService.getUserPayment(user.id);
    })
  );

  user$ = this.authService.authUser$;

  user: User;
  isUpgrade: boolean;
  loading: boolean;
  canceled: boolean;
  campaign = this.planService.isCampaign;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private router: Router,
    private planPipe: PlanPipe
  ) {
    combineLatest([this.payment$, this.plan$]).subscribe(([payment, plan]) => {
      if (plan) {
        this.isUpgrade = this.planService.isUpgrade(this.user.plan, plan.id);
      }
    });
  }

  ngOnInit(): void {}

  signUp(planId: PlanID, customerId: string, subscriptionId?: string) {
    const snackBar = this.snackBar.open('プランに登録しています...');

    this.loading = true;

    this.paymentService
      .subscribePlan({
        planId,
        customerId,
        trialUsed: this.user.trialUsed,
        subscriptionId
      })
      .then(() => {
        snackBar.dismiss();
        this.snackBar.open(
          `${this.planPipe.transform(planId)}プランを開始しました`,
          null,
          {
            duration: 2000
          }
        );
        this.router.navigate(['/']);
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
        plan => plan.id === planId
      );
      const oldPlanIndex = this.planService.plans.findIndex(
        plan => plan.id === this.user.plan
      );
      return newPlanIndex > oldPlanIndex ? 'アップグレード' : 'ダウングレード';
    }
  }
}
