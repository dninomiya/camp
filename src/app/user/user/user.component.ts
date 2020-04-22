import { firestore } from 'firebase/app';
import * as moment from 'moment';

import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from './../../services/auth.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  user$: Observable<User> = this.userService.getUser(this.authService.user.id);
  dayCost = 16666;
  maxCost = 3000000;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  ngOnInit() {}

  getDays(
    start: firestore.Timestamp,
    end: firestore.Timestamp = firestore.Timestamp.now()
  ): number {
    return moment(end.toMillis()).diff(moment(start.toMillis()), 'days');
  }

  getTotalPay(start: firestore.Timestamp, end: firestore.Timestamp): number {
    return Math.min(this.getDays(start, end) * this.dayCost, this.maxCost);
  }

  getPayLimit(end: firestore.Timestamp) {
    return moment(end.toDate()).add(5, 'years').toDate();
  }
}
