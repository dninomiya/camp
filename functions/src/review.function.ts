import * as functions from 'firebase-functions';
import { countUp } from './utils';

export const addReview = functions.firestore
  .document('channels/{channelId}/reviews/{reviewId}')
  .onCreate(async (snapshot, context) => {
    const data = snapshot.data();

    if (!data) {
      throw new Error('データが不正です');
    }

    await countUp(`channels/${context.params.channelId}`, 'statistics.reviewCount');
    return countUp(`channels/${context.params.channelId}`, 'totalRate', data.rate);
  });
