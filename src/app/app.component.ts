import { Component } from '@angular/core';
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

  constructor(private seoService: SeoService) {
    if (!environment.production) {
      this.seoService.addNoIndex();
    }
  }
}
