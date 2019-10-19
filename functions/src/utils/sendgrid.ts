import * as functions from 'firebase-functions';
import * as sgMail  from '@sendgrid/mail';
import { config } from '../config';

const API_KEY = functions.config().sendgrid.key;

sgMail.setApiKey(API_KEY);

export const sendEmail = (data: {
  to: string;
  templateId: 'register' | 'deleteAccount' | 'request' | 'open' | 'reject' | 'closed' | 'reply' | 'charged';
  dynamicTemplateData?: { [key: string]: any },
}) => {
  return sgMail.send({
    from: {
      email: 'noreply@3ml.app',
      name: '3ML'
    },
    ...data,
    templateId: config.mailTemplate[data.templateId]
  });
};
