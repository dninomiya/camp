import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-studio-shell',
  templateUrl: './studio-shell.component.html',
  styleUrls: ['./studio-shell.component.scss']
})
export class StudioShellComponent implements OnInit {
  isLoading$ = this.loadingService.isLoading$;

  constructor(
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
  }

}
