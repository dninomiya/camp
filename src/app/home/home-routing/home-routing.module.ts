import { NgModule } from '@angular/core';
import { HomeComponent } from '../home/home.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    data: {
      type: 'viewCount',
    },
    component: HomeComponent
  },
  {
    path: 'feed/favorite',
    data: {
      type: 'favorite',
    },
    component: HomeComponent
  },
  {
    path: 'feed/subscriptions',
    data: {
      type: 'subscriptions',
    },
    component: HomeComponent
  },
  {
    path: 'feed/trending',
    data: {
      type: 'trending',
    },
    component: HomeComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
