import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StripeService, Element as StripeElement, ElementsOptions } from 'ngx-stripe';
import { Subscription } from 'rxjs';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.scss']
})
export class CardFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() customerId?: string;
  @Output() saveCard: EventEmitter<string> = new EventEmitter();

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
    private authService: AuthService,
    private paymentService: PaymentService,
    private fb: FormBuilder,
    private stripeService: StripeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    const sub = this.stripeService.elements(this.elementsOptions)
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
          this.card.on('change', (event) => {
            this.invalidCard = !event.complete;
          });
        }
      });
    this.subscription.add(sub);
  }

  submit(uid: string, cid: string) {
    this.isLoading = true;
    const action = cid ? '更新' : '登録';
    this.bar = this.snackBar.open(`カード情報を${action}しています...`);
    if (cid) {
      this.updateCustomer(uid, cid);
    } else {
      this.createCustomer(uid);
    }
  }

  private updateCustomer(uid: string, customerId: string) {
    const name = this.stripeForm.get('name').value;
    const sub = this.stripeService
      .createToken(this.card, { name })
      .subscribe(result => {
        if (result.token) {
          this.paymentService.setCard(uid, result.token.card);
          this.paymentService.updateCustomer({
            customerId,
            source: result.token.id,
            description: name
          }).then(() => {
            this.isLoading = false;
            this.bar.dismiss();
            this.saveCard.emit(customerId);
          }).catch(() => {
            this.saveCard.emit(null);
          });
        } else if (result.error) {
          console.error(result.error.message);
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
          this.paymentService.createCustomer(uid, {
            source: result.token.id,
            email: this.authService.afUser.email,
            description: name
          }).then(cid => {
            this.saveCard.emit();
          }).catch(() => {
            this.saveCard.emit();
          }).finally(() => {
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
