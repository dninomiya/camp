import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';
import { TaskComponent } from './task/task.component';
import { RepoSelectorComponent } from './repo-selector/repo-selector.component';


@NgModule({
  declarations: [UserComponent, TaskComponent, RepoSelectorComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
