import { NgAisModule } from 'angular-instantsearch';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CauseRoutingModule } from './cause-routing.module';
import { CauseComponent } from './cause/cause.component';


@NgModule({
  declarations: [CauseComponent],
  imports: [
    CommonModule,
    CauseRoutingModule,
    SharedModule,
    NgAisModule
  ]
})
export class CauseModule { }
