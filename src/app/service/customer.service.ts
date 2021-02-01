import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { Customer } from '@interfaces/customer';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  customer$: Observable<Customer> = this.afAuth.user.pipe(
    switchMap((user) => {
      return this.db.doc<Customer>(`customers/${user.uid}`).valueChanges();
    })
  );

  constructor(
    private db: AngularFirestore,
    private afAuth: AngularFireAuth,
    private fns: AngularFireFunctions
  ) {}

  async getCustomerPortalLink(): Promise<string> {
    const callable = this.fns.httpsCallable(
      'ext-firestore-stripe-subscriptions-createPortalLink'
    );
    const result: any = await callable({
      returnUrl: location.href,
    }).toPromise();

    return result.url;
  }
}
