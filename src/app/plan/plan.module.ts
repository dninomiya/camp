import { NgModule } from '@angular/core';
import { PlanListComponent } from './plan-list/plan-list.component';
import { SharedModule } from '../shared/shared.module';
import { PlanDialogComponent } from '../plan-dialog/plan-dialog.component';
import { PlanActionDialogWrapperComponent } from './plan-action-dialog-wrapper/plan-action-dialog-wrapper.component';
import { QuestionDialogComponent } from './question-dialog/question-dialog.component';
import { TroubleDialogComponent } from './trouble-dialog/trouble-dialog.component';
import { ReviewDialogComponent } from './review-dialog/review-dialog.component';
import { CoachingDialogComponent } from './coaching-dialog/coaching-dialog.component';
import { PremiumDialogComponent } from './premium-dialog/premium-dialog.component';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MatDatepickerModule } from '@angular/material';
import { JobListComponent } from './job-list/job-list.component';

@NgModule({
  declarations: [
    PlanListComponent,
    PlanDialogComponent,
    QuestionDialogComponent,
    PlanActionDialogWrapperComponent,
    TroubleDialogComponent,
    ReviewDialogComponent,
    CoachingDialogComponent,
    PremiumDialogComponent,
    JobListComponent,
  ],
  imports: [
    SharedModule,
    MatDatepickerModule,
    MatMomentDateModule
  ],
  exports: [
    PlanListComponent,
    JobListComponent
  ],
  entryComponents: [
    PlanDialogComponent,
    PlanActionDialogWrapperComponent
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
  ]
})
export class PlanModule { }
