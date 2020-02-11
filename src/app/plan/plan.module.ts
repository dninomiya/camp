import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { UserCardComponent } from './user-card/user-card.component';

@NgModule({
  declarations: [UserCardComponent],
  imports: [SharedModule],
  exports: [UserCardComponent],
  providers: []
})
export class PlanModule {}
