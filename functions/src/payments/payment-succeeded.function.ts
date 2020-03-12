import * as functions from 'firebase-functions';
import { addSettlement } from './../utils/add-settlements';
import { db } from './../utils/db';

export const paymentSucceeded = functions.https.onRequest(async (req: any, res: any) => {
  const data = req.body.data.object;

  const payment = await db.collectionGroup('private').where('customerId', '==', data.customer).get();

  console.log(payment.docs[0].ref.parent.id);

  await addSettlement({
    userId: payment.docs[0].ref.parent.id,
    title: data.lines.data[0].plan.nickname,
    amount: data.amount_paid
  })
  res.send(true);
});
