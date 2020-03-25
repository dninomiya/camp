import * as functions from 'firebase-functions';
import { addSettlement } from './../utils/add-settlements';
import { db } from './../utils/db';

export const paymentSucceeded = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res: any) => {
    const data = req.body.data.object;

    const payment = await db
      .collectionGroup('private')
      .where('customerId', '==', data.customer)
      .get();

    if (payment.docs[0].ref.parent.parent && data.amount_paid > 0) {
      await addSettlement({
        userId: payment.docs[0].ref.parent.parent.id,
        title: data.lines.data[0].plan.nickname + 'プラン決済',
        amount: data.amount_paid,
        currentPeriodStart: data.period_start,
        currentPeriodEnd: data.period_end
      });
    }

    res.send(true);
  });
