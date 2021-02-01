import { Location } from '@angular/common';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NgxPicaErrorInterface,
  NgxPicaService,
} from '@digitalascetic/ngx-pica';
import { addedDiff, updatedDiff } from 'deep-object-diff';
import { Simplemde } from 'ng2-simplemde';
import { combineLatest, Observable, of } from 'rxjs';
import {
  debounceTime,
  shareReplay,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { ListEditDialogComponent } from 'src/app/core/list-edit-dialog/list-edit-dialog.component';
import { TagEditorDialogComponent } from 'src/app/core/tag-editor-dialog/tag-editor-dialog.component';
import { Lesson } from 'src/app/interfaces/lesson';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { ChannelService } from 'src/app/services/channel.service';
import { LessonService } from 'src/app/services/lesson.service';
import { ListService } from 'src/app/services/list.service';
import { PlanService } from 'src/app/services/plan.service';
import { StorageService } from 'src/app/services/storage.service';
import { VimeoService } from 'src/app/services/vimeo.service';
import { environment } from 'src/environments/environment';
import { EditorHelpComponent } from '../editor-help/editor-help.component';
import { LessonGuideComponent } from '../lesson-guide/lesson-guide.component';
import { VimeoDialogComponent } from '../vimeo-dialog/vimeo-dialog.component';
import { VimeoHelpDialogComponent } from '../vimeo-help-dialog/vimeo-help-dialog.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  @ViewChild('body', {
    static: false,
  })
  simplemde: Simplemde;
  prices: number[] = [100, 500, 1000, 1500, 5000, 10000, 25000, 50000, 100000];

  thumbnailOption = {
    path: '',
    size: {
      width: 1800,
      height: 1075.2,
      limitMb: 3,
    },
  };

  algoliaConfig = environment.algolia;
  oldThumbnail: string;
  uploadStep$ = this.vimeoService.uploadStep$;
  user$ = this.authService.authUser$.pipe(shareReplay(1));
  lists$: Observable<LessonList[]> = this.user$.pipe(
    switchMap((user) => {
      return this.channelService.getListByChannelId(environment.hostChannel);
    }),
    tap((lists) => (this.lists = lists))
  );
  lists: LessonList[];
  isLoading: boolean;
  postLoading: boolean;
  causeId: string;
  oldLesson: Lesson;
  isComplete: boolean;
  thumbnail: string;
  opts: any = {
    autofocus: true,
    toolbar: [
      'bold',
      'italic',
      'heading',
      'code',
      'quote',
      'unordered-list',
      'ordered-list',
      'link',
      'table',
      {
        name: 'image',
        action: this.selectImage.bind(this),
        className: 'fa fa-picture-o',
        title: '画像を挿入',
      },
      '|',
      {
        name: 'Help',
        action: this.openHelpDialog.bind(this),
        className: 'fa fa-question-circle',
        title: '使い方',
      },
    ],
  };

  codemirrorOpts = {
    lineNumbers: false,
  };

  oldLesson$: Observable<Lesson>;
  isValidWaiting: boolean;
  revisionId: string;

  readyImages = [];

  form = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    tags: [[]],
    videoId: [''],
    public: [true, Validators.required],
    free: [false],
  });

  listControl = new FormControl('');

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private ngxPicaService: NgxPicaService,
    private dialog: MatDialog,
    private planService: PlanService,
    private channelService: ChannelService,
    private lessonService: LessonService,
    private location: Location,
    private listService: ListService,
    private vimeoService: VimeoService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      const tag = params.get('tag');
      this.revisionId = params.get('r');
      if (tag === 'mentor') {
        this.form.patchValue({
          tags: ['mentor'],
        });
      }
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.oldLesson$ = this.route.queryParams.pipe(
      switchMap((params) => {
        if (params.v) {
          return this.lessonService.getLesson(params.v).pipe(take(1));
        } else {
          return of(null);
        }
      }),
      tap((lesson: Lesson) => {
        if (lesson) {
          this.thumbnailOption.path = `lessons/${lesson.id}/thumbnail`;
          this.oldLesson = lesson;
          this.opts.autofocus = true;
          this.form.patchValue(lesson);
          this.oldThumbnail = lesson.thumbnailURL;
        }
        this.isLoading = false;
      }),
      shareReplay(1)
    );

    combineLatest([this.oldLesson$, this.lists$]).subscribe(
      ([oldLesson, lists]) => {
        if (oldLesson && lists) {
          this.listControl.patchValue(
            lists
              .filter((list) => list.lessonIds.includes(oldLesson.id))
              .map((list) => list.id)
          );
        }
      }
    );

    this.form
      .get('body')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((res) => {
        (window as any).twttr.widgets.load();
      });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      $event.preventDefault();
      $event.returnValue = true;
    }
  }

  submit(user: User) {
    let action;
    this.postLoading = true;
    const activeListIds = this.listControl.value || [];

    if (this.form.invalid) {
      return;
    }

    if (this.oldLesson) {
      action = this.updateLesson();
    } else {
      action = this.createLesson(user.id);
    }

    action.then((lessonId?: string) => {
      this.snackBar.open(`ポストを${this.oldLesson ? '更新' : '作成'}しました`);
      this.listService.patchList({
        allLists: this.lists,
        activeListIds,
        lessonId: this.oldLesson ? this.oldLesson.id : lessonId,
      });
      this.isComplete = true;
      this.router.navigate(['/lesson'], {
        relativeTo: this.route,
        queryParams: {
          v: this.oldLesson ? this.oldLesson.id : lessonId,
        },
      });
      this.postLoading = false;
    });
  }

  private createLesson(userId: string) {
    return this.lessonService.createLesson(
      userId,
      {
        ...this.form.value,
        free: this.authService.user.admin ? this.form.value.free : true,
      },
      this.thumbnail
    );
  }

  private updateLesson() {
    const added = addedDiff(this.oldLesson, this.form.value);
    const updated = updatedDiff(this.oldLesson, this.form.value);
    const newValue = {
      ...added,
      ...updated,
    };

    return this.lessonService.updateLesson(this.oldLesson.id, {
      ...newValue,
      title: this.form.value.title,
      body: this.form.value.body,
      public: this.form.value.public,
    });
  }

  isSelected(list: LessonList): boolean {
    if (this.oldLesson) {
      return list.lessonIds.includes(this.oldLesson.id);
    } else {
      return false;
    }
  }

  deleteLesson() {
    this.snackBar
      .open('本当に削除しますか？', 'はい', {
        duration: 4000,
      })
      .onAction()
      .subscribe(() => {
        this.lessonService.deleteLesson(this.oldLesson.id).then(() => {
          this.snackBar.open('ポストを削除しました。', null, {
            duration: 2000,
          });
          this.router.navigate(['/']);
        });

        this.listService.removeLessonFromList(this.lists, this.oldLesson.id);
      });
  }

  changeList() {
    this.form.markAsDirty();
  }

  shortCut(event: KeyboardEvent, user: User) {
    if (event.metaKey && event.key === 'Enter') {
      this.submit(user);
    }
  }

  upload(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.addEventListener(
        'load',
        (e: any) => {
          const image = e.target.result;
          this.storageService
            .upload(`lesson/${Date.now()}`, image)
            .then((url: string) => {
              resolve(url);
            });
        },
        false
      );
      reader.readAsDataURL(blob);
    });
  }

  resizeFile(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.ngxPicaService
        .resizeImage(file, 2000, 1200, {
          aspectRatio: {
            keepAspectRatio: true,
          },
          alpha: true,
        })
        .subscribe(
          (imageResized: File) => {
            this.upload(imageResized).then((url) => {
              resolve(url);
            });
          },
          (err: NgxPicaErrorInterface) => {
            throw err.err;
          }
        );
    });
  }

  embedImage(myField, url: string) {
    const tag = `![](${url})`;
    if (myField.selectionStart || myField.selectionStart === '0') {
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;
      myField.value =
        myField.value.substring(0, startPos) +
        tag +
        myField.value.substring(endPos, myField.value.length);
    } else {
      myField.value += tag;
    }
  }

  async onPaste(event: ClipboardEvent) {
    const items = event.clipboardData.items;
    let blob = null;

    for (const item of items as any) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
      }
    }

    if (blob) {
      const url = await this.resizeFile(blob);
      this.embedImage(event.target, url);
    }
  }

  selectImage() {
    const input = document.createElement('input');
    input.type = 'file';

    input.onchange = async (e: any) => {
      const file = e.target.files[0];

      if (file.type.indexOf('image') === 0) {
        let url: string;
        if (file.type.match('.gif')) {
          url = await this.upload(file);
        } else {
          url = await this.resizeFile(file);
        }
        const oldValue = this.form.get('body').value;
        this.form.get('body').patchValue(oldValue + `\n\n![](${url})`);
      }
    };

    input.click();
  }

  openHelpDialog() {
    this.dialog.open(EditorHelpComponent, {
      width: '600px',
      restoreFocus: false,
      autoFocus: false,
    });
  }

  openVideoUploader() {
    this.dialog
      .open(VimeoDialogComponent, {
        width: '600px',
        maxHeight: '80vh',
        data: this.authService.user,
        autoFocus: false,
        restoreFocus: false,
      })
      .afterClosed()
      .subscribe((videoId) => {
        if (videoId) {
          this.form.get('videoId').setValue(videoId);
        }
      });
  }

  openNewListDialog(uid: string) {
    this.dialog
      .open(ListEditDialogComponent, {
        maxWidth: 600,
      })
      .afterClosed()
      .subscribe((status) => {
        if (status) {
          this.snackBar.open('リストを追加しました', null, {
            duration: 2000,
          });
        }
      });
  }

  cancel() {
    this.location.back();
  }

  openLessonGuide() {
    this.dialog.open(LessonGuideComponent, {
      width: '600px',
      autoFocus: false,
    });
  }

  uploadThumbnail(image: string) {
    if (this.oldLesson) {
      this.lessonService.updateLesson(this.oldLesson.id, {
        thumbnailURL: image,
      });
    }
  }

  setThumbnail(image) {
    this.thumbnail = image;
  }

  openTagEditor() {
    this.dialog
      .open(TagEditorDialogComponent, {
        restoreFocus: false,
        width: '800px',
        data: this.form.get('tags').value,
      })
      .afterClosed()
      .subscribe((tags) => {
        if (tags) {
          this.form.get('tags').patchValue(tags);
          this.form.markAsDirty();
        }
      });
  }

  openVimeoHelp() {
    this.dialog.open(VimeoHelpDialogComponent);
  }
}
