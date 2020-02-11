import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  styles = [
    {
      image: 'remote',
      title: '完全オンライン',
      description:
        '場所を選ばず参加いただけます。Slackで質問や情報交換を行います。'
    },
    {
      image: 'document',
      title: '動画教材',
      description: '解説動画やテキスト教材を使って学習を進めます。'
    },
    {
      image: 'review',
      title: 'ソースレビュー',
      description: 'メンターにソースレビューを依頼することができます。'
    },
    {
      title: '進捗管理',
      description: '毎日MTGを行い、進捗をしっかり管理します。'
    },
    {
      title: 'ハンズオン',
      description: '詰まったときは画面共有をして丁寧に教えます。'
    },
    {
      title: 'テスト',
      description: 'プロダクトが完成したら最終的に実務テストを行います。'
    }
  ];
  skills = [
    {
      image: 'angular',
      title: 'フロントエンド / Angular',
      description: '高品質なサービスのUIを実装します。'
    },
    {
      image: 'firebase',
      title: 'バックエンド / Firebase',
      description:
        'ログイン認証やデータベース設計、外部サービス連携を行います。'
    },
    {
      image: 'stripe',
      title: '決済 / Stripe',
      description:
        '課金システム最大手のStripeを使い、BtoCやCtoC課金システムの実装を行います。'
    },
    {
      image: 'algolia',
      title: '検索 / Algolia',
      description:
        'Algoliaを使って検索システムを開発します。タグ検索、絞り込みなどを行います。'
    },
    {
      image: 'xd',
      title: 'UI設計 / XD',
      description: '使いやすいサービスのUIをデザイン、設計します。'
    },
    {
      image: 'github',
      title: 'Git開発 / GitHub',
      description: 'GitHubを使ったレビュー駆動開発を行います（一部プランのみ）'
    }
  ];

  plans = [
    {
      id: 'lite',
      title: 'ライト',
      subTitle: '自分のペースで学びたい方',
      price: 35000,
      points: ['教材の閲覧', '質問し放題']
    },
    {
      id: 'standard',
      title: 'スタンダード',
      subTitle: '本気ガッツリ学びたい方',
      price: 50000,
      points: ['教材の閲覧', '質問し放題', 'コードレビュー', '進捗管理']
    },
    {
      id: 'isa',
      title: 'ISA',
      subTitle: '学費の確保が難しい方',
      price: 0,
      points: ['教材の閲覧', '質問し放題', 'コードレビュー', '毎日の進捗管理']
    }
  ];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    (window as any).twttr.widgets.load();
  }

  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }
}
