import { Component, OnInit } from '@angular/core';
import { ListService } from 'src/app/services/list.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, map, tap } from 'rxjs/operators';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  lists$: Observable<LessonList[]> = this.route.parent.params.pipe(
    switchMap(({id}) => {
      return this.listService.getLists(id);
    }),
    map(lists => {
      const result = lists.filter(list => {
        return list.lessonIds && list.lessonIds.length > 0;
      });

      if (!result || !result.length) {
        return null;
      } else {
        return result;
      }
    }),
  );

  constructor(
    private route: ActivatedRoute,
    private listService: ListService,
    private dialog: MatDialog
  ) {

  }

  ngOnInit() {
  }

}
