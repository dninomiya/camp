import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  isMobile = this.deviceService.isMobile();
  isMainNavOpenSource = new ReplaySubject(1);
  isMainNavOpen$ = this.isMainNavOpenSource.asObservable();
  constructor(private deviceService: DeviceDetectorService) {}
}
