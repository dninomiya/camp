import * as functions from 'firebase-functions';

import { sendEmail as sendgrid } from './utils';
import { MailTemplate } from './interfaces';

export const sendEmail = functions
  .region('asia-northeast1')
  .https.onCall(
    async (data: {
      to: string;
      templateId: MailTemplate;
      dynamicTemplateData?: { [key: string]: any };
    }) => {
      await sendgrid(data);
      return 'success';
    }
  );
