import { PaymentService } from 'src/app/services/stripe/payment.service';
import { PlanID } from './../../interfaces/plan';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-confirm-unsubscribe-dialog',
  templateUrl: './confirm-unsubscribe-dialog.component.html',
  styleUrls: ['./confirm-unsubscribe-dialog.component.scss'],
})
export class ConfirmUnsubscribeDialogComponent implements OnInit {
  isLoading: boolean;
  form = this.fb.group({
    types: ['', Validators.required],
    detail: [''],
  });

  reasonsTypes = [
    {
      value: 'goal',
      label: '目標達成した',
    },
    {
      value: 'quality',
      label: 'クオリティが低い',
    },
    {
      value: 'volume',
      label: 'コンテンツが少ない',
    },
    {
      value: 'cost',
      label: '料金が高い',
    },
    {
      value: 'reply',
      label: '返信、反応がない、遅い',
    },
    {
      value: 'other',
      label: 'その他',
    },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      uid: string;
      planId: PlanID;
    },
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ConfirmUnsubscribeDialogComponent>
  ) {}

  ngOnInit() {}

  unsubscribe() {
    this.isLoading = true;
    this.paymentService
      .cancelSubscription(this.form.value)
      .then(() => {
        this.snackBar.open('停止しました', null, {
          duration: 2000,
        });
      })
      .catch(() => {
        this.snackBar.open('失敗しました。管理者にお問い合わせください', null, {
          duration: 2000,
        });
      })
      .finally(() => {
        this.dialogRef.close(true);
      });
  }
}
