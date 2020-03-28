import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';
import { config } from '../config';

const API_KEY = functions.config().sendgrid.key;

sgMail.setApiKey(API_KEY);

export const sendEmail = (data: {
  to: string;
  templateId:
    | 'unRegisterToAdmin'
    | 'registerToAdmin'
    | 'register'
    | 'deleteAccount'
    | 'changePlan'
    | 'upgradeToAdmin'
    | 'downgradeToAdmin';
  dynamicTemplateData?: { [key: string]: any };
}) => {
  return sgMail.send({
    from: {
      email: 'noreply@deer.co.jp',
      name: 'CAMP'
    },
    ...data,
    templateId: config.mailTemplate[data.templateId]
  });
};
