import { Component, OnInit } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {

  isMobile = this.uiService.isMobile;

  constructor(
    private uiService: UiService
  ) { }

  ngOnInit() {
  }

}
