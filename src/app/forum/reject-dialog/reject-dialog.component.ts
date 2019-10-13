import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Thread, REJECT_REASON_TEMPLATE } from 'src/app/interfaces/thread';
import { ForumService } from 'src/app/services/forum.service';
import { FormControl, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-reject-dialog',
  templateUrl: './reject-dialog.component.html',
  styleUrls: ['./reject-dialog.component.scss']
})
export class RejectDialogComponent implements OnInit {

  reasons = REJECT_REASON_TEMPLATE;
  reasonControl = new FormControl('', Validators.required);

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: {
      thread: Thread,
      userId: string
    },
    private forumService: ForumService,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  rejectThread() {
    let notificationUID: string;

    if (this.data.thread.authorId === this.data.userId) {
      notificationUID = this.data.thread.targetId;
    } else {
      notificationUID = this.data.thread.authorId;
    }

    this.forumService.updateThread(
      this.data.thread.id,
      {
        status: 'closed',
        rejectReason: this.reasonControl.value,
        isReject: true
      }
    ).then(() => {
      this.snackBar.open('クローズしました', null, {
        duration: 2000
      });
    });
  }

}
