import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import { Customer } from './../interfaces/customer';
import { db } from './../utils/db';

export class StripeService {
  static client = new Stripe(functions.config().stripe.key, {
    apiVersion: '2020-03-02',
  });

  static async getCustomerIdByUid(uid: string): Promise<string | null> {
    if (!uid) {
      return null;
    }
    const doc = await db.doc(`users/${uid}`).get();
    if (doc.exists) {
      return (doc.data() as Customer).stripeId;
    } else {
      return null;
    }
  }

  static async getCampUidByCustomerId(id: string) {
    if (!id) {
      return undefined;
    }

    const payment = await db
      .collectionGroup('private')
      .where('customerId', '==', id)
      .get();

    const uid = payment.docs[0]?.ref?.parent?.parent?.id;

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
    const stripeId = await this.getCustomerIdByUid(uid);

    if (stripeId) {
      return this.client.customers.retrieve(stripeId, {
        expand: ['subscriptions'],
      }) as Promise<Stripe.Customer>;
    } else {
      return null;
    }
  }

  static async getPaymentMethod(
    uid: string
  ): Promise<Stripe.PaymentMethod | null> {
    const stripeId = await this.getCustomerIdByUid(uid);
    if (stripeId) {
      try {
        const result = await this.client.paymentMethods.list({
          customer: stripeId,
          type: 'card',
        });
        return result.data[0];
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }

  static async getSubscriptionId(uid: string): Promise<string | undefined> {
    const stripeCustomer = await this.getStripeCustomer(uid);
    return stripeCustomer?.subscriptions?.data[0]?.id;
  }

  static async getSubscription(
    uid: string
  ): Promise<Stripe.Subscription | undefined> {
    const stripeCustomer = await this.getStripeCustomer(uid);
    return stripeCustomer?.subscriptions?.data[0];
  }

  static async getActivePriceId(uid: string): Promise<string | undefined> {
    const stripeCustomer = await this.getStripeCustomer(uid);
    return stripeCustomer?.subscriptions?.data[0]?.plan?.id;
  }

  static async updateCampCustomer(uid: string, data: any): Promise<any> {
    return db.doc(`users/${uid}/private/payment`).update(data);
  }

  static async deleteCustomerByUid(uid: string): Promise<void> {
    const stripeId = await this.getCustomerIdByUid(uid);
    if (stripeId) {
      await this.client.customers.del(stripeId);
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

  static async charge(uid: string | undefined, priceId: string): Promise<void> {
    if (!priceId) {
      throw new functions.https.HttpsError(
        'data-loss',
        '必要なデータがありません'
      );
    }

    if (!uid) {
      throw new functions.https.HttpsError(
        'permission-denied',
        '認証が必要です'
      );
    }

    const stripeId = await StripeService.getCustomerIdByUid(uid);

    if (!stripeId) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'カスタマーが存在しません'
      );
    }

    try {
      await StripeService.client.invoiceItems.create({
        customer: stripeId,
        price: priceId,
        tax_rates: [functions.config().stripe.tax],
      });

      const params: Stripe.InvoiceCreateParams = {
        customer: stripeId,
      };

      const invoice = await StripeService.client.invoices.create(params);

      await StripeService.client.invoices.pay(invoice.id);
      return;
    } catch (error) {
      throw new functions.https.HttpsError('unauthenticated', error.code);
    }
  }
}
