import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss']
})
export class RootComponent implements OnInit {
  isLoading$ = this.loadingService.isLoading$;

  constructor(
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
  }

}
