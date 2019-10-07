import * as functions from 'firebase-functions';

const stripe = require('stripe')(functions.config().stripe.key);

export const deleteCustomer = async (cid: string, sid: string): Promise<any> => {
  if (cid) {
    return stripe.customers.del(cid);
  }
  if (sid) {
    await stripe.subscriptions.del(sid);
  } else {
    return null;
  }
};
