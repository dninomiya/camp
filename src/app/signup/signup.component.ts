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

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  plan$: Observable<Plan> = this.route.queryParamMap.pipe(map(queryParamMap => {
    return this.planService.getPlan(queryParamMap.get('planId'));
  }), tap(plan => {
    if (!plan) {
      this.router.navigate(['not-found']);
    }
  }));
  user: User;

  payment$: Observable<UserPayment> = this.authService.authUser$.pipe(
    switchMap(user => {
      this.user = user;
      return this.paymentService.getUserPayment(user.id);
    })
  );

  isUpgrade: boolean;
  loading: boolean;

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    combineLatest([
      this.payment$,
      this.plan$
    ]).subscribe(([payment, plan]) => {
      this.isUpgrade = this.planService.isUpgrade(payment.planId, plan.id);
    });
  }

  ngOnInit(): void { }

  signUp(planId: string, customerId: string) {
    const snackBar = this.snackBar.open('プランに登録しています...', null, {
      duration: 2000
    });

    this.loading = true;

    this.paymentService.subscribePlan({
      planId,
      customerId
    }).then(() => {
      snackBar.dismiss();
      this.snackBar.open('ライトプランを開始しました', null, {
        duration: 2000
      });
      this.router.navigate(['/']);
    });
  }
}
