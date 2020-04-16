import { take } from 'rxjs/operators';
import { Component, OnInit, Inject, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';
import {
  StripeService,
  Element as StripeElement,
  ElementsOptions,
} from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styleUrls: ['./card-dialog.component.scss'],
})
export class CardDialogComponent implements OnInit, AfterViewInit {
  isEdit: boolean;
  user$ = this.authService.authUser$;
  card: StripeElement;
  stripeForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
  });
  isLoading = false;
  elementsOptions: ElementsOptions = {
    locale: 'ja',
  };
  invalidCard = true;
  bar: MatSnackBarRef<SimpleSnackBar>;

  get invalid() {
    return this.invalidCard || this.stripeForm.invalid;
  }

  constructor(
    public dialogRef: MatDialogRef<CardDialogComponent>,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    @Inject(MAT_DIALOG_DATA) public customerId?: string
  ) {}

  ngOnInit() {
    this.isEdit = !!this.customerId;
  }

  ngAfterViewInit() {
    this.stripeService
      .elements(this.elementsOptions)
      .pipe(take(1))
      .subscribe((elements) => {
        if (!this.card) {
          this.card = elements.create('card', {
            style: {
              base: {
                iconColor: '#666EE8',
                color: '#000',
                lineHeight: '40px',
                fontWeight: 300,
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSize: '16px',
                '::placeholder': {
                  color: '#CFD7E0',
                },
              },
            },
          });
          this.card.mount('#card-element');
          this.card.on('change', (event) => {
            this.invalidCard = !event.complete;
          });
        }
      });
  }

  submit() {
    this.isLoading = true;
    const action = this.customerId ? '更新' : '登録';
    this.bar = this.snackBar.open(`カード情報を${action}しています...`);
    if (this.customerId) {
      this.updateCustomer(this.customerId);
    } else {
      this.updateCustomer();
    }
  }

  private updateCustomer(customerId?: string) {
    const name = this.stripeForm.get('name').value;
    this.stripeService
      .createToken(this.card, { name })
      .pipe(take(1))
      .subscribe((result) => {
        if (result.token) {
          let request;

          if (customerId) {
            request = this.paymentService.updateCustomer({
              customerId,
              source: result.token.id,
              card: result.token.card,
              description: name,
            });
          } else {
            request = this.paymentService.createCustomer({
              source: result.token.id,
              email: this.authService.afUser.email,
              card: result.token.card,
              description: name,
            });
          }

          request
            .then(() => this.onSuccess())
            .catch((error) => this.onError(error))
            .finally(() => {
              this.bar.dismiss();
              this.isLoading = false;
            });
        } else if (result.error) {
          this.bar.dismiss();
          this.isLoading = false;
          this.onError(result.error);
        }
      });
  }

  private onSuccess() {
    this.dialogRef.close(true);
    this.snackBar.open(
      `カードを${this.isEdit ? '変更' : '作成'}しました`,
      null,
      {
        duration: 2000,
      }
    );
  }

  private onError(error: any) {
    console.error(error);
    this.snackBar.open('カード情報が不正です', null, {
      duration: 2000,
    });
  }
}
