import { PaymentService } from './../services/stripe/payment.service';
import { CardDialogComponent } from 'src/app/shared/card-dialog/card-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import Stripe from 'stripe';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
})
export class CreditCardComponent implements OnInit {
  @Output() private update = new EventEmitter();

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
        autoFocus: false,
        restoreFocus: false,
      })
      .afterClosed()
      .subscribe((reflesh) => {
        if (reflesh) {
          this.getPaymentMethod();
          this.update.emit(true);
        }
      });
  }
}
