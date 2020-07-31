import * as functions from 'firebase-functions';
// import { db } from '../utils';

export const addPoint = functions
  .region('asia-northeast1')
  .https.onRequest(async (req: functions.https.Request, res: any) => {
    const data = req.body;

    console.log(data);

    return;
  });
