import * as functions from 'firebase-functions';
import { postActivity } from "./utils";

export const addActivityToDiscord = functions.https.onCall(async (data, context) => {
  await postActivity(data.content);
  return {
    status: 'success'
  };
});
