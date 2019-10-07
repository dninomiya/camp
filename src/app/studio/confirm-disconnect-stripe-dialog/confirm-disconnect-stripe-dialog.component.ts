import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-disconnect-stripe-dialog',
  templateUrl: './confirm-disconnect-stripe-dialog.component.html',
  styleUrls: ['./confirm-disconnect-stripe-dialog.component.scss']
})
export class ConfirmDisconnectStripeDialogComponent implements OnInit {

  constructor(
    private dialog: MatDialogRef<ConfirmDisconnectStripeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      clientId: string;
    },
    private paymentService: PaymentService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  disconnect() {
    this.paymentService.disconnectStripe(this.data.clientId).then(() => {
      this.snackBar.open('連携を解除しました', null, {
        duration: 2000
      });
    });
  }

}
