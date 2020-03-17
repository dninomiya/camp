import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { UserPayment, UserConnect, User } from '../interfaces/user';
import { Observable, forkJoin, of } from 'rxjs';
import { map, take, first, switchMap } from 'rxjs/operators';
import { UserSubscription } from '../interfaces/user-subscription';
import { Settlement } from '../interfaces/settlement';
import { ChannelMeta } from '../interfaces/channel';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  constructor(
    private db: AngularFirestore,
    private fns: AngularFireFunctions
  ) {}

  setCard(uid: string, card: any): Promise<void> {
    const { address_zip, exp_month, exp_year, last4, brand, id } = card;
    return this.db.doc(`users/${uid}/private/payment`).set(
      {
        card: { address_zip, exp_month, exp_year, last4, brand, id }
      },
      { merge: true }
    );
  }

  createCustomer(params: {
    source: string;
    email: string;
    description: string;
  }): Promise<void> {
    const callable = this.fns.httpsCallable('createPlatformCustomer');
    return callable(params).toPromise();
  }

  updateCustomer(params: {
    customerId: string;
    source: string;
    description: string;
  }): Promise<void> {
    const callable = this.fns.httpsCallable('updatePlatformCustomer');
    return callable(params).toPromise();
  }

  async createAccount(data): Promise<void> {
    const callable = this.fns.httpsCallable('connectStripe');
    return callable(data).toPromise();
  }

  subscribePlan(data: {
    customerId: string;
    planId: string;
    subscriptionId?: string;
    trialUsed: boolean;
  }): Promise<void> {
    const callable = this.fns.httpsCallable('subscribePlan');
    return callable(data).toPromise();
  }

  deleteSubscription(customerId: string) {
    const callable = this.fns.httpsCallable('deleteSubscription');
    return callable({ customerId }).toPromise();
  }

  async unsubscribePlan(body: {
    userId: string;
    planId: string;
    reason: any;
  }): Promise<void> {
    const callable = this.fns.httpsCallable('unsubscribePlan');
    await callable(body);
  }

  getUserPayment(uid: string): Observable<UserPayment> {
    return this.db
      .doc<UserPayment>(`users/${uid}/private/payment`)
      .valueChanges();
  }

  getStripeUserId(uid: string): Promise<string> {
    return this.db
      .doc<UserConnect>(`users/${uid}/private/connect`)
      .valueChanges()
      .pipe(
        map(connect => {
          if (connect) {
            return connect.stripeUserId;
          } else {
            return null;
          }
        }),
        first()
      )
      .toPromise();
  }

  checkThreadPaymentStatus(
    customerId: string,
    sellerId: string
  ): Observable<{
    customer: boolean;
    seller: boolean;
  }> {
    const callable = this.fns.httpsCallable('checkThreadPaymentStatus');
    return callable({
      customerId,
      sellerId
    });
  }

  getStirpeAccountId(uid: string): Observable<string> {
    return this.db
      .doc<UserConnect>(`users/${uid}/private/connect`)
      .valueChanges()
      .pipe(
        map(connect => {
          if (connect) {
            return connect.stripeUserId;
          } else {
            return null;
          }
        })
      );
  }

  async disconnectStripe(stripeUserId: string): Promise<void> {
    const collable = this.fns.httpsCallable('disconnectStripe');
    return collable({ stripeUserId }).toPromise();
  }

  getSubscriptions(uid: string): Observable<UserSubscription[]> {
    return this.db
      .collection<UserSubscription>(`users/${uid}/subscriptions`)
      .valueChanges();
  }

  createCharge(params: {
    item: {
      id: string;
      path: string;
      title: string;
      body: string;
      amount: number;
      type: string;
    };
    sellerUid: string;
    customerUid: string;
  }): Promise<void> {
    const collable = this.fns.httpsCallable('chargePlan');
    return collable(params).toPromise();
  }

  checkPurchased(uid: string, contentId: string): Observable<boolean> {
    return this.db
      .doc<UserSubscription>(`users/${uid}/settlements/${contentId}`)
      .valueChanges()
      .pipe(
        map(purchased => !!purchased),
        take(1)
      );
  }

  getSettlements(uid: string): Observable<Settlement[]> {
    return this.db
      .collection<Settlement>(`users/${uid}/settlements`, ref => {
        return ref.orderBy('createdAt', 'desc');
      })
      .valueChanges();
  }

  getReceipt(uid: string, id: string): Observable<Settlement> {
    return this.db
      .doc<Settlement>(`users/${uid}/settlements/${id}`)
      .valueChanges();
  }

  getDashboardURL(accountId: string) {
    const collable = this.fns.httpsCallable('getDashboardURL');
    return collable(accountId).toPromise();
  }

  createSubscription(customerId: string): Promise<void> {
    const callable = this.fns.httpsCallable('createSubscription');
    return callable({
      customerId
    }).toPromise();
  }
}
