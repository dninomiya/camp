import * as functions from 'firebase-functions';

import { sendEmail as sendgrid } from './utils';

export const sendEmail = functions.https.onCall(async (data: {
  to: string;
  templateId: string;
  dynamicTemplateData?: { [key: string]: any },
}) => {
  await sendgrid(data);
  return 'success';
})
