import * as functions from 'firebase-functions';
import { addPointHelper } from "./utils";

export const addPoint = functions.https.onCall(async (data, context) => {
  const addedPoint = await addPointHelper(data.uid, data.value);
  return addedPoint;
});
