import { Component } from '@angular/core';
import { LogUpdateService } from './services/log-update.service';
import { SeoService } from './services/seo.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  schema$: Observable<object> = this.seoService.schema$;

  constructor(
    private logUpdateService: LogUpdateService,
    private seoService: SeoService
  ) {
    if (!environment.production) {
      this.seoService.addNoIndex();
    }
  }
}
