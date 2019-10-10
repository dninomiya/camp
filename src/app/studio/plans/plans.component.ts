import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Plan } from 'src/app/interfaces/plan';
import { Observable } from 'rxjs';
import { PlanService } from 'src/app/services/plan.service';
import { PaymentService } from 'src/app/services/payment.service';
import { map, tap } from 'rxjs/operators';
import { ChannelService } from 'src/app/services/channel.service';
import { MatSlideToggleChange, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {


  plans$: Observable<Plan[]> = this.planService.getPlansByChannelId(
    this.authService.user.id
  );

  accountId$: Observable<string> = this.paymentService.getStirpeAccountId(
    this.authService.user.id
  );

  isLoading = true;

  limit = {
    totalLikeCount: 1,
    totalLikedCount: 1,
    publicLessonCount: 1,
    followerCount: 0
  };

  nowStatus;

  permission$: Observable<boolean> = this.channelService.getChannel(
    this.authService.user.id
  ).pipe(map(channel => {
    this.isLoading = false;
    this.nowStatus = {
      followerCount: channel.followerCount,
      ...channel.statistics
    };
    return channel.statistics &&
      channel.statistics.publicLessonCount >= this.limit.publicLessonCount &&
      channel.statistics.totalLikedCount >= this.limit.totalLikedCount &&
      channel.statistics.totalLikeCount >= this.limit.totalLikeCount &&
      channel.followerCount >= this.limit.followerCount;
  }));

  constructor(
    private authService: AuthService,
    private planService: PlanService,
    private paymentService: PaymentService,
    private channelService: ChannelService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
  }

  changeStatus(plan: Plan, status: MatSlideToggleChange) {
    this.planService.updatePlan(
      this.authService.user.id,
      {
        ...plan,
        active: status.checked
      }
    ).then(() => {
      this.snackBar.open(`プランを${status.checked ? '公開' : '非公開'}しました`, null, {
        duration: 2000
      });
    });
  }
}
