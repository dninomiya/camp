import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Plan } from 'src/app/interfaces/plan';
import { ForumService } from 'src/app/services/forum.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Thread } from 'src/app/interfaces/thread';

@Component({
  selector: 'app-plan-action-dialog-wrapper',
  templateUrl: './plan-action-dialog-wrapper.component.html',
  styleUrls: ['./plan-action-dialog-wrapper.component.scss']
})
export class PlanActionDialogWrapperComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public params: {
      plan: Plan,
      targetId: string,
      authorId: string
    },
    private forumService: ForumService,
    private notificationService: NotificationService,
    private dialogRef: MatDialogRef<PlanActionDialogWrapperComponent>
  ) { }

  ngOnInit() {}

  createThread(data: Pick<Thread, 'title' | 'body'>) {
    this.forumService.createThread({
      ...data,
      ...this.params
    }).then(result => {
      this.notificationService.addNotification(result.targetId, {
        title: 'リクエストが届きました'
      });
      this.dialogRef.close(result.id);
    }).catch(() => {
      this.dialogRef.close();
    });
  }

}
