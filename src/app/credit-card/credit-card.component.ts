import { PaymentService } from './../services/stripe/payment.service';
import { CardDialogComponent } from 'src/app/shared/card-dialog/card-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit } from '@angular/core';
import Stripe from 'stripe';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
})
export class CreditCardComponent implements OnInit {
  loading = true;
  user$ = this.authService.authUser$;
  method: Stripe.PaymentMethod;

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) {
    this.getPaymentMethod();
  }

  private getPaymentMethod() {
    this.paymentService
      .getPaymentMethod()
      .then((method) => {
        this.method = method;
      })
      .finally(() => {
        this.loading = false;
      });
  }

  ngOnInit(): void {}

  openCardDialog() {
    this.dialog
      .open(CardDialogComponent, {
        width: '560px',
        data: this.method,
        minHeight: '400px',
        autoFocus: false,
        restoreFocus: false,
      })
      .afterClosed()
      .subscribe((reflesh) => {
        if (reflesh) {
          this.getPaymentMethod();
        }
      });
  }
}
