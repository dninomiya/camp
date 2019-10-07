import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { LessonsComponent } from './lessons/lessons.component';
import { ListsComponent } from './lists/lists.component';
import { PlansComponent } from './plans/plans.component';
import { StudioShellComponent } from '../shell/studio-shell/studio-shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GuideComponent } from './plans/guide/guide.component';
import { PlanDetailComponent } from './plans/plan-detail/plan-detail.component';
import { SettingsComponent } from './plans/settings/settings.component';


const routes: Routes = [
  {
    path: '',
    component: StudioShellComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'about'
      },
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'lessons',
        component: LessonsComponent
      },
      {
        path: 'lists',
        component: ListsComponent
      },
      {
        path: 'plans',
        component: PlansComponent,
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'guide'
          },
          {
            path: 'guide',
            component: GuideComponent
          },
          {
            path: 'settings',
            component: SettingsComponent
          },
          {
            path: ':type',
            component: PlanDetailComponent
          },
        ]
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudioRoutingModule { }
