import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, ActivationEnd, ActivatedRoute } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-main-shell',
  templateUrl: './main-shell.component.html',
  styleUrls: ['./main-shell.component.scss']
})
export class MainShellComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sideNav', {static: true}) sideNav: MatSidenav;

  isLoading$ = this.loadingService.isLoading$;
  noHeader: boolean;
  isMobile = this.uiService.isMobile;

  constructor(
    private loadingService: LoadingService,
    private cd: ChangeDetectorRef,
    private uiService: UiService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.noHeader = this.route.firstChild.snapshot.data.noHeader;
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

}
