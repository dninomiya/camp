import { CardDialogComponent } from 'src/app/shared/card-dialog/card-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoadingService } from 'src/app/services/loading.service';
import { switchMap, tap, map } from 'rxjs/operators';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss']
})
export class CreditCardComponent implements OnInit {
  loading = true;
  user$ = this.authService.authUser$;
  payment$ = this.user$.pipe(
    switchMap(user => this.paymentService.getUserPayment(user.id)),
    tap(payment => {
      console.log(payment);
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

  constructor(
    private loadingService: LoadingService,
    private authService: AuthService,
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  openCardDialog(customerId = null) {
    this.dialog.open(CardDialogComponent, {
      width: '560px',
      data: customerId
    });
  }

}
