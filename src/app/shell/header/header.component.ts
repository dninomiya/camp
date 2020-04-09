import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';
import { tap } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() sideNav?: MatSidenav;
  @Input() isStudio: boolean;
  isLoading = true;
  noHeader: boolean;

  title = environment.title;
  loginWaiting: boolean;

  searchParameters = {
    hitsPerPage: 20,
    filters: 'NOT deleted:true',
  };

  user$: Observable<User> = this.authService.authUser$.pipe(
    tap((user: User) => {
      this.isLoading = false;
    }),
    tap((user) => {
      if (user) {
        this.loginWaiting = false;
      }
    })
  );
  unreadCount: number;
  isFrontRunnerAdmin: boolean;
  isMobile = this.uiService.isMobile;
  algoliaConfig = environment.algolia;

  constructor(private authService: AuthService, private uiService: UiService) {}

  login() {
    this.loginWaiting = true;
    this.authService.login().catch(() => (this.loginWaiting = false));
  }

  logout() {
    this.authService.logout();
  }

  toggleSideNav() {
    this.sideNav.toggle();
  }

  ngOnInit() {}
}
