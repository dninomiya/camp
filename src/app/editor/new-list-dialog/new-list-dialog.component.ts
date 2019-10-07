import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ListService } from 'src/app/services/list.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlanService } from 'src/app/services/plan.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-new-list-dialog',
  templateUrl: './new-list-dialog.component.html',
  styleUrls: ['./new-list-dialog.component.scss']
})
export class NewListDialogComponent implements OnInit {

  form: FormGroup = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    private: [false, Validators.required],
    permissions: ['']
  });

  plans$ = this.planService.getPlansByChannelId(
    this.authService.user.id
  );

  constructor(
    private listService: ListService,
    public dialogRef: MatDialogRef<NewListDialogComponent>,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private planService: PlanService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) private data: {
      uid: string
    }
  ) { }

  ngOnInit() {
  }

  createList() {
      this.listService.createList({
        authorId: this.data.uid,
        ...this.form.value
      }).then(() => {
        this.snackBar.open('リストを追加しました', null, {
          duration: 2000
        });
      });
      this.dialogRef.close(true);
  }

}
