import * as functions from 'firebase-functions';
import { countUp as countUpHelper } from './utils';

export const countUp = functions
  .region('asia-northeast1')
  .https.onCall((data, context) => {
    return countUpHelper(data.path, data.key, data.value);
  });
