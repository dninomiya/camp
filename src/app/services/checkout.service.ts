import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { loadStripe } from '@stripe/stripe-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  constructor(private db: AngularFirestore) {}

  async addSession(uid: string, price: string): Promise<void> {
    const ref = await this.db
      .collection('customers')
      .doc(uid)
      .collection('checkout_sessions')
      .add({
        price,
        allow_promotion_codes: true,
        tax_rates: [environment.stripe.taxRate],
        billing_address_collection: 'auto',
        success_url: location.href,
        cancel_url: location.href,
      });

    ref.onSnapshot((snap) => {
      const { error, sessionId } = snap.data();
      console.log(snap.data());
      if (error) {
        return;
      }
      if (sessionId) {
        this.checkout(sessionId);
      }
    });
  }

  async checkout(sessionId: string) {
    if (!sessionId) {
      return;
    }
    const stripe = await loadStripe(environment.stripe.publicKey);
    stripe.redirectToCheckout({ sessionId });
  }
}
