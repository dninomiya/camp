import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  isLoading$ = this.loadingService.isLoading$;
  title = environment.title;

  constructor(
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
  }

}
