import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ForumService } from 'src/app/services/forum.service';
import { MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { Thread } from 'src/app/interfaces/thread';

@Component({
  selector: 'app-add-review-dialog',
  templateUrl: './add-review-dialog.component.html',
  styleUrls: ['./add-review-dialog.component.scss']
})
export class AddReviewDialogComponent implements OnInit {

  comment = new FormControl('', Validators.required);
  rate: number;

  constructor(
    private forumService: ForumService,
    private dialogRef: MatDialogRef<AddReviewDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: {
      targetId: string;
      authorId: string;
      thread: Thread;
    }
  ) { }

  ngOnInit() {
  }

  submit() {
    this.forumService.addReview(
      this.data.targetId,
      {
        body: this.comment.value,
        authorId: this.data.authorId,
        rate: this.rate,
        type: this.data.thread.plan.type
      }
    ).then(() => {
      this.dialogRef.close(true);
    });
  }

}
