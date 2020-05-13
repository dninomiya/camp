import { NgxPicaModule } from '@digitalascetic/ngx-pica';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';

import { ProjectEditorRoutingModule } from './project-editor-routing.module';
import { ProjectEditorComponent } from './project-editor.component';

@NgModule({
  declarations: [ProjectEditorComponent],
  imports: [
    SharedModule,
    NgxPicaModule,
    ProjectEditorRoutingModule,
    MatDatepickerModule,
  ],
})
export class ProjectEditorModule {}
