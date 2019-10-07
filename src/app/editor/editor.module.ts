import { NgModule } from '@angular/core';

import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor/editor.component';
import { SharedModule } from '../shared/shared.module';
import { NgxPicaModule } from '@digitalascetic/ngx-pica';
import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde';
import { VideoUploaderComponent } from './video-uploader/video-uploader.component';
import { MatDialogModule } from '@angular/material/dialog';
import { LessonGuideComponent } from './lesson-guide/lesson-guide.component';
import { EditorHelpComponent } from './editor-help/editor-help.component';


@NgModule({
  declarations: [EditorComponent, VideoUploaderComponent, LessonGuideComponent, EditorHelpComponent],
  imports: [
    SharedModule,
    EditorRoutingModule,
    NgxPicaModule,
    MatDialogModule,
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
    VideoUploaderComponent,
    LessonGuideComponent,
    EditorHelpComponent,
  ]
})
export class EditorModule { }
