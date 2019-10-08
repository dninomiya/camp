import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { Job } from 'src/app/interfaces/job';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { JobDialogComponent } from '../job-dialog/job-dialog.component';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  @Input() jobs: Job[];
  @Input() channel: ChannelMeta;

  constructor(
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
  }

  openJobDialog(data: Job) {
    this.dialog.open(JobDialogComponent, {
      autoFocus: false,
      restoreFocus: false,
      data,
      width: '400px',
      panelClass: 'no-padding',
    });
  }

}
