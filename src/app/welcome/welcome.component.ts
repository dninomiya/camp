import { PlanService } from 'src/app/services/plan.service';
import { ASKS, PLAN_FEATURES, QUESTIONS, SKILLS } from './welcome-data';
import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { Router, ActivatedRoute } from '@angular/router';
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
  isCampaign = this.planService.isCampaign;
  isSwiperReady: boolean;
  asks = ASKS;
  planFeatures = PLAN_FEATURES;
  qas = QUESTIONS;
  skills = SKILLS;
  plans = this.planService.plans;
  user: User;
  player: YT.Player;
  playerVars: YT.PlayerVars = {
    controls: 0,
  };
  user$ = this.authService.authUser$;
  loading: boolean;
  loginSnackBar: MatSnackBarRef<any>;

  constructor(
    private authService: AuthService,
    private planService: PlanService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.authService.authUser$.subscribe((user) => {
      this.user = user;
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
      this.router.navigateByUrl('/intl/signup?planId=' + planId);
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
                duration: 2000,
              }
            );
            this.authService
              .login()
              .then(() => {
                this.user$.subscribe((user) => {
                  if (user) {
                    this.loginSnackBar.dismiss();
                    this.router.navigateByUrl('/intl/signup?planId=' + planId);
                  } else {
                    this.loginSnackBar.dismiss();
                    this.loading = false;
                  }
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
