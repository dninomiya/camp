import * as functions from 'firebase-functions';
import Stripe from 'stripe';
export const stripe = new Stripe(functions.config().stripe.secret, {
  apiVersion: '2020-03-02',
});
import { Customer } from './../interfaces/customer';
import { db } from './../utils/db';

export class StripeService {
  static client = new Stripe(functions.config().stripe.secret, {
    apiVersion: '2020-03-02',
  });

  static async getCampCustomer(uid: string): Promise<Customer | null> {
    const doc = await db.doc(`users/${uid}/private/payment`).get();
    if (doc.exists) {
      return doc.data() as Customer;
    } else {
      return null;
    }
  }

  static async updateCampCustomer(uid: string, data: any): Promise<any> {
    return db.doc(`users/${uid}/private/payment`).update(data);
  }

  static async createStripeCustomer(data: {
    name: string;
    email: string;
  }): Promise<string> {
    const customer = await this.client.customers.create({
      name: data.name,
      email: data.email,
    });
    return customer.id;
  }
}
