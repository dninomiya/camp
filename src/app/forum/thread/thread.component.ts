import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Thread, ThreadReply, REJECT_REASON_TEMPLATE } from 'src/app/interfaces/thread';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, take } from 'rxjs/operators';
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

@Component({
  selector: 'app-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss'],
  providers: [DecimalPipe, DatePipe]
})
export class ThreadComponent implements OnInit {
  thread: Thread;
  thread$ = this.route.paramMap.pipe(
    tap(params => {
      this.replies$ = this.forumService.getReplies(params.get('id'));
    }),
    switchMap(params => this.forumService.getThread(params.get('id')).pipe(take(1))),
    tap(thread => {
      this.thread = thread;
      this.forumService.reduceUnreadCount(
        this.authService.user.id,
        thread
      );
    })
  );

  replies$: Observable<ThreadReply[]>;

  commentForm = new FormControl('', [Validators.required]);
  uid = this.authService.user.id;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private forumService: ForumService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
    private paymentService: PaymentService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
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

      this.notificationService.addNotification(
        this.getNotificationTargetUID(),
        {
          title: `「${this.thread.data.title}」に返信がありました`
        }
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
        this.paymentService.createCharge({
          amount: thread.plan.amount,
          channelId: thread.targetId,
          userId: thread.authorId,
          contentId: thread.id,
          type: thread.plan.type,
          targetId: thread.targetId
        }).then(() => {
          this.forumService.updateThread(thread.id, {
            status: 'open'
          });

          this.notificationService.addNotification(
            thread.authorId,
            {
              title: `「${thread.data.title}」が承認されました`
            }
          );

          this.snackBar.open('承認しました', null, {
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
