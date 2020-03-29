import { Component, OnInit, Input } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { switchMap, take } from 'rxjs/operators';
import { LessonService } from 'src/app/services/lesson.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SharedConfirmDialogComponent } from 'src/app/core/shared-confirm-dialog/shared-confirm-dialog.component';
import { DecimalPipe } from '@angular/common';
import { PaymentService } from 'src/app/services/payment.service';
import { AuthService } from 'src/app/services/auth.service';
import { Lesson } from 'src/app/interfaces/lesson';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { Router } from '@angular/router';

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
    private dialog: MatDialog,
    private decimal: DecimalPipe,
    private paymentService: PaymentService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
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
              return this.lessonService.getLesson(id).pipe(take(1));
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }
}
