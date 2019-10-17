import { Component, OnInit } from '@angular/core';
import { UserPayment } from 'src/app/interfaces/user';
import { Subscription, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CardDialogComponent } from 'src/app/shared/card-dialog/card-dialog.component';
import { switchMap, tap, map } from 'rxjs/operators';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

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
  card$ = this.payment$.pipe(map(payment => {
    if (payment) {
      return payment.card;
    } else {
      return null;
    }
  }));

  settlements$ = this.paymentService.getSettlements(
    this.authService.user.id
  );

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private loadingService: LoadingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.loadingService.startLoading();
  }

  ngOnInit() {
  }

  openCardDialog(customerId?: string) {
    this.dialog.open(CardDialogComponent, {
      width: '560px',
      autoFocus: true,
      data: {
        customerId
      }
    });
  }

}
