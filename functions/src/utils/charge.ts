import * as functions from 'firebase-functions';
import { config } from '../config';
import { addSettlement } from './add-settlements';

const stripe = require('stripe')(functions.config().stripe.key);

export const charge = async (data: {
  item: {
    id: string;
    path: string;
    title: string;
    amount: number;
  },
  customer: {
    id: string;
    uid: string;
  },
  seller: {
    id: string;
    email: string;
    uid: string;
  }
}) => {
  const { item, seller, customer } = data;

  if (!item || !seller || !customer) {
    throw new Error('決済に必要な情報が不足しています');
  } else {
    await stripe.charges.create({
      amount: item.amount,
      currency: 'jpy',
      customer: customer.id,
      application_fee_amount: item.amount * config.fee,
      transfer_data: {
        destination: seller.id,
      }
    });

    return addSettlement({
      id: item.id,
      userId: customer.uid,
      sellerEmail: seller.email,
      title: item.title,
      path: item.path,
      amount: item.amount
    })
  }
}
