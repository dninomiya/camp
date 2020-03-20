import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, take, map, shareReplay } from 'rxjs/operators';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelService } from 'src/app/services/channel.service';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { ListService } from 'src/app/services/list.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  algoliaConfig = {
    ...environment.algolia,
    indexName: 'users'
  };
  searchParameters = {
    hitsPerPage: 10,
    page: 0,
    filters: `(authorId:${this.authService.user.id}) AND NOT deleted:true`
  };
  causes$: Observable<LessonList[]> = this.route.parent.params.pipe(
    switchMap(({ id }) => {
      return this.listService.getLists(id).pipe(take(1));
    }),
    shareReplay(1)
  );
  users$ = this.userService.getUsers();
  displayedColumns: string[] = ['name', 'plan', 'createdAt', 'action'];
  dataSource: LessonMeta[];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private channelService: ChannelService,
    private paginator: MatPaginatorIntl,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private listService: ListService
  ) {
    this.paginator.itemsPerPageLabel = '1 ページあたりの行数';
    this.paginator.nextPageLabel = '次のページへ';
    this.paginator.previousPageLabel = '次のページへ';
    this.paginator.lastPageLabel = '最後のページへ';
    this.paginator.firstPageLabel = '先頭のページへ';
    this.paginator.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number
    ) => {
      if (length === 0 || pageSize === 0) {
        return `0 of ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex =
        startIndex < length
          ? Math.min(startIndex + pageSize, length)
          : startIndex + pageSize;
      return `${startIndex + 1}～${endIndex} / 合計 ${length}`;
    };
  }

  ngOnInit() {}

  changePager(event) {
    this.searchParameters.page = event.pageIndex;
    this.searchParameters.hitsPerPage = event.pageSize;
  }

  buildLists(data) {
    this.dataSource = [null];
    return data;
  }
}
