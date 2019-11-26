import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelDetailComponent } from './channel-detail/channel-detail.component';
import { LessonsComponent } from './lessons/lessons.component';
import { ListsComponent } from './lists/lists.component';
import { PlansComponent } from './plans/plans.component';


const routes: Routes = [
  {
    path: ':id',
    component: ChannelDetailComponent,
    children: [
      {
        path: '',
        component: PlansComponent,
        pathMatch: 'full'
      },
      {
        path: 'lessons',
        component: LessonsComponent
      },
      {
        path: 'causes',
        component: ListsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChannelRoutingModule { }
