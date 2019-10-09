import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { User, UserPayment, UserConnect } from '../interfaces/user';
import { Observable, forkJoin, of } from 'rxjs';
import { Plan } from '../interfaces/plan';
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
  ) { }

  setCard(uid: string, card: any): Promise<void> {
    const { address_zip, exp_month, exp_year, last4, brand, id } = card;
    return this.db.doc(`users/${uid}/private/payment`).set({
      card: { address_zip, exp_month, exp_year, last4, brand, id }
    }, {merge: true});
  }

  createCustomer(uid: string, params: {
    source: string,
    email: string,
    description: string,
  }): Promise<void> {
    const callable = this.fns.httpsCallable('createPlatformCustomer');
    return callable(params).toPromise();
  }

  updateCustomer(params: {
    customerId: string
    source: string,
    description: string,
  }): Promise<void> {
    const callable = this.fns.httpsCallable('updatePlatformCustomer');
    return callable(params).toPromise();
  }

  async createAccount(data): Promise<void> {
    const callable = this.fns.httpsCallable('connectStripe');
    return callable(data).toPromise();
  }

  subscribePlan(body: {
    customerId: string,
    planId: string,
    channelId: string
  }): Promise<void> {
    const callable = this.fns.httpsCallable('subscribePlan');
    return callable(body).toPromise();
  }

  async unsubscribePlan(body: {
    userId: string;
    planId: string;
    channelId: string;
    reason: any;
  }): Promise<void> {
    const callable = this.fns.httpsCallable('unsubscribePlan');
    await callable(body);
  }

  getUserPayment(uid: string): Observable<UserPayment> {
    return this.db.doc<UserPayment>(`users/${uid}/private/payment`).valueChanges();
  }

  getStripeUserId(uid: string): Promise<string> {
    return this.db.doc<UserConnect>(`users/${uid}/private/connect`)
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
      ).toPromise();
  }

  isConnected(uid: string): Observable<boolean> {
    return this.db.doc<UserConnect>(`users/${uid}/private/connect`)
      .valueChanges()
      .pipe(
        map(connect => {
          if (connect) {
            return !!connect.stripeUserId;
          } else {
            return false;
          }
        })
      );
  }

  async disconnectStripe(clientId: string): Promise<void> {
    alert(clientId);
    const collable = this.fns.httpsCallable('disconnectStripe');
    return collable({ clientId }).toPromise();
  }

  getSubscriptions(uid: string): Observable<UserSubscription[]> {
    return this.db.collection<UserSubscription>(`users/${uid}/subscriptions`).valueChanges();
  }

  createCharge(params: Omit<Settlement, 'createdAt'>): Promise<void> {
    const collable = this.fns.httpsCallable('chargePlan');
    return collable(params).toPromise();
  }

  checkPurchased(uid: string, contentId: string): Observable<boolean> {
    return this.db.doc<UserSubscription>(`users/${uid}/settlements/${contentId}`)
      .valueChanges().pipe(
        map(purchased => !!purchased),
        take(1)
      );
  }

  getSettlements(uid: string): Observable<Settlement[]> {
    let items;

    return this.db.collection<Settlement>(`users/${uid}/settlements`, ref => {
      return ref.orderBy('createdAt', 'desc');
    }).valueChanges().pipe(
      switchMap(settlements => {
        items = settlements;
        const ids = settlements
          .map(settlement => {
            if (settlement.targetId) {
              return settlement.targetId;
            } else {
              return null;
            }
          }).filter(item => !!item);

        if (ids.length) {
          return forkJoin(
            ids.map(id => this.db.doc<ChannelMeta>(`channels/${id}`).valueChanges().pipe(take(1)))
          );
        } else {
          return of([]);
        }
      }),
      map(channels => {
        return items.map(item => {
          if (item.targetId) {
            item.title = channels.find(channel => channel.id === item.targetId).title;
          } else if (item.lesson) {
            item.title = item.lesson.title;
          }
          return item;
        });
      })
    );
  }

  getReceipt(uid: string, id: string): Observable<Settlement> {
    return this.db.doc<Settlement>(`users/${uid}/settlements/${id}`).valueChanges();
  }
}
