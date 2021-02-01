import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudioShellComponent } from '../shell/studio-shell/studio-shell.component';
import { AboutComponent } from './about/about.component';
import { LessonsComponent } from './lessons/lessons.component';
import { ListsComponent } from './lists/lists.component';
import { UserListComponent } from './user-list/user-list.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudioRoutingModule {}
