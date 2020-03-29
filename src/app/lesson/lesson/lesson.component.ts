import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { Lesson } from 'src/app/interfaces/lesson';
import { Observable, combineLatest, of } from 'rxjs';
import {
  switchMap,
  tap,
  take,
  shareReplay,
  map,
  catchError
} from 'rxjs/operators';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { LessonService } from 'src/app/services/lesson.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/interfaces/user';
import { ListService } from 'src/app/services/list.service';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.scss']
})
export class LessonComponent implements OnInit, OnDestroy {
  loading = true;
  cause$: Observable<LessonList> = this.route.queryParamMap.pipe(
    switchMap(params => {
      const causeId = params.get('cause');
      if (causeId) {
        return this.listService.getList(causeId);
      } else {
        return of(null);
      }
    }),
    shareReplay(1)
  );
  lesson$: Observable<Lesson> = this.route.queryParamMap.pipe(
    tap(() => {
      this.loadingService.startLoading();
    }),
    switchMap(params => {
      const lid = params.get('v');
      if (lid) {
        return this.lessonService.getLesson(lid).pipe(take(1));
      } else {
        return of(null);
      }
    }),
    catchError(error => {
      console.error(error);
      return of(null);
    }),
    tap(() => this.loadingService.endLoading()),
    shareReplay(1)
  );

  user$: Observable<User> = this.authService.authUser$;

  isOwner$: Observable<boolean> = combineLatest([
    this.user$.pipe(),
    this.lesson$.pipe()
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

  channel$: Observable<ChannelMeta> = this.lesson$.pipe(
    switchMap(lesson => {
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
    private listService: ListService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
