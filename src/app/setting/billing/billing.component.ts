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
  plans = ['free', 'lite', 'standard', 'isa'];
  planSelect = new FormControl('');
  loading = true;
  defaultPlan: string;
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
    private dialog: MatDialog
  ) {
    this.loadingService.startLoading();

    this.user$.subscribe(user => {
      this.defaultPlan = user.plan;
      this.planSelect.patchValue(user.plan);
    });

    this.planSelect.valueChanges.subscribe(plan => {
      this.dialog.open(SharedConfirmDialogComponent);
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
