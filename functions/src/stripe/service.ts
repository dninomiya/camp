import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import { Customer } from './../interfaces/customer';
import { db } from './../utils/db';

export class StripeService {
  static client = new Stripe(functions.config().stripe.key, {
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

  static async getCampUidByCustomerId(id: string) {
    const payment = await db
      .collectionGroup('private')
      .where('customerId', '==', id)
      .get();

    const uid = payment.docs[0].ref.parent.parent?.id;

    if (uid) {
      return uid;
    } else {
      return undefined;
    }
  }

  static async getProductByPrice(id: string): Promise<Stripe.Product> {
    const price = await this.client.prices.retrieve(id, {
      expand: ['product'],
    });
    return price.product as Stripe.Product;
  }

  static async getStripeCustomer(uid: string): Promise<Stripe.Customer | null> {
    const campCustomer = await this.getCampCustomer(uid);

    if (campCustomer) {
      return this.client.customers.retrieve(campCustomer.customerId, {
        expand: ['subscriptions'],
      }) as Promise<Stripe.Customer>;
    } else {
      return null;
    }
  }

  static async getPaymentMethod(
    uid: string
  ): Promise<Stripe.PaymentMethod | null> {
    const customer = await this.getCampCustomer(uid);
    if (customer?.customerId) {
      const result = await this.client.paymentMethods.list({
        customer: customer.customerId,
        type: 'card',
      });
      return result.data[0];
    } else {
      return null;
    }
  }

  static async getSubscriptionId(uid: string): Promise<string | undefined> {
    const stripeCustomer = await this.getStripeCustomer(uid);
    return stripeCustomer?.subscriptions?.data[0]?.id;
  }

  static async getActivePriceId(uid: string): Promise<string | undefined> {
    const stripeCustomer = await this.getStripeCustomer(uid);
    return stripeCustomer?.subscriptions?.data[0]?.plan?.id;
  }

  static async updateCampCustomer(uid: string, data: any): Promise<any> {
    return db.doc(`users/${uid}/private/payment`).update(data);
  }

  static async deleteCustomerByUid(uid: string): Promise<void> {
    const customer = await this.getCampCustomer(uid);
    if (customer) {
      await this.client.customers.del(customer.customerId);
    }
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
