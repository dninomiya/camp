import { Tree } from 'src/app/interfaces/tree';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { PLAN } from 'src/app/services/plan.service';
import { UiService } from './../services/ui.service';
import { UserService } from 'src/app/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginDialogComponent } from './../login-dialog/login-dialog.component';
import { AuthService } from './../services/auth.service';
import { User } from 'src/app/interfaces/user';
import { switchMap, map, tap, catchError, take } from 'rxjs/operators';
import { LessonService } from 'src/app/services/lesson.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TreeSection } from './../interfaces/tree';
import { Observable, of, ReplaySubject } from 'rxjs';
import { TreeService } from './../services/tree.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDrawer } from '@angular/material/sidenav';
import { trigger, transition, style, animate } from '@angular/animations';
import { ViewportScroller } from '@angular/common';

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
  private atomicIdSource = new ReplaySubject<string>();
  private atomicId$: Observable<string> = this.atomicIdSource.asObservable();

  tree$: Observable<Tree> = this.treeService.getTree();
  plan = PLAN;
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
  doc$: Observable<LessonMeta> = this.atomicId$.pipe(
    switchMap((id) => this.lessonService.getLesson(id).pipe(take(1)))
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
    this.route.queryParamMap.subscribe((map) => {
      const id = map.get('id');
      if (id) {
        this.openDoc(id);
      }
    });

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

  openDoc(id: string) {
    this.docDrawer.open();
    this.atomicIdSource.next(id);
    this.router.navigate([], {
      queryParams: {
        id,
      },
    });
  }

  setActiveIds(sectionId: string, groupId: string, itemId: string) {
    this.active = {
      sectionId,
      groupId,
      itemId,
    };
  }

  onCloseDoc() {
    this.atomicIdSource.next(null);
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
