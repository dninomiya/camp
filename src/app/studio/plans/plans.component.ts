import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Plan } from 'src/app/interfaces/plan';
import { Observable } from 'rxjs';
import { PlanService } from 'src/app/services/plan.service';
import { PaymentService } from 'src/app/services/payment.service';
import { tap } from 'rxjs/operators';
import { MatSlideToggleChange, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  stripeAccount$ = this.paymentService
    .getStirpeAccountId(this.authService.user.id)
    .pipe(tap(() => (this.isLoading = false)));
  plans$: Observable<Plan[]> = this.planService.getPlansByChannelId(
    this.authService.user.id
  );

  accountId$: Observable<string> = this.paymentService.getStirpeAccountId(
    this.authService.user.id
  );

  isLoading = true;

  limit = {
    totalLikeCount: 1,
    totalLikedCount: 1,
    publicLessonCount: 1,
    followerCount: 0
  };

  nowStatus;

  constructor(
    private authService: AuthService,
    private planService: PlanService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  changeStatus(plan: Plan, status: MatSlideToggleChange) {
    this.planService
      .updatePlan(this.authService.user.id, {
        ...plan,
        active: status.checked
      })
      .then(() => {
        this.snackBar.open(
          `プランを${status.checked ? '公開' : '非公開'}しました`,
          null,
          {
            duration: 2000
          }
        );
      });
  }
}
