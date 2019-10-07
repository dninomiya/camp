import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Plan } from 'src/app/interfaces/plan';
import { PaymentService } from 'src/app/services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-subscribe-dialog',
  templateUrl: './confirm-subscribe-dialog.component.html',
  styleUrls: ['./confirm-subscribe-dialog.component.scss']
})
export class ConfirmSubscribeDialogComponent implements OnInit {

  isLoading: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {
      customerId: string,
      plan: Plan,
      channelId: string
    },
    private paymentService: PaymentService,
    private dialogRef: MatDialogRef<ConfirmSubscribeDialogComponent>,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  subscribe() {
    this.isLoading = true;
    this.paymentService.subscribePlan({
      customerId: this.data.customerId,
      planId: this.data.plan.id,
      channelId: this.data.channelId
    }).then(() => {
      this.dialogRef.close(true);
      this.snackBar.open(`プランに登録しました`, null, {
        duration: 2000
      });
    });
  }

}
