import * as functions from 'firebase-functions';
import { addSettlement } from './../utils/add-settlements';
import { db, toTimeStamp } from './../utils/db';

export const paymentSucceeded = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: any, res: any) => {
    console.log(req.body.data.object);
    const data = req.body.data.object;

    console.log(data.lines.data[0].period);

    const payment = await db
      .collectionGroup('private')
      .where('customerId', '==', data.customer)
      .get();

    if (payment.docs[0].ref.parent.parent && data.amount_paid > 0) {
      const userId = payment.docs[0].ref.parent.parent.id;
      const period = data.lines.data[0].period;

      await addSettlement({
        userId,
        title: data.lines.data[0].plan.nickname + 'プラン決済',
        amount: data.amount_paid,
        currentPeriodStart: toTimeStamp(period.start),
        currentPeriodEnd: toTimeStamp(period.end),
        pdf: data.invoice_pdf,
      });

      await db.doc(`users/${userId}`).update({
        isTrial: false,
        currentPeriodStart: toTimeStamp(period.start),
        currentPeriodEnd: toTimeStamp(period.end),
      });
    }

    res.status(200).send(true);
  });
