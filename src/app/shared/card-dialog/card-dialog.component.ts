import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/stripe/payment.service';
import Stripe from 'stripe';
import { StripeCardElement, Stripe as StripeClient } from '@stripe/stripe-js';

@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styleUrls: ['./card-dialog.component.scss'],
})
export class CardDialogComponent implements OnInit {
  loading = true;
  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(60)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(254)],
    ],
  });
  isComplete: boolean;
  cardElement: StripeCardElement;
  methods: Stripe.PaymentMethod[];
  inProgress: boolean;
  stripeClient: StripeClient;

  constructor(
    public dialogRef: MatDialogRef<CardDialogComponent>,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    public paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getCard();
  }

  /**
   * カード一覧を取得
   */
  getCard() {
    this.paymentService.getPaymentMethod().then((method) => {
      if (method) {
        this.setCardToForm(method);
      }
      this.loading = false;
    });
  }

  async buildForm() {
    this.stripeClient = await this.paymentService.getStripeClient();
    const elements = this.stripeClient.elements();
    this.cardElement = elements.create('card');
    this.cardElement.mount('#card-element');
    this.cardElement.on(
      'change',
      (event) => (this.isComplete = event.complete)
    );
  }

  /**
   * カードを作成
   */
  saveCard() {
    if (this.form.valid) {
      this.inProgress = true;
      this.snackBar.open('カードを登録しています', null, {
        duration: null,
      });
      this.paymentService
        .setPaymemtMethod(
          this.stripeClient,
          this.cardElement,
          this.form.value.name,
          this.form.value.email
        )
        .then(() => {
          this.snackBar.open('カードを登録しました');
          this.dialogRef.close(true);
        })
        .catch((error: Error) => {
          console.error(error.message);
          switch (error.message) {
            case 'expired_card':
              this.snackBar.open('カードの有効期限が切れています');
              break;
            default:
              this.snackBar.open('登録に失敗しました');
          }
        })
        .finally(() => {
          this.inProgress = false;
        });
    }
  }

  /**
   * 編集するカードをフォームの初期値にセット
   */
  private setCardToForm(paymentMethod: Stripe.PaymentMethod) {
    this.form.patchValue({
      name: paymentMethod.billing_details.name,
      email: paymentMethod.billing_details.email,
    });
  }
}
