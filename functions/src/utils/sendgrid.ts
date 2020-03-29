import * as functions from 'firebase-functions';
import * as sgMail from '@sendgrid/mail';
import { config } from '../config';
import { MailTemplate } from '../interfaces';
import { FOOTER_HTML } from './footer.html';

const API_KEY = functions.config().sendgrid.key;

sgMail.setApiKey(API_KEY);

export const sendEmail = (data: {
  to: string;
  templateId: MailTemplate;
  dynamicTemplateData?: { [key: string]: any };
}) => {
  return sgMail.send({
    from: {
      email: 'noreply@deer.co.jp',
      name: 'CAMP'
    },
    to: data.to,
    dynamicTemplateData: data.dynamicTemplateData,
    templateId: config.mailTemplate[data.templateId],
    mailSettings: {
      footer: {
        enable: true,
        html: FOOTER_HTML,
        text: `株式会社Deer\n
        info@deer.co.jp\n
        〒174-0041 東京都新宿区新宿1-36-4-9\n
        https://to.camp/company`
      }
    }
  });
};
