import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedConfirmDialogComponent } from './../core/shared-confirm-dialog/shared-confirm-dialog.component';
import { take } from 'rxjs/operators';
import { User, UserPayment } from './../interfaces/user';
import { CardDialogComponent } from './../shared/card-dialog/card-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { PaymentService } from './../services/payment.service';
import { PlanService } from './../services/plan.service';
import { AuthService } from './../services/auth.service';
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
      q: 'なぜ技術を制限しているのですか？',
      a:
        '最新の正しいスキルを教えるために、Googleが提供するAngularとFirebaseを使ったサービス開発に限定しています。'
    },
    {
      q: '説明会、勉強会はありますか？',
      a:
        'メンターが不定期で<a href="https://www.youtube.com/channel/UCUPq5dKFGnOziaqYI-ejYcg?view_as=subscriber" target="_blank">YouTube Live</a>をやっているのでそちらにご参加いただくか、過去のアーカイブをご参照ください。'
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
      price: 10000,
      points: ['有料教材の閲覧', '質問し放題']
    },
    {
      id: 'standard',
      title: 'スタンダード',
      subTitle: '本気ガッツリ学びたい方',
      price: 50000,
      points: ['有料教材の閲覧', '質問し放題', 'コードレビュー', '進捗管理']
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
          .pipe(take(1))
          .subscribe(payment => (this.payment = payment));
      } else {
        this.payment = null;
      }
    });
  }

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
              uid: this.user.id
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
    if (this.user) {
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
    } else {
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
  }
}
