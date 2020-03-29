import { Component, OnInit, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-tag-editor-dialog',
  templateUrl: './tag-editor-dialog.component.html',
  styleUrls: ['./tag-editor-dialog.component.scss']
})
export class TagEditorDialogComponent implements OnInit {
  algoliaConfig = environment.algolia;
  tags = new FormControl('');

  constructor(
    private dialogRef: MatDialogRef<TagEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public oldTags?
  ) {}

  ngOnInit() {}

  updateTags(tags) {
    this.tags.patchValue(tags);
    this.tags.markAsDirty();
  }

  saveTags() {
    this.dialogRef.close(this.tags.value.map(tag => tag.label));
  }
}
