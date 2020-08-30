import { ASKS, QUESTIONS, SKILLS } from './welcome-data';
import { User } from './../interfaces/user';
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
    '4ZwkWAAz8s0',
    'QCJ1THnyAec',
    'MDyCX0d-NOE',
    'P1dPxsu-kyI',
    'pDhmhB1qI-0',
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
  qas = QUESTIONS;
  skills = SKILLS;
  user: User;
  player: YT.Player;
  playerVars: YT.PlayerVars = {
    controls: 0,
  };
  user$ = this.authService.authUser$;

  constructor(private authService: AuthService) {
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
}
