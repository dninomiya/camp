import * as functions from 'firebase-functions';
import { db, toTimeStamp } from './../utils/db';

export const paymentSucceeded = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res: any) => {
    functions.logger.info(req.body.data.object);
    const data = req.body.data.object;
    const payment = await db
      .collectionGroup('private')
      .where('customerId', '==', data.customer)
      .get();

    if (payment.docs[0].ref.parent.parent && data.amount_paid > 0) {
      const userId = payment.docs[0].ref.parent.parent.id;
      const period = data.lines.data[0].period;

      await db.doc(`users/${userId}`).update({
        isTrial: false,
        currentPeriodStart: toTimeStamp(period.start),
        currentPeriodEnd: toTimeStamp(period.end),
      });
    }

    res.status(200).send(true);
  });
