import {
  Component,
  OnInit,
  Inject,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
  MatSnackBar,
  MatSnackBarRef,
  SimpleSnackBar
} from '@angular/material/snack-bar';
import {
  StripeService,
  Element as StripeElement,
  ElementsOptions
} from 'ngx-stripe';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentService } from 'src/app/services/payment.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styleUrls: ['./card-dialog.component.scss']
})
export class CardDialogComponent implements OnInit, OnDestroy, AfterViewInit {
  isEdit: boolean;

  user$ = this.authService.authUser$;
  card: StripeElement;
  stripeForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]]
  });
  isLoading = false;
  elementsOptions: ElementsOptions = {
    locale: 'ja'
  };
  subscription = new Subscription();
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
  ) { }

  ngOnInit() {
    this.isEdit = !!this.customerId;
  }

  ngAfterViewInit() {
    const sub = this.stripeService
      .elements(this.elementsOptions)
      .subscribe(elements => {
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
                  color: '#CFD7E0'
                }
              }
            }
          });
          this.card.mount('#card-element');
          this.card.on('change', event => {
            this.invalidCard = !event.complete;
          });
        }
      });
    this.subscription.add(sub);
  }

  submit() {
    this.isLoading = true;
    const action = this.customerId ? '更新' : '登録';
    this.bar = this.snackBar.open(`カード情報を${action}しています...`);
    if (this.customerId) {
      this.updateCustomer(this.authService.user.id, this.customerId);
    } else {
      this.createCustomer(this.authService.user.id);
    }
  }

  private updateCustomer(uid: string, customerId: string) {
    const name = this.stripeForm.get('name').value;
    const sub = this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          this.paymentService.setCard(uid, result.token.card);
          this.paymentService
            .updateCustomer({
              customerId,
              source: result.token.id,
              description: name
            })
            .then(() => {
              this.isLoading = false;
              this.bar.dismiss();
              this.saved();
            })
            .catch(() => {
              this.saved();
            });
        } else if (result.error) {
          this.snackBar.open(result.error.message, null, {
            duration: 2000
          });
          this.isLoading = false;
        }
      });

    this.subscription.add(sub);
  }

  private createCustomer(uid: string) {
    const name = this.stripeForm.get('name').value;
    const sub = this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          this.paymentService.setCard(uid, result.token.card);
          this.paymentService
            .createCustomer({
              source: result.token.id,
              email: this.authService.afUser.email,
              description: name
            })
            .then(() => {
              this.saved();
            })
            .catch(error => {
              console.log(error);
              this.saved();
            })
            .finally(() => {
              this.isLoading = false;
              this.bar.dismiss();
            });
        } else if (result.error) {
          console.error(result.error.message);
          this.isLoading = false;
          this.bar.dismiss();
          this.snackBar.open('カード情報が不正です', null, {
            duration: 2000
          });
        }
      });
    this.subscription.add(sub);
  }

  saved() {
    this.dialogRef.close(true);
    this.snackBar.open(
      `カードを${this.isEdit ? '変更' : '作成'}しました`,
      null,
      {
        duration: 2000
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
