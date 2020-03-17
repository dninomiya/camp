import { ConfirmUnsubscribeDialogComponent } from './../core/confirm-unsubscribe-dialog/confirm-unsubscribe-dialog.component';
import { PlanPipe } from './../shared/plan.pipe';
import { SharedConfirmDialogComponent } from './../core/shared-confirm-dialog/shared-confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
import { formatDate } from '@angular/common';

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
      return this.paymentService.getUserPayment(user.id);
    })
  );

  user: User;
  isUpgrade: boolean;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog,
    private planPipe: PlanPipe
  ) {
    combineLatest([this.payment$, this.plan$]).subscribe(([payment, plan]) => {
      this.isUpgrade = this.planService.isUpgrade(payment.planId, plan.id);
    });
  }

  ngOnInit(): void {}

  signUp(planId: string, customerId: string) {
    const snackBar = this.snackBar.open('プランに登録しています...', null, {
      duration: 2000
    });

    this.loading = true;

    this.paymentService
      .subscribePlan({
        planId,
        customerId,
        trialUsed: this.user.trialUsed
      })
      .then(() => {
        snackBar.dismiss();
        this.snackBar.open('ライトプランを開始しました', null, {
          duration: 2000
        });
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

  openUnsubscribeDialog() {
    this.dialog
      .open(SharedConfirmDialogComponent, {
        data: {
          title: '自動更新を停止しますか？',
          description:
            '自動更新を停止すると' +
            formatDate(
              new Date(this.user.currentPeriodEnd * 1000),
              'yyyy年MM月dd日',
              'ja'
            ) +
            '以降フリープランになります。それまでは引き続き' +
            this.planPipe.transform(this.user.plan) +
            'プランをご利用いただけます。'
        }
      })
      .afterClosed()
      .subscribe(status => {
        if (status) {
          this.dialog.open(ConfirmUnsubscribeDialogComponent, {
            data: {
              uid: this.user.id,
              planId: this.user.plan
            }
          });
        }
      });
  }
}
