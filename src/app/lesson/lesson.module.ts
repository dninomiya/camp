import { NgModule } from '@angular/core';
import { LessonRoutingModule } from './lesson-routing.module';
import { LessonComponent } from './lesson/lesson.component';
import { SharedModule } from '../shared/shared.module';
import { MatDialogModule } from '@angular/material/dialog';
import { PlanModule } from '../plan/plan.module';
import { CauseWidgetComponent } from './cause-widget/cause-widget.component';
import { ArticleComponent } from './article/article.component';


@NgModule({
  declarations: [LessonComponent, CauseWidgetComponent, ArticleComponent],
  imports: [
    SharedModule,
    LessonRoutingModule,
    MatDialogModule,
    PlanModule
  ]
})
export class LessonModule { }
