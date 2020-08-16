import { UiService } from './../services/ui.service';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { AuthService } from './../services/auth.service';
import { User } from 'src/app/interfaces/user';
import { Lesson } from './../interfaces/lesson';
import { switchMap, map, tap, catchError } from 'rxjs/operators';
import { LessonService } from 'src/app/services/lesson.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TreeSection, TreeItem, TreeGroup } from './../interfaces/tree';
import { Observable, combineLatest, of, ReplaySubject } from 'rxjs';
import { TreeService } from './../services/tree.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { trigger, transition, style, animate } from '@angular/animations';
import { ViewportScroller } from '@angular/common';

interface ItemWithLesson extends TreeItem {
  lesson: Lesson;
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1000ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class TreeComponent implements OnInit {
  @ViewChild('docDrawer') private docDrawer: MatDrawer;
  private uid: string;
  private treeItemSource = new ReplaySubject<TreeItem>();
  private treeItem$: Observable<TreeItem> = this.treeItemSource.asObservable();

  lastPos: [number, number];
  activeLessonId: string;
  active: {
    sectionId?: string;
    groupId?: string;
    itemId?: string;
  } = {};
  isLoading = true;
  user$: Observable<User> = this.authService.authUser$.pipe(
    tap((user) => {
      this.isLoading = false;
      this.uid = user?.id;
    })
  );
  sections$: Observable<TreeSection[]> = this.treeService.getAllSections();
  completeMap: object = {};
  doc$: Observable<ItemWithLesson> = this.treeItem$.pipe(
    switchMap((treeItem) => {
      if (treeItem) {
        this.activeLessonId = treeItem.lessonId;
        return combineLatest([
          of(treeItem),
          this.lessonService
            .getLesson(treeItem.lessonId)
            .pipe(catchError(() => of(null))),
        ]);
      } else {
        return of(null);
      }
    }),
    map((result) => {
      if (result) {
        const [treeItem, lesson] = result;
        return {
          ...treeItem,
          lesson,
        };
      } else {
        return null;
      }
    })
  );

  constructor(
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private treeService: TreeService,
    private userService: UserService,
    private lessonService: LessonService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    public uiService: UiService,
    private viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    combineLatest([this.sections$, this.route.queryParamMap]).subscribe(
      ([sections, queryMap]) => {
        const id = queryMap.get('id');
        if (id) {
          sections.some((section) => {
            let status: boolean;
            Object.values(section.group).some((group) => {
              if (group.item[id]) {
                this.openDoc(group.item[id]);
                status = true;
                this.setActiveIds(section.id, group.id, id);
                return true;
              }
            });
            return status;
          });
        }
      }
    );

    this.user$
      .pipe(
        switchMap((user) => {
          if (user) {
            return this.userService.getSkillStatus(user.id);
          } else {
            return of(null);
          }
        })
      )
      .subscribe((skillStatus) => (this.completeMap = skillStatus || {}));
  }

  openDoc(item: TreeItem) {
    this.docDrawer.open();
    this.treeItemSource.next(item);
    this.router.navigate([], {
      queryParams: {
        id: item.id,
      },
    });
    this.lastPos = this.viewportScroller.getScrollPosition();
  }

  setActiveIds(sectionId: string, groupId: string, itemId: string) {
    this.active = {
      sectionId,
      groupId,
      itemId,
    };
  }

  onCloseDoc() {
    this.treeItemSource.next(null);
    this.router.navigate([], {
      queryParams: {
        id: null,
      },
    });
  }

  toggleStatus(id: string) {
    if (!this.uid) {
      this.dialog
        .open(LoginDialogComponent)
        .afterClosed()
        .subscribe((status) => {
          if (status) {
            this.authService.login();
          }
        });
    } else {
      const status = !this.completeMap[id];
      if (status) {
        this.userService.completeSkill(this.uid, id);
      } else {
        this.userService.uncompleteSkill(this.uid, id);
      }
      if (status) {
        this.snackBar.open('お疲れ様でした！🎉');
      }
    }
  }

  login() {
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }
}
