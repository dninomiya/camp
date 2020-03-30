import { AuthService } from './../../services/auth.service';
import { tap, switchMap } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { ListService } from 'src/app/services/list.service';

@Component({
  selector: 'app-cause-list',
  templateUrl: './cause-list.component.html',
  styleUrls: ['./cause-list.component.scss']
})
export class CauseListComponent implements OnInit {
  causes$: Observable<LessonList[]> = this.listService
    .getLists(
      environment.production
        ? 'ypPxvg7WBUPkYZDN7ao3VyLs9OL2'
        : 'eX5RTeZF9Iape0Se9iPXlIwaU273'
    )
    .pipe(tap(_ => this.complete.emit(true)));

  @Output() complete = new EventEmitter();

  constructor(
    private listService: ListService,
    private authService: AuthService
  ) {}

  ngOnInit() {}
}
