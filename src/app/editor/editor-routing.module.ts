import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorComponent } from './editor/editor.component';
import { LessonEditorGuard } from '../guards/lesson-editor.guard';


const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
    canDeactivate: [LessonEditorGuard],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditorRoutingModule { }
