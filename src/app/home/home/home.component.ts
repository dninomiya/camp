import { UiService } from './../../services/ui.service';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { LessonService } from 'src/app/services/lesson.service';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SeoService } from 'src/app/services/seo.service';
import { Title } from '@angular/platform-browser';
import { SwiperOptions } from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isMobile = this.uiService.isMobile;
  breakpoints = this.uiService.breakpoints;
  columns = this.breakpoints.large ? 4 : this.breakpoints.xsmall ? 1 : 2;
  swiperConfig: SwiperOptions = {
    allowTouchMove: this.isMobile,
    slidesPerView: this.columns,
    slidesPerGroup: this.columns,
    navigation: {
      nextEl: '.swiper__arrow--next',
      prevEl: '.swiper__arrow--prev',
    },
  };
  updatedLessons$: Observable<
    LessonMeta[]
  > = this.lessonService.getUpdatedLessons().pipe(take(1));

  likedLessons$: Observable<
    LessonMeta[]
  > = this.lessonService.getLikedLessons().pipe(take(1));

  latestLessons$: Observable<
    LessonMeta[]
  > = this.lessonService.getLatestLessons().pipe(take(1));

  constructor(
    private seoService: SeoService,
    private titleService: Title,
    private lessonService: LessonService,
    private uiService: UiService
  ) {
    this.seoService.setSchema({
      '@type': 'WebSite',
      logo: '/assets/images/logo.png',
      name: environment.title,
      type: 'WebSite',
      potentialAction: {
        '@type': 'SearchAction',
        target: '/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    });
  }

  ngOnInit() {
    this.seoService.createCanonicalURL();
    this.titleService.setTitle('CAMP');
  }
}
