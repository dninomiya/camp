import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { IsaRoutingModule } from './isa-routing.module';
import { IsaComponent } from './isa.component';

@NgModule({
  declarations: [IsaComponent],
  imports: [SharedModule, IsaRoutingModule]
})
export class IsaModule {}
