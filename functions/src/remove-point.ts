import * as functions from 'firebase-functions';
import { countDown } from "./utils";

export const removePoint = functions.https.onCall(async (data, context) => {
  await countDown(`users/${data.uid}`, 'point', data.value);
  return data.value;
});
