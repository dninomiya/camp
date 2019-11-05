import { NgModule } from '@angular/core';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor/editor.component';
import { SharedModule } from '../shared/shared.module';
import { NgxPicaModule } from '@digitalascetic/ngx-pica';
import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde';
import { MatDialogModule } from '@angular/material/dialog';
import { LessonGuideComponent } from './lesson-guide/lesson-guide.component';
import { EditorHelpComponent } from './editor-help/editor-help.component';
import { NgxFilesizeModule } from 'ngx-filesize';
import { VimeoDialogComponent } from './vimeo-dialog/vimeo-dialog.component';
import { NgAisModule } from 'angular-instantsearch';


@NgModule({
  declarations: [EditorComponent, LessonGuideComponent, EditorHelpComponent, VimeoDialogComponent],
  imports: [
    SharedModule,
    EditorRoutingModule,
    NgxPicaModule,
    NgxFilesizeModule,
    MatDialogModule,
    NgAisModule,
    SimplemdeModule.forRoot({
      provide: SIMPLEMDE_CONFIG,
      useValue: {
        status: false,
        lineNumbers: false,
        spellChecker: false,
        indentWithTabs: false,
        hideIcons: [
          'fullscreen',
          'side-by-side',
          'preview'
        ],
        showIcons: [
          'table',
          'code'
        ]
      }
    })
  ],
  entryComponents: [
    LessonGuideComponent,
    EditorHelpComponent,
    VimeoDialogComponent
  ]
})
export class EditorModule { }
