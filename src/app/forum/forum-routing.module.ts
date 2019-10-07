import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForumRootComponent } from './forum-root/forum-root.component';
import { ThreadComponent } from './thread/thread.component';
import { ForumGuideComponent } from './forum-guide/forum-guide.component';


const routes: Routes = [
  {
    path: '',
    component: ForumRootComponent,
    children: [
      {
        path: ':id',
        component: ThreadComponent
      },
      {
        path: '',
        component: ForumGuideComponent
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ForumRoutingModule { }
