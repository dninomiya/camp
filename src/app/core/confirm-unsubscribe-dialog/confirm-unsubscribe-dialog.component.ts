import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PaymentService } from 'src/app/services/payment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-unsubscribe-dialog',
  templateUrl: './confirm-unsubscribe-dialog.component.html',
  styleUrls: ['./confirm-unsubscribe-dialog.component.scss']
})
export class ConfirmUnsubscribeDialogComponent implements OnInit {
  isLoading: boolean;
  form = this.fb.group({
    types: ['', Validators.required],
    detail: ['']
  });

  reasonsTypes = [
    {
      value: 'goal',
      label: '目標達成した'
    },
    {
      value: 'quality',
      label: 'クオリティが低い'
    },
    {
      value: 'volume',
      label: 'コンテンツが少ない'
    },
    {
      value: 'cost',
      label: '料金が高い'
    },
    {
      value: 'reply',
      label: '返信、反応がない、遅い'
    },
    {
      value: 'other',
      label: 'その他'
    }
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      uid: string;
      planId: string;
    },
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ConfirmUnsubscribeDialogComponent>
  ) {}

  ngOnInit() {}

  unsubscribe() {
    this.isLoading = true;
    const body = {
      userId: this.data.uid,
      planId: this.data.planId,
      reason: this.form.value
    };
    this.paymentService.unsubscribePlan(body).then(() => {
      this.snackBar.open('解約しました', null, {
        duration: 2000
      });
      this.dialogRef.close(true);
    });
  }
}
