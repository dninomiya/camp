import { Subject, ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  isMobile = this.deviceService.isMobile();
  isMainNavOpenSource = new ReplaySubject();
  isMainNavOpen$ = this.isMainNavOpenSource.asObservable();
  constructor(
    private deviceService: DeviceDetectorService
  ) { }
}
