import { PlanService } from 'src/app/services/plan.service';
import { ASKS, PLAN_FEATURES, QUESTIONS, SKILLS } from './welcome-data';
import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { ConfirmUnsubscribeDialogComponent } from './../core/confirm-unsubscribe-dialog/confirm-unsubscribe-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedConfirmDialogComponent } from './../core/shared-confirm-dialog/shared-confirm-dialog.component';
import { of } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';
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
  videos = new Array(5).fill('4gM5kgk5brs');
  swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    centeredSlides: true,
    loop: true,
    autoplay: true,
    allowTouchMove: false
  };
  isSwiperReady: boolean;
  asks = ASKS;
  planFeatures = PLAN_FEATURES;
  qas = QUESTIONS;
  skills = SKILLS;
  plans = this.planService.plans;
  user: User;
  payment: UserPayment;
  player: YT.Player;
  playerVars: YT.PlayerVars = {
    controls: 0
  };

  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private planService: PlanService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
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

  ngOnInit() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    this.authService.authUser$
      .pipe(
        switchMap(user => {
          if (user) {
            return this.paymentService.getUserPayment(user.id).pipe(take(1));
          } else {
            return of(null);
          }
        })
      )
      .subscribe(payment => (this.payment = payment));
  }

  ngAfterViewInit() {
    (window as any).twttr.widgets.load();
    setTimeout(() => {
      this.isSwiperReady = true;
      AOS.init();
    }, 1000);
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

  start(planId: string) {
    if (this.authService.user) {
      this.router.navigateByUrl('/intl/signup?planId=' + planId);
    } else {
      this.dialog
        .open(LoginDialogComponent)
        .afterClosed()
        .subscribe(status => {
          if (status) {
            this.authService.login().then(() => {
              this.router.navigateByUrl('/intl/signup?planId=' + planId);
            });
          }
        });
    }
  }

  savePlayer(player) {
    this.player = player;
  }
  onStateChange(event) { }
}
