import * as functions from 'firebase-functions';
import * as sgMail  from '@sendgrid/mail';
import { config } from '../config';

const API_KEY = functions.config().sendgrid.key;

sgMail.setApiKey(API_KEY);

export const sendEmail = (data: {
  to: string;
  templateId: 'register';
  dynamicTemplateData?: { [key: string]: any },
}) => {
  return sgMail.send({
    from: 'update@deer.co.jp',
    ...data,
    templateId: config.mailTemplate[data.templateId]
  });
};
