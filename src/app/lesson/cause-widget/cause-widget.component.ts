import { Component, OnInit, Input } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { switchMap, take } from 'rxjs/operators';
import { LessonService } from 'src/app/services/lesson.service';
import { DecimalPipe } from '@angular/common';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { ChannelMeta } from 'src/app/interfaces/channel';

@Component({
  selector: 'app-cause-widget',
  templateUrl: './cause-widget.component.html',
  styleUrls: ['./cause-widget.component.scss'],
  providers: [DecimalPipe]
})
export class CauseWidgetComponent implements OnInit {
  @Input() cause$: Observable<LessonList>;
  @Input() channel: ChannelMeta;

  isPurchased$: Observable<boolean>;
  lessons$: Observable<LessonMeta[]>;
  isRunning: boolean;

  constructor(
    private lessonService: LessonService,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isPurchased$ = this.authService.authUser$.pipe(
      switchMap(user => {
        if (user) {
          return this.cause$.pipe(
            switchMap(cause => {
              return this.paymentService.checkPurchased(
                this.authService.user.id,
                cause.id
              );
            })
          );
        } else {
          return of(false);
        }
      })
    );

    this.lessons$ = this.cause$.pipe(
      switchMap(cause => {
        if (cause && cause.lessonIds.length) {
          return forkJoin(
            cause.lessonIds.map(id => {
              return this.lessonService.getLessonMeta(id).pipe(take(1));
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }
}
