import { db } from './../utils/db';
import { StripeService } from './service';
import * as functions from 'firebase-functions';

export const getTicket = functions.region('asia-northeast1').https.onCall(
  async (
    data: {
      ticketId: string;
      priceId: string;
    },
    context
  ) => {
    const uid = context.auth?.uid;
    await StripeService.charge(uid, data.priceId);
    await db.doc(`users/${uid}`).update({
      [`ticket.${data.ticketId}`]: true,
    });
    return true;
  }
);
