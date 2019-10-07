import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { PaymentService } from 'src/app/services/payment.service';
import { JobCard } from 'src/app/interfaces/job-card';
import { ChannelMeta } from 'src/app/interfaces/channel';

@Component({
  selector: 'app-job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {

  @Input() jobs: JobCard[];
  @Input() channel: ChannelMeta;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router,
    private paymentService: PaymentService
  ) { }

  ngOnInit() {
  }

}
