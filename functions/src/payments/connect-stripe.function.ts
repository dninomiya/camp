import * as functions from 'firebase-functions';
import { db } from '../utils';
import * as request from 'request';

const planTemplates = [
  {
    type: 'question',
    description: '質問に答えます',
    amount: 1000,
    per: 'time',
    active: false
  },
  {
    type: 'review',
    description: 'ソースレビューを受け付けます',
    amount: 10000,
    per: 'time',
    active: false
  },
  {
    type: 'trouble',
    description: 'トラブルシューティングを受け付けます',
    amount: 10000,
    per: 'time',
    active: false
  },
  {
    type: 'coaching',
    description: 'コーチングを行います',
    amount: 10000,
    per: 'coaching',
    active: false
  }
];

const stripe = require('stripe')(functions.config().stripe.key);

const createTax = (stripe_account: string): Promise<{
  id: string
}> => {
  return stripe.taxRates.create({
    display_name: '消費税',
    jurisdiction: 'Japan',
    percentage: 10,
    inclusive: false,
  }, {
    stripe_account
  });
}

const createProduct = async (stripe_account: string): Promise<string> => {
  const result = await stripe.products.create(
    {
      name: 'Update',
      type: 'service',
    },
    {
      stripe_account
    }
  );

  return result.id;
}

const createPlans = (channelId: string): Promise<any> => {
  return Promise.all(planTemplates.map(async template => {
    return db.doc(`channels/${channelId}/plans/${template.type}`).set(template);
  }));
}

const setPayoutsSchedule = (accountId: string): Promise<any> => {
  return stripe.accounts.update(
    accountId,
    {
      settings: {
        payouts: {
          schedule: {
            interval: 'monthly',
            monthly_anchor: 31
          }
        }
      }
    }
  );
}

export const connectStripe = functions.https.onCall(async (data, context) => {
  const result: any = await new Promise((resolve, reject) => {
    request.post({
      url: 'https://connect.stripe.com/oauth/token',
      formData: {
        client_secret: functions.config().stripe.key,
        code: data.code,
        grant_type: 'authorization_code',
      }
    }, (error, res, body) => {
      ;
      if (!error && res.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  }).catch(error => {
    throw new Error(error);
  });

  if (context.auth) {
    const stripeUserId = result.stripe_user_id;
    const productId =  await createProduct(stripeUserId);

    await setPayoutsSchedule(stripeUserId);

    await db.doc(`users/${context.auth.uid}/private/connect`).set({
      stripeUserId,
      taxId: await createTax(stripeUserId),
      productId,
    });

    return createPlans(context.auth.uid);
  } else {
    throw new Error('権限がありません');
  }
});

export const getDashboardURL = functions.https.onCall(async (accountId, context) => {
  return stripe.accounts.createLoginLink(accountId);
});
