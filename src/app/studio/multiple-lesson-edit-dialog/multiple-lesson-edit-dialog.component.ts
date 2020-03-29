import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-multiple-lesson-edit-dialog',
  templateUrl: './multiple-lesson-edit-dialog.component.html',
  styleUrls: ['./multiple-lesson-edit-dialog.component.scss']
})
export class MultipleLessonEditDialogComponent implements OnInit {
  form = this.fb.group({
    free: [false]
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public count: number
  ) {}

  ngOnInit() {}
}
