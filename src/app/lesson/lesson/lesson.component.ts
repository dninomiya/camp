import { Component, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { Observable, combineLatest, of } from 'rxjs';
import { switchMap, take, shareReplay, map, catchError } from 'rxjs/operators';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { LessonService } from 'src/app/services/lesson.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { ListService } from 'src/app/services/list.service';
import { LessonList } from 'src/app/interfaces/lesson-list';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit {
  loading = true;
  lessonId$: Observable<string> = this.route.queryParamMap.pipe(
    map((params) => params.get('v'))
  );
  cause$: Observable<LessonList> = this.route.queryParamMap.pipe(
    switchMap((params) => {
      const causeId = params.get('cause');
      if (causeId) {
        return this.listService.getList(causeId);
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );
  lessonMeta$: Observable<LessonMeta> = this.lessonId$.pipe(
    switchMap((id) => {
      if (id) {
        return this.lessonService.getLessonMeta(id).pipe(take(1));
      } else {
        return of(null);
      }
    }),
    catchError((error) => {
      console.error(error);
      return of(null);
    }),
    shareReplay(1)
  );

  user$: Observable<User> = this.authService.authUser$;

  isOwner$: Observable<boolean> = combineLatest([
    this.user$,
    this.lessonMeta$,
  ]).pipe(
    map(([user, lesson]) => {
      if (user) {
        return user.id === lesson.authorId;
      } else {
        return false;
      }
    }),
    shareReplay(1)
  );

  channel$: Observable<ChannelMeta> = this.lessonMeta$.pipe(
    switchMap((lesson) => {
      if (lesson) {
        return this.channelService.getChannel(lesson.channelId).pipe(take(1));
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );

  constructor(
    private channelService: ChannelService,
    private route: ActivatedRoute,
    private lessonService: LessonService,
    private authService: AuthService,
    private listService: ListService
  ) {}

  ngOnInit() {}
}
