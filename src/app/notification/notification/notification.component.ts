import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  unreadCount: number;
  notifications$ = this.authService.authUser$.pipe(
    switchMap(user => {
      return this.notificationService
      .getNotifications(user.id)
      .pipe(
        tap(items => {
          this.unreadCount = items.filter(item => !item.isRead).length;
        })
      );
    })
  );

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

}
