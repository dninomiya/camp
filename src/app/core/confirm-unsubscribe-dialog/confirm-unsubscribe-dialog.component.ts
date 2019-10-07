import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Plan } from 'src/app/interfaces/plan';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-unsubscribe-dialog',
  templateUrl: './confirm-unsubscribe-dialog.component.html',
  styleUrls: ['./confirm-unsubscribe-dialog.component.scss']
})
export class ConfirmUnsubscribeDialogComponent implements OnInit {
  isLoading: boolean;
  form = this.fb.group({
    type: ['', Validators.required],
    detail: [''],
  });

  reasonsTypes = [
    {
      value: 'quality',
      label: 'クオリティが低い'
    },
    {
      value: 'reply',
      label: '返信、反応がない'
    },
    {
      value: 'goal',
      label: '目標達成した'
    },
    {
      value: 'other',
      label: 'その他'
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {
      uid: string,
      plan: Plan;
      channelId: string
    },
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ConfirmUnsubscribeDialogComponent>
  ) { }

  ngOnInit() {
  }

  unsubscribe() {
    this.isLoading = true;
    const body = {
      userId: this.data.uid,
      channelId: this.data.channelId,
      planId: this.data.plan.id,
      reason: this.form.value
    };
    this.paymentService.unsubscribePlan(body).then(() => {
      this.snackBar.open('解約しました', null, {
        duration: 2000
      });
      this.dialogRef.close();
    });
  }

}
