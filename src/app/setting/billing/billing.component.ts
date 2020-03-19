import { Router } from '@angular/router';
import { PlanService } from 'src/app/services/plan.service';
import { SharedConfirmDialogComponent } from './../../core/shared-confirm-dialog/shared-confirm-dialog.component';
import { Component, OnInit } from '@angular/core';
import { UserPayment } from 'src/app/interfaces/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { CardDialogComponent } from 'src/app/shared/card-dialog/card-dialog.component';
import { switchMap, tap, map } from 'rxjs/operators';
import { PaymentService } from 'src/app/services/payment.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {
  plans = this.planService.plans;
  planSelect = new FormControl('');
  loading = true;
  payment: UserPayment;
  isCardEditor: boolean;
  subs = new Subscription();
  user$ = this.authService.authUser$;
  payment$ = this.user$.pipe(
    switchMap(user => this.paymentService.getUserPayment(user.id)),
    tap(() => {
      this.loadingService.endLoading();
      this.loading = false;
    })
  );
  card$ = this.payment$.pipe(
    map(payment => {
      if (payment) {
        return payment.card;
      } else {
        return null;
      }
    })
  );

  settlements$ = this.paymentService.getSettlements(this.authService.user.id);

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private planService: PlanService,
    private router: Router
  ) {
    this.loadingService.startLoading();

    this.user$.subscribe(user => {
      this.planSelect.patchValue(user.plan, {
        emitEvent: false
      });
    });

    this.planSelect.valueChanges.subscribe(plan => {
      this.router.navigateByUrl('/intl/signup?planId=' + plan);
    });
  }

  ngOnInit() {}

  openCardDialog(customerId = null) {
    this.dialog.open(CardDialogComponent, {
      width: '560px',
      data: customerId
    });
  }
}
