import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TreeEditorRoutingModule } from './tree-editor-routing.module';
import { TreeEditorComponent } from './tree-editor.component';
import { InputDialogComponent } from './input-dialog/input-dialog.component';

@NgModule({
  declarations: [TreeEditorComponent, InputDialogComponent],
  imports: [SharedModule, TreeEditorRoutingModule, DragDropModule],
})
export class TreeEditorModule {}
