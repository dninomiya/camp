import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { combineLatest } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { PlanService } from 'src/app/services/plan.service';
import { map } from 'rxjs/operators';
import { Job } from 'src/app/interfaces/job';
import { Plan } from 'src/app/interfaces/plan';
import { MatDialog } from '@angular/material';
import { MailDialogComponent } from 'src/app/core/mail-dialog/mail-dialog.component';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {
  @Input() channel: ChannelMeta;
  @Input() isOwner: boolean;
  @Output() loaded = new EventEmitter<boolean>();

  jobs: Job[];
  plans: Plan[];
  rate: number;

  constructor(
    private channelService: ChannelService,
    private planService: PlanService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    combineLatest([
      this.channelService.getJobs(this.channel.id),
      this.planService
        .getPlansByChannelId(this.channel.id)
        .pipe(map(plans => plans.filter(plan => plan.active)))
    ]).subscribe(([jobs, plans]) => {
      this.jobs = jobs.filter(job => job.public);
      this.plans = plans;
      this.loaded.emit(true);
    });
  }

  openMailDialog(email: string) {
    this.dialog.open(MailDialogComponent, {
      width: '640px',
      restoreFocus: false,
      autoFocus: false,
      data: this.channel.email
    });
  }
}
