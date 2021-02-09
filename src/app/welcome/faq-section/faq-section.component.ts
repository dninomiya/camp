import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq-section',
  templateUrl: './faq-section.component.html',
  styleUrls: ['./faq-section.component.scss'],
})
export class FaqSectionComponent implements OnInit {
  qas = [
    {
      q: 'どれくらいで自分のサービスができますか？',
      a:
        '初期スキルや学習時間によるので一概には言えませんが、週5日8時間稼働で3〜6ヶ月かかる方が多いです。',
    },
    {
      q: '就職支援はありますか？',
      a:
        'レジュメ添削、面接対策、応募文添削は行いますが、Flockから就職先を指定することはありません。',
    },
    {
      q: '返金保証はありますか？',
      a:
        '1週間の無料トライアル以降は1ヶ月ごとに前払いとなり、途中退会においても返金はできません。',
    },
    {
      q: '説明会はありますか？',
      a:
        '事前説明を希望の方は<a href="https://calendly.com/daichi-ninomiya/camp" target="_blank">事前面談予約</a>をお願いします。面談なしで直接参加いただいても構いません。',
    },
    {
      q: '誰でも参加できますか？',
      a: '自分個人のPCと快適なネット環境があれば誰でもご参加いただけます。',
    },
    {
      q: '進捗MTGの参加はどの程度必要ですか？',
      a:
        'メンタープランの方は最低週1日の参加が必要です。進捗MTGは平日17:00〜18:00、もしくは日曜15:00〜16:00となっています。',
    },
    {
      q: '法人案件をメンターしてもらうことはできますか？',
      a:
        '法人案件は技術顧問として別途応相談となります。下記お問い合わせよりご連絡ください。Flock参加中は必ずソースコードを公開状態にする必要があるので、法人案件を個人案件と称して参加した場合におけるリスクに関して一切責任を負いません。',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
