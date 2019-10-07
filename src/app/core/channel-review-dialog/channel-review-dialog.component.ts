import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { ForumService } from 'src/app/services/forum.service';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-channel-review-dialog',
  templateUrl: './channel-review-dialog.component.html',
  styleUrls: ['./channel-review-dialog.component.scss']
})
export class ChannelReviewDialogComponent implements OnInit {

  isLoading = true;
  reviews$;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      channel: ChannelMeta,
      rate: number
    },
    private forumService: ForumService
  ) { }

  ngOnInit() {
    this.reviews$ = this.forumService.getReviews(this.data.channel.id).pipe(
      tap(() => this.isLoading = false)
    );
  }

}
