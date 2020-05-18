import * as functions from 'firebase-functions';
import { config } from './../config';
import { db, sendEmail } from '../utils';

export const deleteSubscription = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res: any) => {
    const data = req.body.data.object;
    console.log(data);

    const payment = await db
      .collectionGroup('private')
      .where('customerId', '==', data.customer)
      .get();

    console.log(payment);

    if (payment.docs[0] && payment.docs[0].ref.parent.parent) {
      const uid = payment.docs[0].ref.parent.parent.id;
      const user: any = (await db.doc(`users/${uid}`).get()).data();

      await db.doc(`users/${uid}`).update({
        plan: 'free',
        currentPeriodStart: null,
        currentPeriodEnd: null,
        isCaneclSubscription: false,
      });

      await db.doc(`users/${uid}/private/payment`).update({
        subscriptionId: null,
      });

      await sendEmail({
        to: config.adminEmail,
        templateId: 'downgradeToAdmin',
        dynamicTemplateData: {
          name: user.name,
          oldPlan: user.plan,
          newPlan: 'フリー',
        },
      });

      await sendEmail({
        to: user.email,
        templateId: 'changePlan',
        dynamicTemplateData: {
          plan: 'フリー',
        },
      });
    }

    res.status(200).send(true);
  });
