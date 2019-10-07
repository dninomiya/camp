import { Component, OnInit } from '@angular/core';
import { PlanService } from 'src/app/services/plan.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { PaymentService } from 'src/app/services/payment.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmSubscribeDialogComponent } from '../confirm-subscribe-dialog/confirm-subscribe-dialog.component';
import { Plan } from 'src/app/interfaces/plan';
import { Observable, combineLatest } from 'rxjs';
import { UserSubscription } from 'src/app/interfaces/user-subscription';
import { CardDialogComponent } from 'src/app/shared/card-dialog/card-dialog.component';
import { ConfirmUnsubscribeDialogComponent } from 'src/app/core/confirm-unsubscribe-dialog/confirm-unsubscribe-dialog.component';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  plans$ = this.route.parent.params.pipe(
    switchMap(params => {
      this.channelId = params.id;
      return this.planService.getPlansByChannelId(
        params.id
      );
    }),
    map(plans => plans.sort((item, next) => item.amount > next.amount ? -1 : 1))
  );

  channelId: string;
  uid: string;

  userPayment$ = this.authService.authUser$.pipe(
    switchMap(user => {
      this.uid = user.id;
      return this.paymentService.getUserPayment(user.id);
    })
  );

  subscriptions$: Observable<UserSubscription[]> = this.authService.authUser$.pipe(
    switchMap(user => {
      return this.paymentService.getSubscriptions(user.id);
    })
  );

  items$ = combineLatest([
    this.userPayment$,
    this.subscriptions$,
    this.plans$
  ]).pipe(
    map(([payment, subscriptions, plans]) => {
      return plans.map(plan => {
        return {
          ...plan,
          subscription: subscriptions.find(subs => subs.planId === plan.id),
          payment
        };
      });
    })
  );

  constructor(
    private route: ActivatedRoute,
    private planService: PlanService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
  }

  subscribePlan(customerId: string, plan: Plan) {
    this.dialog.open(ConfirmSubscribeDialogComponent, {
      data: {
        customerId,
        plan,
        channelId: this.channelId
      },
      width: '800px',
      autoFocus: false,
      restoreFocus: false,
    });
  }

  openCardDialog() {
    this.dialog.open(CardDialogComponent, {
      restoreFocus: false,
      width: '560px',
    });
  }

  openUnsubscribeDialog(plan: Plan) {
    this.dialog.open(ConfirmUnsubscribeDialogComponent, {
      restoreFocus: false,
      data: {
        plan,
        uid: this.uid,
        channelId: this.channelId
      },
      width: '640px',
      autoFocus: false,
    });
  }

}
