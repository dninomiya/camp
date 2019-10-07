import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { ChannelService } from 'src/app/services/channel.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-shell',
  templateUrl: './main-shell.component.html',
  styleUrls: ['./main-shell.component.scss']
})
export class MainShellComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sideNav', {static: true}) sideNav: MatSidenav;

  isLoading$ = this.loadingService.isLoading$;

  constructor(
    private uiService: UiService,
    private loadingService: LoadingService,
    private cd: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private channelService: ChannelService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngOnDestroy() {
  }

}
