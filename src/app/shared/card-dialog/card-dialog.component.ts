import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-card-dialog',
  templateUrl: './card-dialog.component.html',
  styleUrls: ['./card-dialog.component.scss']
})
export class CardDialogComponent implements OnInit {

  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<CardDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: {
      customerId: string;
    }
  ) { }

  ngOnInit() {
    this.isEdit = !!this.data.customerId;
  }

  saved() {
    this.dialogRef.close();
    this.snackBar.open(`カードを${this.isEdit ? '変更' : '作成'}しました`, null, {
      duration: 2000
    });
  }

}
