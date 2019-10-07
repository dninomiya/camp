import * as functions from 'firebase-functions';
import { countUp as countUpHelper } from './utils';

export const countUp = functions.https.onCall((data, context) => {
  return countUpHelper(
    data.path,
    data.key,
    data.value,
  );
});
