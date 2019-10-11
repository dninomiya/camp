import { Component, OnInit, Input } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { switchMap, take, shareReplay } from 'rxjs/operators';
import { LessonService } from 'src/app/services/lesson.service';
import { ListService } from 'src/app/services/list.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SharedConfirmDialogComponent } from 'src/app/core/shared-confirm-dialog/shared-confirm-dialog.component';
import { DecimalPipe } from '@angular/common';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import { Lesson } from 'src/app/interfaces/lesson';
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
  lessons$: Observable<Lesson[]>;
  isRunning: boolean;

  constructor(
    private lessonService: LessonService,
    private listService: ListService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private decimal: DecimalPipe,
    private paymentService: PaymentService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.isPurchased$ = this.cause$.pipe(
      switchMap(cause => {
        return this.paymentService.checkPurchased(
          this.authService.user.id,
          cause.id
        );
      })
    );

    this.lessons$ = this.cause$.pipe(
      switchMap(cause => {
        if (cause && cause.lessonIds.length) {
          return forkJoin(
            cause.lessonIds.map(id => {
              return this.lessonService.getLesson(id).pipe(take(1));
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }

  openConfirmDialog(cause: LessonList) {
    this.dialog.open(SharedConfirmDialogComponent, {
      data: {
        title: `${cause.title}コースを${this.decimal.transform(cause.amount)}円で購入しますか？`,
        description: 'コースを購入するとコース内の有料レッスンが閲覧できるようになります。コースに追加さる有料レッスンも閲覧可能になりますが、コースから外されたら閲覧できなくなります。'
      },
      width: '640px',
      restoreFocus: false
    }).afterClosed().subscribe(status => {
      if (status ) {
        const loading = this.snackBar.open('コースを購入しています');

        this.isRunning = true;

        this.paymentService.createCharge({
          amount: cause.amount,
          userId: this.authService.user.id,
          channelId: cause.authorId,
          contentId: cause.id,
          type: 'cause',
          title: cause.title,
          sellerEmail: this.channel.email,
          contentPath: `lesson?=${cause.firstLessonId}&cause=${cause.id}`,
          targetId: cause.authorId
        }).then(() => {
          loading.dismiss();
          this.snackBar.open('コースを購入しました！', null, {
            duration: 2000
          });
        });
      }
    });
  }

}
