import { Component, OnInit, Input } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { switchMap, take } from 'rxjs/operators';
import { LessonService } from 'src/app/services/lesson.service';
import { DecimalPipe } from '@angular/common';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { ChannelMeta } from 'src/app/interfaces/channel';

@Component({
  selector: 'app-cause-widget',
  templateUrl: './cause-widget.component.html',
  styleUrls: ['./cause-widget.component.scss'],
  providers: [DecimalPipe],
})
export class CauseWidgetComponent implements OnInit {
  @Input() cause$: Observable<LessonList>;
  @Input() channel: ChannelMeta;

  lessons$: Observable<LessonMeta[]>;

  constructor(private lessonService: LessonService) {}

  ngOnInit() {
    this.lessons$ = this.cause$.pipe(
      switchMap((cause) => {
        if (cause && cause.lessonIds.length) {
          return forkJoin(
            cause.lessonIds.map((id) => {
              return this.lessonService.getLessonMeta(id).pipe(take(1));
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }
}
