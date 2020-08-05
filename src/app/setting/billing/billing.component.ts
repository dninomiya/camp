import { ChargeWithInvoice } from 'src/app/interfaces/charge';
import { PaymentService } from 'src/app/services/stripe/payment.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingService } from 'src/app/services/loading.service';
import { MatDialog } from '@angular/material/dialog';
import { CardDialogComponent } from 'src/app/shared/card-dialog/card-dialog.component';
import Stripe from 'stripe';

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
})
export class BillingComponent implements OnInit {
  loading = true;
  user$ = this.authService.authUser$;
  method: Stripe.PaymentMethod;
  invoices: ChargeWithInvoice[];

  constructor(
    private authService: AuthService,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private paymentService: PaymentService
  ) {
    this.loadingService.startLoading();

    this.paymentService
      .getPaymentMethod()
      .then((method) => {
        this.method = method;
      })
      .catch(() => {
        console.log('error');
      })
      .finally(() => {
        this.loadingService.endLoading();
        this.loading = false;
      });

    this.paymentService
      .getInvoices()
      .then((invoices) => (this.invoices = invoices));
  }

  ngOnInit() {}

  openCardDialog(customerId = null) {
    this.dialog.open(CardDialogComponent, {
      width: '560px',
      data: customerId,
    });
  }
}
