import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { forkJoin } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { PlanService } from 'src/app/services/plan.service';
import { map, take } from 'rxjs/operators';
import { Job } from 'src/app/interfaces/job';
import { Plan } from 'src/app/interfaces/plan';
import { ChannelReviewDialogComponent } from 'src/app/core/channel-review-dialog/channel-review-dialog.component';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input() channel: ChannelMeta;
  @Output() loaded = new EventEmitter<boolean>();

  jobs: Job[];
  plans: Plan[];
  rate: number;

  constructor(
    private channelService: ChannelService,
    private planService: PlanService,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    forkJoin([
      this.channelService.getJobs(this.channel.id).pipe(take(1)),
      this.planService.getPlansByChannelId(this.channel.id).pipe(
        map(plans => plans.filter(plan => plan.active)),
        take(1)
      ),
    ]).subscribe(([job, plans]) => {
      this.jobs = job;
      this.plans = plans;
      this.loaded.emit(true);
    });

    this.rate = this.getRate();
  }

  getRate(): number {
    if (this.channel.totalRate && this.channel.totalRate) {
      return this.channel.totalRate / this.channel.reviewCount;
    } else {
      return 0;
    }
  }

  openReviewDialog() {
    this.dialog.open(ChannelReviewDialogComponent, {
      width: '640px',
      autoFocus: false,
      restoreFocus: false,
      data: {
        channel: this.channel,
        rate: this.rate
      }
    });
  }

}
