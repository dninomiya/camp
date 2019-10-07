import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-shared-confirm-dialog',
  templateUrl: './shared-confirm-dialog.component.html',
  styleUrls: ['./shared-confirm-dialog.component.scss']
})
export class SharedConfirmDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      title: string;
      description: string;
    }
  ) { }

  ngOnInit() {
  }

}
