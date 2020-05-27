import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-input-dialog',
  templateUrl: './input-dialog.component.html',
  styleUrls: ['./input-dialog.component.scss'],
})
export class InputDialogComponent implements OnInit {
  ctrl = new FormControl(null, [Validators.required]);

  constructor(
    private dialog: MatDialogRef<InputDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private oldTitle: string
  ) {}

  ngOnInit(): void {
    if (this.oldTitle) {
      this.ctrl.patchValue(this.oldTitle);
    }
  }

  submit(title: string) {
    if (title) {
      this.dialog.close(title);
    }
  }
}
