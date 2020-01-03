import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-shell',
  templateUrl: './main-shell.component.html',
  styleUrls: ['./main-shell.component.scss']
})
export class MainShellComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sideNav', { static: true }) sideNav: MatSidenav;

  isLoading$ = this.loadingService.isLoading$;
  noHeader: boolean;
  noBottomNav: boolean;
  noFooter: boolean;
  hideNav: boolean;
  isMobile = this.uiService.isMobile;
  user$ = this.authService.authUser$;
  causeLoading$ = new BehaviorSubject(true);

  constructor(
    private loadingService: LoadingService,
    private cd: ChangeDetectorRef,
    private uiService: UiService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
    const getLastChild = (parent) => {
      return parent.firstChild ? getLastChild(parent.firstChild) : parent;
    };
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        const lastChild = getLastChild(this.route.firstChild).snapshot;
        this.noHeader = lastChild.data.noHeader;
        this.noBottomNav = lastChild.data.noBottomNav;
        this.noFooter = lastChild.data.noFooter;
        this.hideNav = lastChild.data.hideNav;
        if (this.isMobile) {
          this.sideNav.close();
        }
      }
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngOnDestroy() {
  }

  completeCauseList() {
    this.causeLoading$.next(false);
  }

}
