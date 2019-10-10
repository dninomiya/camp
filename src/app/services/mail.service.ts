import { Injectable } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class MailService {

  constructor(
    private fns: AngularFireFunctions
  ) { }

  sendMail(body: {
    to: string;
    templateId: string;
    dynamicTemplateData: object;
  }): Promise<void> {
    const collable = this.fns.httpsCallable('sendEmail');
    return collable(body).toPromise();
  }
}
