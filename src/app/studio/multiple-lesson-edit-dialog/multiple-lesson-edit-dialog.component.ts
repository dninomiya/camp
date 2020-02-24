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
    premium: [false],
    amount: []
  });

  amounts = [100, 500, 1000, 1500, 5000, 10000, 25000, 50000, 100000];

  get amount(): number {
    return this.form.get('amount').value;
  }

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public count: number
  ) {
    this.form.get('premium').valueChanges.subscribe(status => {
      if (status) {
        this.form.get('amount').setValidators(Validators.required);
        this.form.get('amount').enable();
      } else {
        this.form.get('amount').clearValidators();
        this.form.get('amount').disable();
      }
    });
  }

  ngOnInit() {}
}
