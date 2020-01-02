import { ListService } from 'src/app/services/list.service';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { Observable } from 'rxjs';
import { LessonService } from 'src/app/services/lesson.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cause',
  templateUrl: './cause.component.html',
  styleUrls: ['./cause.component.scss']
})
export class CauseComponent implements OnInit {
  lessons$: Observable<LessonMeta[]>;
  cause$: Observable<LessonList>;

  constructor(
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private listService: ListService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const listId = params.get('id');
      this.lessons$ = this.lessonService.getLessonsByListId(listId);
      this.cause$ = this.listService.getList(listId);
    });
  }

}
