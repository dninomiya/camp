import { ConfirmUnsubscribeDialogComponent } from './../core/confirm-unsubscribe-dialog/confirm-unsubscribe-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedConfirmDialogComponent } from './../core/shared-confirm-dialog/shared-confirm-dialog.component';
import { take } from 'rxjs/operators';
import { User, UserPayment } from './../interfaces/user';
import { CardDialogComponent } from './../shared/card-dialog/card-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as AOS from 'aos';
import { PaymentService } from './../services/payment.service';
import { AuthService } from './../services/auth.service';
import { SwiperOptions } from 'swiper';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  pages = new Array(5);
  config: SwiperOptions = {
    slidesPerView: 3,
    centeredSlides: true,
    loop: true,
    autoplay: true,
    allowTouchMove: false
  };
  id = '4gM5kgk5brs';
  isActive: boolean;

  asks = [
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

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.authService.authUser$.subscribe(user => {
      this.user = user;
      if (user) {
        this.paymentService
          .getUserPayment(user.id)
          .subscribe(payment => (this.payment = payment));
      } else {
        this.payment = null;
      }
    });
  }
  planFeatures = [
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
      title: '完全オンライン',
      description:
        '場所を選ばず参加いただけます。Slackで質問や情報交換を行います。'
    }
  ];
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
  qas = [
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
  skills = [
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

  plans = [
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
        'サービス企画',
        'サービス開発のアドバイス',
        'コードレビュー',
        '進捗管理'
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
        '毎日の進捗管理'
      ]
    }
  ];

  user: User;
  payment: UserPayment;

  player: YT.Player;
  playerVars: YT.PlayerVars = {
    controls: 0
  };

  ngOnInit() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }

  ngAfterViewInit() {
    (window as any).twttr.widgets.load();
    setTimeout(() => {
      this.isActive = true;
    }, 1000);
    AOS.init();
  }

  scrollToElement($element): void {
    $element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
  }

  private upgrade(planId: string) {
    this.dialog
      .open(SharedConfirmDialogComponent, {
        data: {
          title: '本当にアップグレードしますか？',
          description:
            '１週間の無料トライアル後、自動的に引き落としが始まります。'
        }
      })
      .afterClosed()
      .subscribe(status => {
        if (status) {
          this.paymentService
            .subscribePlan({
              customerId: this.payment.customerId,
              planId,
              subscriptionId: this.payment.subscriptionId
            })
            .then(() => {
              this.snackBar.open('アップグレードしました', null, {
                duration: 2000
              });
            });
        }
      });
  }

  register(planId: string) {
    if (!this.payment) {
      this.dialog
        .open(CardDialogComponent)
        .afterClosed()
        .subscribe(status => {
          if (status) {
            this.upgrade(planId);
          }
        });
    } else {
      this.upgrade(planId);
    }
  }

  unsubscribe(planId: string) {
    this.dialog.open(ConfirmUnsubscribeDialogComponent, {
      data: {
        uid: this.user.id,
        planId
      }
    });
  }

  login(planId: string) {
    this.authService.login().then(result => {
      this.paymentService
        .getUserPayment(result.user.uid)
        .pipe(take(1))
        .subscribe(payment => {
          this.payment = payment;
          this.register(planId);
        });
    });
  }

  savePlayer(player) {
    this.player = player;
  }
  onStateChange(event) {}
}
