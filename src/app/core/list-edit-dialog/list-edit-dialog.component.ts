import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { FormBuilder, Validators } from '@angular/forms';
import { ListService } from 'src/app/services/list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanService } from 'src/app/services/plan.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list-edit-dialog',
  templateUrl: './list-edit-dialog.component.html',
  styleUrls: ['./list-edit-dialog.component.scss']
})
export class ListEditDialogComponent implements OnInit {

  prices = [
    100,
    500,
    1000,
    1500,
    5000,
    10000,
    25000,
    50000,
    100000,
  ];

  imageOpts = {
    size: {
      width: 1920,
      height: 1080,
      limitMb: 2
    }
  };

  file: string;

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', [
      Validators.maxLength(400),
      Validators.required
    ]],
    private: [false],
    amount: [{
      value: '',
      disabled: true
    }],
    premium: [false]
  });

  plans$ = this.planService.getPlansByChannelId(
    this.authService.user.id
  );

  getFile(file: string) {
    this.file = file;
    this.form.markAsDirty();
  }

  constructor(
    private fb: FormBuilder,
    private listService: ListService,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private planService: PlanService,
    @Inject(MAT_DIALOG_DATA) public list?: LessonList
  ) {
  }

  ngOnInit() {
    this.form.get('premium').valueChanges.subscribe(status => {
      if (status) {
        this.form.get('amount').enable();
        this.form.get('amount').setValidators(Validators.required);
      } else {
        this.form.get('amount').disable();
        this.form.get('amount').clearValidators();
      }
    });
    if (this.list) {
      this.form.patchValue(this.list);
    }
  }

  update() {
    if (this.form.invalid) {
      return;
    }
    if (this.list) {
      this.listService.updateList({
        id: this.list.id,
        data: this.form.value,
        file: this.file
      }).then(() => {
        this.snackBar.open('コースを更新しました', null, {
          duration: 2000
        });
      });
    } else {
      this.listService.createList({
        ...this.form.value,
        authorId: this.authService.user.id
      }, this.file).then(() => {
        this.snackBar.open('コースを作成しました', null, {
          duration: 2000
        });
      });
    }
  }

}
