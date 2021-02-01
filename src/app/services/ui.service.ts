import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  isMobile = this.deviceService.isMobile();
  breakpoints = {
    xsmall: false,
    small: false,
    medium: false,
    large: false,
  };

  constructor(
    private deviceService: DeviceDetectorService,
    private breakpointObserver: BreakpointObserver
  ) {
    this.breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((result) => {
        this.breakpoints.xsmall = result.matches;
      });
    this.breakpointObserver.observe([Breakpoints.Small]).subscribe((result) => {
      this.breakpoints.small = result.matches;
    });
    this.breakpointObserver
      .observe([Breakpoints.Medium])
      .subscribe((result) => {
        this.breakpoints.medium = result.matches;
      });
    this.breakpointObserver.observe([Breakpoints.Large]).subscribe((result) => {
      this.breakpoints.large = result.matches;
    });
  }
}
