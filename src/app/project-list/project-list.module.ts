import { MatTableModule } from '@angular/material/table';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectListRoutingModule } from './project-list-routing.module';
import { ProjectListComponent } from './project-list/project-list.component';
import { MtgTypePipe } from './mtg-type.pipe';

@NgModule({
  declarations: [ProjectListComponent, MtgTypePipe],
  imports: [SharedModule, ProjectListRoutingModule, MatTableModule],
})
export class ProjectListModule {}
