import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TreeRoutingModule } from './tree-routing.module';
import { TreeComponent } from './tree.component';

@NgModule({
  declarations: [TreeComponent],
  imports: [
    SharedModule,
    TreeRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
})
export class TreeModule {}
