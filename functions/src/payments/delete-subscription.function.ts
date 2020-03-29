import { config } from './../config';
import * as functions from 'firebase-functions';
import { db, sendEmail } from '../utils';

export const deleteSubscription = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res: any) => {
    const data = req.body.data.object;

    const payment = await db
      .collectionGroup('private')
      .where('customerId', '==', data.customer)
      .get();

    if (payment.docs[0].ref.parent.parent) {
      const uid = payment.docs[0].ref.parent.parent.id;
      const user: any = (await db.doc(`users/${uid}`).get()).data();

      await sendEmail({
        to: config.adminEmail,
        templateId: 'downgradeToAdmin',
        dynamicTemplateData: {
          plan: 'free'
        }
      });

      await sendEmail({
        to: user.email,
        templateId: 'changePlan',
        dynamicTemplateData: {
          plan: 'free'
        }
      });

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
  });
