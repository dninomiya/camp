import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Thread, ThreadReply, REJECT_REASON_TEMPLATE } from 'src/app/interfaces/thread';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, take, shareReplay } from 'rxjs/operators';
import { ForumService } from 'src/app/services/forum.service';
import { FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { DecimalPipe, DatePipe } from '@angular/common';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SharedConfirmDialogComponent } from 'src/app/core/shared-confirm-dialog/shared-confirm-dialog.component';
import { AddReviewDialogComponent } from '../add-review-dialog/add-review-dialog.component';
import { RejectDialogComponent } from '../reject-dialog/reject-dialog.component';
import { NotificationService } from 'src/app/services/notification.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ChannelService } from 'src/app/services/channel.service';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { PlanTitleLabelPipe } from 'src/app/shared/plan-title-label.pipe';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  providers: [
    DecimalPipe,
    DatePipe,
    PlanTitleLabelPipe
  ]
})
export class ThreadComponent implements OnInit {
  thread: Thread;
  thread$ = this.route.paramMap.pipe(
    switchMap(params => this.forumService.getThread(params.get('id')).pipe(take(1))),
    tap(thread => {
      console.log(thread);
      this.thread = thread;
      this.forumService.reduceUnreadCount(
        this.authService.user.id,
        thread
      );
    }),
    shareReplay(1)
  );

  @ViewChild('threadBottom', {
    static: false
  }) threadBottom: ElementRef;

  channel$ = this.thread$.pipe(
    switchMap(thread => {
      return this.channelService.getChannel(thread.targetId);
    }),
    shareReplay(1)
  );

  channel: ChannelMeta;

  replies$: Observable<ThreadReply[]> = this.route.paramMap.pipe(
    switchMap(params => {
      return this.forumService.getReplies(params.get('id'));
    }),
    tap(() => {
      setTimeout(() => {
        this.threadBottom.nativeElement.scrollIntoView({ block: 'start' });
      }, 100);
    })
  );

  commentForm = new FormControl('', [Validators.required]);
  uid = this.authService.user.id;

  constructor(
    private authService: AuthService,
    private channelService: ChannelService,
    private route: ActivatedRoute,
    private forumService: ForumService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private planTitleLabelPipe: PlanTitleLabelPipe,
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.channel$.pipe(take(1)).subscribe(channel => this.channel = channel);
  }

  getNotificationTargetUID(): string {
    if (this.uid === this.thread.authorId) {
      return this.thread.targetId;
    } else {
      return this.thread.authorId;
    }
  }

  private addReply(body: string) {
    this.forumService.addReply({
      authorId: this.uid,
      threadId: this.thread.id,
      thread: this.thread,
      body
    }).then(() => {
      this.forumService.addUnreadCount(
        this.getNotificationTargetUID(),
        this.thread
      );

      this.snackBar.open('投稿しました', null, {
        duration: 2000
      });
    });
  }

  submit() {
    this.addReply(this.commentForm.value);
    this.commentForm.reset();
  }

  openConfirmDialog(thread: Thread) {
    this.dialog.open(SharedConfirmDialogComponent, {
      data: {
        title: 'リクエストを承認しますか？',
        description: `承認したら相手に${this.decimalPipe.transform(thread.plan.amount)}円の請求が発生します。リクエストに応えられると判断したら承認しましょう。`
      },
      autoFocus: false,
      restoreFocus: false
    }).afterClosed().subscribe(status => {
      if (status) {
        this.forumService.updateThread(thread.id, {
          status: 'open'
        }).then(() => {
          this.snackBar.open('承認しました', null, {
            duration: 2000
          });
        }).catch(error => {
          console.error(error);
          this.snackBar.open('処理に失敗しました', null, {
            duration: 2000
          });
        });
      }
    });
  }

  addReviewDialog(thread: Thread, isComplete: boolean) {
    let targetId: string;

    if (thread.targetId !== this.uid) {
      targetId = thread.targetId;
    } else {
      targetId = thread.authorId;
    }

    this.dialog.open(AddReviewDialogComponent, {
      width: '640px',
      data: {
        authorId: this.uid,
        targetId,
        thread
      }
    }).afterClosed().subscribe(isDone => {
      if (isDone) {
        this.forumService.updateThread(thread.id, {
          status: 'closed',
          isComplete
        });
        this.snackBar.open('スレッドをクロースしました', null, {
          duration: 2000
        });
      }
    });
  }

  openRejectDialog(thread: Thread) {
    this.dialog.open(RejectDialogComponent, {
      data: {
        thread,
        userId: this.uid
      },
      restoreFocus: false
    });
  }

  getReason(reason: string) {
    return REJECT_REASON_TEMPLATE.find(item => item.value === reason).label;
  }

  postDate(date: Date, time: string) {
    this.addReply(`${this.datePipe.transform(date, 'yyyy/MM/dd(EE)')} ${time}でいかがでしょうか？`);
  }

}
