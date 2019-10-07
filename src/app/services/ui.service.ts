import { Injectable } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  isMobile = this.deviceService.isMobile();
  constructor(
    private deviceService: DeviceDetectorService
  ) { }
}
