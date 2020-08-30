import { AngularFireFunctions } from '@angular/fire/functions';
import { Ticket } from './../interfaces/ticket';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  readonly tickets: (Ticket & {
    links?: {
      url: string;
      label: string;
    }[];
  })[] = [
    {
      id: 'document',
      name: '教材買い切り',
      description:
        '今後追加される教材も含め、すべての教材を永久に閲覧することができます。ライトプランに1年以上加入する場合、買い切りプランの方がお得になります。',
      amount: 120000,
      priceId: 'price_1HLXEuAg8h03lWNH6D3KpPHB',
    },
    {
      id: 'meeting',
      name: '1on1',
      description:
        'キャリア相談、技術相談、コーチングなどあらゆる相談に1時間Zoomで対応します（1チケットにつき1回）。チケット購入後にSlackに参加し、メンターにDMを送ってください。',
      amount: 50000,
      priceId: 'price_1HLXEuAg8h03lWNH6D3KpPHB',
      links: [
        {
          url:
            'https://join.slack.com/t/to-camp/shared_invite/zt-dlbmb14m-Ftv8Nupf1MdPYuyNnMkGcg',
          label: 'Slackに参加',
        },
        {
          url: 'https://to-camp.slack.com/archives/DR7CYBX2B',
          label: 'SlackでDM',
        },
      ],
    },
    {
      id: 'review',
      name: 'レビュー',
      description:
        'ソースやデザイン、プロダクト、アーキテクチャなどについて細かくレビューします（1チケットにつき1回）。チケット購入後にSlackに参加し、メンターにDMを送ってください。',
      amount: 50000,
      priceId: 'price_1HLXEuAg8h03lWNH6D3KpPHB',
      links: [
        {
          url:
            'https://join.slack.com/t/to-camp/shared_invite/zt-dlbmb14m-Ftv8Nupf1MdPYuyNnMkGcg',
          label: 'Slackに参加',
        },
        {
          url: 'https://to-camp.slack.com/archives/DR7CYBX2B',
          label: 'SlackでDM',
        },
      ],
    },
  ];

  constructor(private fns: AngularFireFunctions) {}

  getTicket(ticketId: string, priceId: string): Promise<void> {
    const callable = this.fns.httpsCallable('getTicket');
    return callable({
      ticketId,
      priceId,
    }).toPromise();
  }
}
