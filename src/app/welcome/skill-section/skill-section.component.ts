import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-skill-section',
  templateUrl: './skill-section.component.html',
  styleUrls: ['./skill-section.component.scss'],
})
export class SkillSectionComponent implements OnInit {
  skills = [
    {
      image: 'angular',
      title: 'フロントエンド / Angular',
      description: 'Angularを使ってモダンなWebサービスを開発します。',
    },
    {
      image: 'firebase',
      title: 'バックエンド / Firebase',
      description: 'Firebaseを使ってログイン認証やデータベース設計します。',
    },
    {
      image: 'stripe',
      title: '決済 / Stripe',
      description:
        '課金システム最大手Stripeを使って、BtoCやCtoCの決済システムを開発します。',
    },
    {
      image: 'algolia-logo',
      title: '検索 / Algolia',
      description:
        'Algoliaを使って検索システムを開発します。タグ検索、絞り込みなどを行います。',
    },
    {
      image: 'xd',
      title: 'UI設計 / XD',
      description: '使いやすいサービスのUIをデザイン、設計します。',
    },
    {
      image: 'github',
      title: 'Git開発 / GitHub',
      description:
        'GitHubを使ったレビュー駆動開発を行います。（メンタープランのみ）',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
