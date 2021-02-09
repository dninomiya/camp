import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  planFeatures = [
    {
      image: null,
      title: '教材見放題',
      description:
        '今後追加される教材を含め、契約中はすべての動画が見放題です。',
    },
    {
      image: null,
      title: '質問し放題',
      description: 'テキストで何度でもメンターに質問することができます。',
    },
    {
      image: null,
      title: '企画MTG',
      description: 'どんなサイトを作るのか、一緒に企画します。',
    },
    {
      image: null,
      title: '進捗管理MTG',
      description: '毎日〜毎月の任意のタイミングで進捗管理を行います。',
    },
    {
      image: null,
      title: 'バディ制度 (希望制)',
      description: '毎日〜毎月の任意のタイミングで進捗管理を行います。',
    },
    {
      image: null,
      title: '勉強会・チーム開発',
      description: 'お題となるWebサイトをチームで役割分担して開発します。',
    },
    {
      image: null,
      title: 'キャリア支援 (※ 有料オプション)',
      description: 'お題となるWebサイトをチームで役割分担して開発します。',
    },
    {
      image: null,
      title: 'マンツーマン開発支援 (※ 有料オプション)',
      description: 'お題となるWebサイトをチームで役割分担して開発します。',
    },
    {
      image: null,
      title: '実務力テスト (※ 有料オプション)',
      description: 'お題となるWebサイトをチームで役割分担して開発します。',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
