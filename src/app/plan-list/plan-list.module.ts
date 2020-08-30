import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { PlanListRoutingModule } from './plan-list-routing.module';
import { PlanListComponent } from './plan-list.component';

@NgModule({
  declarations: [PlanListComponent],
  imports: [SharedModule, PlanListRoutingModule],
  exports: [PlanListComponent],
})
export class PlanListModule {}
