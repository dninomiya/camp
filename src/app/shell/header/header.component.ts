import { Component, OnInit, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UiService } from 'src/app/services/ui.service';
import { tap, switchMap } from 'rxjs/operators';
import { Notification } from 'src/app/interfaces/notification';
import { MatSidenav } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';
import { ChannelService } from 'src/app/services/channel.service';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() sideNav?: MatSidenav;
  @Input() isStudio: boolean;
  isLoading = true;
  noHeader: boolean;

  searchParameters = {
    hitsPerPage: 5,
    filters: 'NOT deleted:true'
  };

  user$: Observable<ChannelMeta> = this.authService.authUser$.pipe(
    tap((user: User) => {
      this.isLoading = false;
      if (user && !this.notifications$) {
        this.notifications$ = this.notificationService
          .getNotifications(user.id)
          .pipe(
            tap(items => {
              this.unreadCount = items.filter(item => !item.isRead).length;
            })
          );
      }
    }),
    switchMap(user => {
      if (user) {
        return this.channelService.getChannel(user.id);
      } else {
        return of(null);
      }
    })
  );
  notifications$: Observable<Notification[]>;
  unreadCount: number;
  isFrontRunnerAdmin: boolean;
  isMobile = this.uiService.isMobile;
  algoliaConfig = environment.algolia;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private uiService: UiService,
    private channelService: ChannelService,
  ) {
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  toggleSideNav() {
    this.sideNav.toggle();
  }

  clearNotifications() {
    this.notificationService.clearNotifications(this.authService.afUser.uid);
  }

  ngOnInit() {}
}
