import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Job } from 'src/app/interfaces/job';

@Component({
  selector: 'app-job-dialog',
  templateUrl: './job-dialog.component.html',
  styleUrls: ['./job-dialog.component.scss']
})
export class JobDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public job: Job
  ) { }

  ngOnInit() {}

}
