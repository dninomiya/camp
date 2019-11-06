import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { NgxPicaErrorInterface, NgxPicaService } from '@digitalascetic/ngx-pica';
import { of, Observable, combineLatest } from 'rxjs';
import { switchMap, tap, take, shareReplay, debounceTime, map, catchError } from 'rxjs/operators';
import { FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { MatDialog } from '@angular/material/dialog';
import { ChannelService } from 'src/app/services/channel.service';
import { Lesson } from 'src/app/interfaces/lesson';
import { LessonList } from 'src/app/interfaces/lesson-list';
import { AuthService } from 'src/app/services/auth.service';
import { LessonService } from 'src/app/services/lesson.service';
import { Location } from '@angular/common';
import { ListService } from 'src/app/services/list.service';
import { LessonGuideComponent } from '../lesson-guide/lesson-guide.component';
import { EditorHelpComponent } from '../editor-help/editor-help.component';
import { PlanService } from 'src/app/services/plan.service';
import { VimeoDialogComponent } from '../vimeo-dialog/vimeo-dialog.component';
import { VimeoService } from 'src/app/services/vimeo.service';
import { Simplemde } from 'ng2-simplemde';
import { updatedDiff } from 'deep-object-diff';
import { VimeoUser } from 'src/app/interfaces/vimeo';
import { environment } from 'src/environments/environment';
import { ListEditDialogComponent } from 'src/app/core/list-edit-dialog/list-edit-dialog.component';
import { TagEditorDialogComponent } from 'src/app/core/tag-editor-dialog/tag-editor-dialog.component';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild('body', {
    static: false
  }) simplemde: Simplemde;
  prices: number[] = [
    100,
    500,
    1000,
    1500,
    5000,
    10000,
    25000,
    50000,
    100000,
  ];

  thumbnailOption = {
    path: '',
    size: {
      width: 800,
      height: 400,
      limitMb: 3
    }
  };

  algoliaConfig = environment.algolia;
  oldThumbnail: string;
  uploadStep$ = this.vimeoService.uploadStep$;
  user$ = this.authService.authUser$.pipe(shareReplay(1));
  lists$: Observable<LessonList[]> = this.user$.pipe(
    switchMap(user => {
      return this.channelService.getListByChannelId(user.id);
    }),
    tap(lists => this.lists = lists)
  );
  lists: LessonList[];
  isLoading: boolean;
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
    ]
  };

  plans$ = this.planService.getPlansByChannelId(
    this.authService.user.id
  );

  codemirrorOpts = {
    lineNumbers: false,
  };

  vimeoUser: VimeoUser;
  oldLesson$: Observable<Lesson>;
  isValidWaiting: boolean;

  readyImages = [];

  form = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    tags: [''],
    videoId: ['', {
      asyncValidators: [this.validateVimeoId.bind(this)],
      updateOn: 'blur'
    }],
    public: [true, Validators.required],
    premium: [false],
    amount: [{
      value: '',
      disabled: true
    }],
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
    private vimeoService: VimeoService,
  ) {
    this.user$.pipe(
      switchMap(user => this.vimeoService.getVimeoAccount(user.id))
    ).subscribe(vimeoUser => {
      this.vimeoUser = vimeoUser || null;
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.oldLesson$ = this.route.queryParams.pipe(
      switchMap(params => {
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

    combineLatest([
      this.oldLesson$,
      this.lists$
    ]).subscribe(([oldLesson, lists]) => {
      if (oldLesson && lists) {
        this.listControl.patchValue(
          lists
            .filter(list => list.lessonIds.includes(oldLesson.id))
            .map(list => list.id)
        );
      }
    });

    this.form.get('premium').valueChanges.subscribe(value => {
      if (value) {
        this.form.get('amount').enable();
        this.form.get('amount').setValidators(Validators.required);
      } else {
        this.form.get('amount').disable();
        this.form.get('amount').clearValidators();
      }
    });

    this.form.get('body').valueChanges.pipe(debounceTime(500)).subscribe(res => {
      ( window as any).twttr.widgets.load();
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.form.dirty) {
      $event.returnValue = true;
    }
  }

  validateVimeoId(control: AbstractControl) {
    if (this.vimeoUser) {
      this.isValidWaiting = true;
      return this.vimeoService.checkVimeoId({
        id: control.value,
        token: this.vimeoUser.token
      }).pipe(
        tap(() => this.isValidWaiting = false),
        map(data => null),
        catchError(() => of({videoId: true}))
      );
    } else {
      return of(null);
    }
  }

  submit(id: string) {
    let action;
    const activeListIds = this.listControl.value || [];

    if (this.form.invalid) {
      return;
    }

    if (this.oldLesson) {
      const newValue = updatedDiff(this.oldLesson, this.form.value);

      action = this.lessonService.updateLesson(
        this.oldLesson.id, {
        ...newValue
      });
    } else {
      action =  this.lessonService.createLesson(
        id,
        this.form.value,
        this.thumbnail
      );
    }

    action.then((lessonId?: string) => {
      this.snackBar.open(`ポストを${this.oldLesson ? '更新' : '作成'}しました`, null, {
        duration: 2000
      });
      this.isComplete = true;
      this.listService.patchList({
        allLists: this.lists,
        activeListIds,
        lessonId: this.oldLesson ? this.oldLesson.id : lessonId
      });
      this.router.navigate(['/lesson'], {
        relativeTo: this.route,
        queryParams: {
          v: this.oldLesson ? this.oldLesson.id : lessonId
        }
      });
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
    this.snackBar.open('本当に削除しますか？', 'はい', {
      duration: 4000
    }).onAction().subscribe(() => {
      this.lessonService.deleteLesson(this.oldLesson.id).then(() => {
        this.snackBar.open('ポストを削除しました。', null, {
          duration: 2000
        });
        this.router.navigate(['/']);
      });

      this.listService.removeLessonFromList(
        this.lists,
        this.oldLesson.id
      );
    });
  }

  changeList() {
    this.form.markAsDirty();
  }

  shortCut(event: KeyboardEvent, uid: string) {
    if (event.metaKey && event.key === 'Enter') {
      this.submit(uid);
    }
  }

  upload(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.addEventListener('load', (e: any) => {
        const image = e.target.result;
        this.storageService.upload(`lesson/${Date.now()}`, image).then((url: string) => {
          resolve(url);
        });
      }, false);
      reader.readAsDataURL(blob);
    });
  }

  resizeFile(file: any): Promise<string> {
    return new Promise((resolve, reject) => {
      this.ngxPicaService.resizeImage(file, 840, 400, {
        aspectRatio: {
          keepAspectRatio: true,
        },
        alpha: true
      }).subscribe((imageResized: File) => {
        this.upload(imageResized).then(url => {
          resolve(url);
        });
      }, (err: NgxPicaErrorInterface) => {
        throw err.err;
      });
    });
  }

  embedImage(myField, url: string) {
    const tag = `![](${url})`;
    if (myField.selectionStart || myField.selectionStart === '0') {
      const startPos = myField.selectionStart;
      const endPos = myField.selectionEnd;
      myField.value = myField.value.substring(0, startPos)
        + tag
        + myField.value.substring(endPos, myField.value.length);
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
    });
  }

  openVideoUploader() {
    this.dialog.open(VimeoDialogComponent, {
      width: '600px',
      maxHeight: '80vh',
      data: this.authService.user,
      autoFocus: false,
      restoreFocus: false
    }).afterClosed().subscribe(videoId => {
      if (videoId) {
        this.form.get('videoId').setValue(videoId);
      }
    });
  }

  openNewListDialog(uid: string) {
    this.dialog.open(ListEditDialogComponent, {
      maxWidth: 600,
      maxHeight: '80vh',
    }).afterClosed().subscribe(status => {
      if (status) {
        this.snackBar.open('リストを追加しました', null, {
          duration: 2000
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
      this.lessonService.updateLesson(
        this.oldLesson.id,
        {
          thumbnailURL: image
        }
      );
    }
  }

  setThumbnail(image) {
    this.thumbnail = image;
  }

  openTagEditor() {
    this.dialog.open(TagEditorDialogComponent, {
      restoreFocus: false,
      width: '800px',
      data: this.form.get('tags').value
    }).afterClosed().subscribe(tags => {
      if (tags) {
        this.form.get('tags').patchValue(tags);
      }
    });
  }
}
