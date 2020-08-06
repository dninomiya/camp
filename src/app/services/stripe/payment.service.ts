import { AngularFirestore } from '@angular/fire/firestore';
import { ChargeWithInvoice } from 'src/app/interfaces/charge';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  loadStripe,
  Stripe as StripeClient,
  StripeCardElement,
} from '@stripe/stripe-js';
import Stripe from 'stripe';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(
    private fns: AngularFireFunctions,
    private snackBar: MatSnackBar,
    private db: AngularFirestore
  ) {}

  async getStripeClient(): Promise<StripeClient> {
    return loadStripe(environment.stripe.publicKey);
  }

  private createStripeSetupIntent(params: {
    name: string;
    email: string;
  }): Promise<Stripe.SetupIntent> {
    const callable = this.fns.httpsCallable('createStripeSetupIntent');
    return callable(params).toPromise();
  }

  getPrices(productId: string): Promise<Stripe.Price[]> {
    const callable = this.fns.httpsCallable('getStripePrices');
    return callable(productId).toPromise();
  }

  getProduct(productId: string): Promise<Stripe.Product> {
    const callable = this.fns.httpsCallable('getProduct');
    return callable(productId).toPromise();
  }

  async setPaymemtMethod(
    client: StripeClient,
    card: StripeCardElement,
    name: string,
    email: string
  ): Promise<void> {
    const intent = await this.createStripeSetupIntent({
      name,
      email,
    });
    const { setupIntent, error } = await client.confirmCardSetup(
      intent.client_secret,
      {
        payment_method: {
          card,
          billing_details: {
            name,
            email,
          },
        },
      }
    );
    if (error) {
      throw new Error(error.code);
    } else {
      if (setupIntent.status === 'succeeded') {
        const callable = this.fns.httpsCallable('setStripePaymentMethod');
        return callable({
          paymentMethod: setupIntent.payment_method,
        }).toPromise();
      }
    }
  }

  getPaymentMethod(): Promise<Stripe.PaymentMethod> {
    const callable = this.fns.httpsCallable('getPaymentMethod');
    return callable({}).toPromise();
  }

  async charge(priceId: string, connectedAccountId?: string): Promise<void> {
    const callable = this.fns.httpsCallable('payStripeProduct');
    const process = this.snackBar.open('決済を開始します', null, {
      duration: null,
    });
    return callable({
      priceId,
      connectedAccountId,
    })
      .toPromise()
      .then(() => {
        this.snackBar.open('決済成功');
      })
      .catch((error) => {
        console.error(error?.message);
        this.snackBar.open('決済失敗');
      })
      .finally(() => {
        process.dismiss();
      });
  }

  async createSubscription(params: {
    priceId: string;
    couponId?: string;
    trialUsed?: string;
    subscriptionId?: string;
  }): Promise<void> {
    const callable = this.fns.httpsCallable('createStripeSubscription');
    return callable(params).toPromise();
  }

  restartSubscription(subscriptionId: string) {
    const callable = this.fns.httpsCallable('restartStripeSubscription');
    return callable(subscriptionId).toPromise();
  }

  async cancelSubscription(reason: { types: string[]; detail: string }) {
    const callable = this.fns.httpsCallable('cancelStripeSubscription');
    await callable(reason).toPromise();
  }

  async deleteSubscription(subscriptionId: string) {
    this.snackBar.open('課金を停止しています', null, {
      duration: 2000,
    });
    const callable = this.fns.httpsCallable('deleteSubscription');
    await callable(subscriptionId).toPromise();
    this.snackBar.open('課金を停止しました');
  }

  getCoupons(): Promise<Stripe.Coupon[]> {
    const callable = this.fns.httpsCallable('getAllStripeCoupons');
    return callable({}).toPromise();
  }

  async getInvoices(params?: {
    startingAfter?: string;
    endingBefore?: string;
    stripeAccountId?: string;
  }): Promise<ChargeWithInvoice[]> {
    const callable = this.fns.httpsCallable('getStripeInvoices');
    const result = (await callable(params).toPromise()) as Stripe.ApiList<
      ChargeWithInvoice
    >;
    return result.data;
  }
}
