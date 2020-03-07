export const ASKS = [
  {
    title:
      'いいね機能を実装したのですがいいね数がカウントされません。なぜでしょうか？コードはこちらです。',
    date: new Date()
  },
  {
    title:
      '24行目でカウント関数の指定が間違っているようです。分からなければ画面共有して解説します！',
    date: new Date()
  },
  {
    title: '解決しました！素早い回答ありがとうございます！',
    date: new Date()
  }
];

export const PLAN_FEATURES = [
  {
    image: null,
    title: '有料教材の閲覧',
    description:
      '今後追加されるコンテンツを含め、永続的な教材閲覧権が得られます。'
  },
  {
    image: null,
    title: '質問し放題',
    description: 'テキストで何度でもメンターに質問することができます。'
  },
  {
    image: null,
    title: 'コードレビュー',
    description: 'メンターにコードレビューを依頼することができます。'
  },
  {
    image: null,
    title: '進捗管理',
    description: '毎日〜毎月の任意のタイミングで進捗管理を行います。'
  },
  {
    image: null,
    title: 'サービス企画',
    description:
      'サービスとして必要な画面、機能の洗い出しや画面設計を手引きします。'
  },
  {
    image: null,
    title: '開発顧問',
    description:
      '技術的、UX的視点からサービスのコードレベルでアドバイスを行います。'
  },
  {
    image: null,
    title: '就職支援',
    description:
      '応募先企業の評価、レジュメ添削、模擬面接など必要に応じて支援します。'
  }
];

export const QUESTIONS = [
  {
    q: 'どれくらいで自分のサービスができますか？',
    a:
      '初期スキルや学習時間によるので一概には言えませんが、3〜6ヶ月の方が多いです。'
  },
  {
    q: '就職支援はありますか？',
    a:
      'CAMPから就職先を指定、紹介することはありません。自分が行きたいと思う企業へ応募してください。'
  },
  {
    q: '返金保証はありますか？',
    a:
      '1週間の無料トライアル以降は1ヶ月ごとに前払いとなり、途中退会においても返金はできません。'
  },
  {
    q: 'なぜ技術を限定しているのですか？',
    a: '教材の鮮度を保つために手を広げすぎないようにしています。'
  },
  {
    q: '説明会、勉強会はありますか？',
    a:
      'メンターが不定期で<a href="https://www.youtube.com/channel/UCUPq5dKFGnOziaqYI-ejYcg?view_as=subscriber" target="_blank">YouTube Live</a>をやっているのでそちらにご参加いただくか、過去のアーカイブをご参照ください。'
  },
  {
    q: '誰でも参加できますか？',
    a: '自分個人のPCと快適なネット環境があれば誰でもご参加いただけます。'
  }
];

export const SKILLS = [
  {
    image: 'angular',
    title: 'フロントエンド / Angular',
    description: 'Angularを使ってモダンなWebサービスを開発します。'
  },
  {
    image: 'firebase',
    title: 'バックエンド / Firebase',
    description: 'Firebaseを使ってログイン認証やデータベース設計します。'
  },
  {
    image: 'stripe',
    title: '決済 / Stripe',
    description:
      '課金システム最大手Stripeを使って、BtoCやCtoCの決済システムを開発します。'
  },
  {
    image: 'algolia-logo',
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
    description:
      'GitHubを使ったレビュー駆動開発を行います。（メンタープランのみ）'
  }
];

export const PLANS = [
  {
    id: 'lite',
    title: 'ソロ',
    subTitle: 'ひとりで学びたい人',
    price: 10000,
    points: ['有料教材の閲覧', '質問し放題']
  },
  {
    id: 'standard',
    title: 'メンター',
    subTitle: 'メンターと進めたい人',
    price: 50000,
    points: [
      '有料教材の閲覧',
      '質問し放題',
      'コードレビュー',
      '進捗管理',
      'サービス企画',
      '開発顧問',
      '就職支援'
    ]
  },
  {
    id: 'isa',
    title: 'ISA',
    subTitle: '学費の確保が難しい方',
    price: 0,
    points: [
      '有料教材の閲覧',
      '質問し放題',
      'コードレビュー',
      '毎日の進捗管理',
      'サービス企画',
      '開発顧問',
      '就職支援'
    ]
  }
];
