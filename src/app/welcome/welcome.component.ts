import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { SwiperOptions } from 'swiper';
import { User } from './../interfaces/user';
import { AuthService } from './../services/auth.service';

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

  ngOnInit() {}

  ngAfterViewInit() {
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
