import { Component, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, first, take } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPicaService } from '@digitalascetic/ngx-pica';
import { StorageService } from 'src/app/services/storage.service';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { AuthService } from 'src/app/services/auth.service';
import { Job } from 'src/app/interfaces/job';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../image-dialog/image-dialog.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  avatarImage;

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngxPicaService: NgxPicaService,
    private storageService: StorageService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  get links() {
    return this.form.get('links') as FormArray;
  }

  src = {};
  maxLength = {
    title: 40,
    description: 400,
    ownerName: 40,
  };
  size = {
    avatar: {
      width: 320,
      height: 320,
      limitMb: 1,
    },
  };
  form = this.fb.group({
    title: [
      '',
      [Validators.required, Validators.maxLength(this.maxLength.title)],
    ],
    description: [
      '',
      [Validators.required, Validators.maxLength(this.maxLength.description)],
    ],
    ownerName: [
      '',
      [Validators.required, Validators.maxLength(this.maxLength.ownerName)],
    ],
    activeUser: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
    maxUser: [
      '',
      [Validators.required, Validators.pattern(/^\d+$/), Validators.min(1)],
    ],
    links: this.fb.array([]),
  });

  adsForm = this.fb.group({
    url: ['', Validators.required],
    public: [false],
  });
  adsSrc: string;
  channel: ChannelMeta;

  coverSrc: string;
  channel$ = this.route.parent.params.pipe(
    switchMap(({ id }) => this.channelService.getChannel(id).pipe(take(1))),
    tap((channel) => {
      this.channel = channel;
      this.form.patchValue(channel);
      this.adsOptions.path = `ads/${channel.id}`;
      (this.coverOptions.path = `channels/${channel.id}/cover`),
        (this.avatarImage = channel.avatarURL);
      if (channel.ads) {
        this.adsSrc = channel.ads.imageURL;
        this.adsForm.patchValue(channel.ads, {
          emitEvent: false,
        });
      }
      if (channel.coverURL) {
        this.coverSrc = channel.coverURL;
      }
    })
  );

  jobForm = this.fb.array([]);

  adsOptions = {
    path: '',
    size: {
      width: 400,
      height: 240,
      limitMb: 1,
    },
  };

  coverOptions = {
    path: '',
    label: true,
    size: {
      width: 1200,
      height: 630,
      limitMb: 3,
    },
  };

  imageChangedEvent: any = '';
  croppedImage: any = '';

  ngOnInit() {
    this.channelService.getJobs(this.authService.user.id).subscribe((jobs) => {
      if (jobs && jobs.length) {
        jobs.forEach((job) => this.addJob(job));
      } else {
        this.addJob();
      }
    });
  }

  update(cid: string) {
    if (this.form.valid) {
      this.channelService.updateChannel(cid, this.form.value).then(() => {
        this.snackBar.open('更新しました', null, {
          duration: 2000,
        });
        this.form.markAsPristine();
      });
    }
  }

  onDrop(event: DragEvent) {
    const files = event.dataTransfer.files;
    event.preventDefault();

    if (files && files[0]) {
      this.openImageDialog(files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
  }

  resizeImage(
    file: any,
    size: {
      width: number;
      height: number;
    }
  ): Promise<File> {
    return this.ngxPicaService
      .resizeImage(file, size.width, size.height, {
        aspectRatio: {
          keepAspectRatio: true,
        },
      })
      .pipe(first())
      .toPromise();
  }

  async upload(file, path: string): Promise<string> {
    const image = await this.getImageByFile(file);
    return this.storageService.upload(path, image);
  }

  private getImageByFile(file): Promise<any> {
    return new Promise((resolve) => {
      const reader: FileReader = new FileReader();

      reader.addEventListener(
        'load',
        (e: any) => {
          resolve(e.target.result);
        },
        false
      );

      reader.readAsDataURL(file);
    });
  }

  checkSize(file, type: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();

      fr.onload = () => {
        const img: any = new Image();
        img.onload = () => {
          if (type !== 'cover') {
            if (
              img.width < this.size.avatar.width ||
              img.height < this.size.avatar.height
            ) {
              reject('画像サイズが小さすぎます');
            } else {
              resolve(true);
            }
          }
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  async getFile(file, type: string) {
    if (file.size / 1000000 > this.size[type].limitMb) {
      this.snackBar.open('サイズが6MBを超えています', null, {
        duration: 2000,
      });
      return;
    }

    if (!file.type.match(/png|jpg|jpeg/)) {
      this.snackBar.open('ファイルタイプが不正です', null, {
        duration: 2000,
      });
      return;
    }

    const isOk = await this.checkSize(file, type).catch((error) => {
      this.snackBar.open(error, null, {
        duration: 2000,
      });
    });

    if (isOk) {
      const imageFile = await this.resizeImage(file, this.size[type]);
      const image = await this.getImageByFile(imageFile);
      this.src[type] = image;
      if (this.channel) {
        const path = await this.upload(
          imageFile,
          `channels/${this.channel.id}/${type}`
        );
        this.channelService
          .updateChannel(this.channel.id, {
            [`${type}URL`]: path,
          })
          .then(() => {
            this.snackBar.open('イメージをアップロードしました', null, {
              duration: 2000,
            });
          });
      }
    }
  }

  addLinkForm() {
    this.links.push(
      this.fb.control('', [
        Validators.required,
        Validators.pattern('^https?://.*'),
      ])
    );
  }

  removeLinkForm(i: number) {
    this.links.removeAt(i);
    this.form.markAsDirty();
  }

  saveJob() {
    const channelId = this.authService.user.id;
    this.channelService.updateJobs(channelId, this.jobForm.value).then(() => {
      this.jobForm.markAsPristine();
      this.snackBar.open('案件相談窓口を更新しました', null, {
        duration: 2000,
      });
    });
  }

  uploadAds(imageURL) {
    this.adsSrc = imageURL;
    this.channelService.updateChannel(this.authService.user.id, {
      ads: {
        imageURL,
      },
    });
  }

  uploadCover(imageURL) {
    this.coverSrc = imageURL;
    this.channelService.updateChannel(this.authService.user.id, {
      coverURL: imageURL,
    });
  }

  updateAdsStatus() {
    this.channelService
      .updateChannel(this.authService.user.id, {
        ads: {
          ...this.adsForm.value,
          imageURL: this.adsSrc,
        },
      })
      .then(() => {
        this.adsForm.markAsPristine();
        this.snackBar.open('広告ステータスを変更しました', null, {
          duration: 2000,
        });
      });
  }

  addJob(job?: Job) {
    this.jobForm.push(
      this.fb.group({
        title: [job && job.title, Validators.required],
        amount: [job && job.amount, Validators.required],
        style: [job && job.style, Validators.required],
        description: [job && job.description, Validators.required],
        public: [job && job.public],
      })
    );
  }

  removeJob(i: number) {
    this.jobForm.removeAt(i);
  }

  openImageDialog(file: File) {
    this.dialog
      .open(ImageDialogComponent, {
        data: file,
        width: '400px',
        autoFocus: false,
        restoreFocus: false,
      })
      .afterClosed()
      .subscribe(async (image) => {
        this.avatarImage = image;
        const path = await this.storageService.upload(
          `channels/${this.channel.id}/avatar`,
          image
        );
        this.channelService
          .updateChannel(this.channel.id, {
            ['avatarURL']: path,
          })
          .then(() => {
            this.snackBar.open('イメージをアップロードしました', null, {
              duration: 2000,
            });
          });
      });
  }
}
