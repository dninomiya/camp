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

  @Input() accountId: string;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {}

  connectStripe() {
    const domain = environment.host;

    this.authService.createSCRF({
      uid: this.authService.user.id,
      path: this.router.url
    }).then((id) => {
      const url =  'https://connect.stripe.com/express/oauth/authorize?' +
        `client_id=${environment.stripe.clientId}&` +
        `redirect_uri=${domain}/connect-stripe&` +
        `state=${id}`;

      location.href = url;
    });
  }
}
