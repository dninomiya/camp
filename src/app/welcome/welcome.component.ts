import { PlanDataWithPrice } from './../interfaces/plan';
import { take } from 'rxjs/operators';
import { PaymentService } from 'src/app/services/stripe/payment.service';
import { PlanService } from 'src/app/services/plan.service';
import { ASKS, PLAN_FEATURES, QUESTIONS, SKILLS } from './welcome-data';
import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { User } from './../interfaces/user';
import { MatDialog } from '@angular/material/dialog';
import * as AOS from 'aos';
import { AuthService } from './../services/auth.service';
import { SwiperOptions } from 'swiper';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit, AfterViewInit {
  videos = [
    'Dey97I72JtI',
    'QCJ1THnyAec',
    'MDyCX0d-NOE',
    'P1dPxsu-kyI',
    'nww-Y7HiaGE',
  ];
  swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    centeredSlides: true,
    loop: true,
    autoplay: true,
    allowTouchMove: false,
  };
  isSwiperReady: boolean;
  asks = ASKS;
  planFeatures = PLAN_FEATURES;
  qas = QUESTIONS;
  skills = SKILLS;
  user: User;
  player: YT.Player;
  playerVars: YT.PlayerVars = {
    controls: 0,
  };
  user$ = this.authService.authUser$;
  loading: boolean;
  loginSnackBar: MatSnackBarRef<any>;
  plans: PlanDataWithPrice[];

  constructor(
    private authService: AuthService,
    private planService: PlanService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.authService.authUser$.subscribe((user) => {
      this.user = user;
    });

    this.getPlans();
  }

  private async getPlans() {
    const plans = await this.planService.getPlans();
    const prices = await Promise.all(
      plans.map((plan) => this.paymentService.getPrice(plan.mainPriceId))
    );

    this.plans = plans.map((plan) => {
      return {
        ...plan,
        price: prices.find((price) => price.id === plan.mainPriceId),
      };
    });
  }

  ngOnInit() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
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
      inline: 'nearest',
    });
  }

  start(planId: string) {
    if (this.authService.user) {
      this.router.navigateByUrl('/signup?planId=' + planId);
    } else {
      this.dialog
        .open(LoginDialogComponent)
        .afterClosed()
        .subscribe((status) => {
          if (status) {
            this.loading = true;
            this.loginSnackBar = this.snackBar.open(
              'ログインしています',
              null,
              {
                duration: null,
              }
            );
            this.authService
              .login()
              .then(() => {
                this.user$.subscribe((user) => {
                  if (user) {
                    this.router.navigateByUrl('/signup?planId=' + planId);
                  }
                  this.loginSnackBar.dismiss();
                });
              })
              .catch(() => {
                this.loginSnackBar.dismiss();
                this.loading = false;
              });
          }
        });
    }
  }
}
