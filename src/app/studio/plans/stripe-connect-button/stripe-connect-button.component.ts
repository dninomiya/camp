import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDisconnectStripeDialogComponent } from '../../confirm-disconnect-stripe-dialog/confirm-disconnect-stripe-dialog.component';

@Component({
  selector: 'app-stripe-connect-button',
  templateUrl: './stripe-connect-button.component.html',
  styleUrls: ['./stripe-connect-button.component.scss']
})
export class StripeConnectButtonComponent implements OnInit {

  @Input() isConnected: boolean;

  constructor(
    private paymentService: PaymentService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  connectStripe() {
    const domain = environment.production ? 'update.jp' : 'localhost:4200';

    this.paymentService.createStripeSCRF({
      uid: this.authService.user.id,
      path: this.router.url
    }).then((id) => {
      const url =  'https://dashboard.stripe.com/oauth/authorize?' +
        'response_type=code&' +
        `client_id=${environment.stripe.clientId}&` +
        'scope=read_write&' +
        `redirect_uri=http://${domain}/connect-stripe&` +
        `state=${id}`;

      location.href = url;
    });
  }

  async rejectStripe() {
    const clientId = await this.paymentService.getStripeUserId(
      this.authService.user.id
    );

    this.dialog.open(ConfirmDisconnectStripeDialogComponent, {
      autoFocus: false,
      data: {
        clientId
      }
    });
  }

}
