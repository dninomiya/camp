import * as functions from 'firebase-functions';
import { db } from '../utils';

export const deleteSubscription = functions.https.onRequest(
  async (req: any, res: any) => {
    const data = req.body.data.object;

    const payment = await db
      .collectionGroup('private')
      .where('customerId', '==', data.customer)
      .get();

    if (payment.docs[0].ref.parent.parent) {
      const uid = payment.docs[0].ref.parent.parent.id;
      await db.doc(`users/${uid}`).update({
        plan: 'free',
        currentPeriodStart: null,
        currentPeriodEnd: null,
        isCaneclSubscription: false
      });
      await db.doc(`users/${uid}/payment`).update({
        subscriptionId: null
      });
    }

    res.send(true);
  }
);
