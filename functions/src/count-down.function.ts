import * as functions from 'firebase-functions';
import { countDown as countDownHelper } from './utils';

export const countDown = functions.https.onCall(async (data, context) => {
  return countDownHelper(
    data.path,
    data.key,
    data.value
  );
});
