import { PlanManageShellComponent } from './plan-manage-shell/plan-manage-shell.component';
import { PlanManageComponent } from './plan-manage/plan-manage.component';
import { UserListComponent } from './user-list/user-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LessonsComponent } from './lessons/lessons.component';
import { ListsComponent } from './lists/lists.component';
import { StudioShellComponent } from '../shell/studio-shell/studio-shell.component';

const routes: Routes = [
  {
    path: '',
    component: StudioShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'about',
      },
      {
        path: 'about',
        component: AboutComponent,
      },
      {
        path: 'lessons',
        component: LessonsComponent,
      },
      {
        path: 'lists',
        component: ListsComponent,
      },
      {
        path: 'users',
        component: UserListComponent,
      },
      {
        path: 'plans',
        component: PlanManageShellComponent,
        children: [
          {
            path: 'plan',
            component: PlanManageComponent,
          },
          {
            path: 'create',
            component: PlanManageComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudioRoutingModule {}
