import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDisconnectStripeDialogComponent } from '../../confirm-disconnect-stripe-dialog/confirm-disconnect-stripe-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  loading = true;
  accountId: string;
  dashboardURL: string;

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private dialog: MatDialog
  ) {
    this.paymentService
      .getStirpeAccountId(this.authService.user.id)
      .pipe(take(1))
      .subscribe(id => {
        if (id) {
          this.accountId = id;
          this.setDashboardURL(id);
        } else {
          this.loading = false;
        }
      });
  }

  ngOnInit() {}

  async setDashboardURL(id: string) {
    this.dashboardURL = (await this.paymentService.getDashboardURL(id)).url;
    this.loading = false;
  }

  async rejectStripe() {
    const stripeUserId = await this.paymentService.getStripeUserId(
      this.authService.user.id
    );

    this.dialog.open(ConfirmDisconnectStripeDialogComponent, {
      autoFocus: false,
      width: '400px',
      data: {
        stripeUserId
      }
    });
  }
}
