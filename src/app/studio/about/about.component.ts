import { Component, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap, first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPicaService } from '@digitalascetic/ngx-pica';
import { StorageService } from 'src/app/services/storage.service';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  src = {};
  maxLength = {
    title: 40,
    description: 400
  };
  size = {
    avatar: {
      width: 320,
      height: 320,
      limitMb: 1
    }
  };
  isOver = {};
  form = this.fb.group({
    title: ['', [
      Validators.required,
      Validators.maxLength(this.maxLength.title)
    ]],
    description: ['', [
      Validators.required,
      Validators.maxLength(this.maxLength.description)
    ]],
    links: this.fb.array([
      this.fb.control('', [
        Validators.required
      ])
    ])
  });

  adsForm = this.fb.group({
    url: ['', Validators.required],
    public: [false],
  });
  adsSrc: string;
  channel: ChannelMeta;
  channel$ = this.route.parent.params.pipe(
    switchMap(({ id }) => this.channelService.getChannel(id)),
    tap(channel => {
      this.channel = channel;
      this.form.patchValue(channel);
      this.adsOptions.path = `ads/${channel.id}`;
      this.src = {
        avatar: channel.avatarURL,
      };
      if (channel.ads) {
        this.adsSrc = channel.ads.imageURL;
        this.adsForm.patchValue(channel.ads, {
          emitEvent: false
        });
      }
    })
  );

  job = this.fb.group({
    amount: [null, Validators.required],
    office: [false],
    employee: [false],
    mentor: [false],
    remote: [false],
    ui: [false],
    pm: [false],
    manage: [false],
    front: [false],
    ai: [false],
    infra: [false],
    server: [false],
    native: [false],
    fullstack: [false],
    ar: [false],
    desing: [false],
    vr: [false],
    startup: [false],
    cto: [false],
    skills: ['', Validators.required],
    target: ['', Validators.required],
    pr: ['', Validators.required],
    public: [false],
  });

  adsOptions = {
    path: '',
    size: {
      width: 400,
      height: 240,
      limitMb: 1
    }
  };

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private ngxPicaService: NgxPicaService,
    private storageService: StorageService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.channelService.getJobCard(
      this.authService.user.id
    ).subscribe(jobCard => {
      if (jobCard) {
        this.job.patchValue(jobCard);
      }
    });
  }

  update(cid: string) {
    if (this.form.valid) {
      this.channelService.updateChannel(
        cid,
        this.form.value
      ).then(() => {
        this.snackBar.open('更新しました', null, {
          duration: 2000
        });
        this.form.markAsPristine();
      });
    }
  }

  onDrop(event, type: string) {
    const files = event.dataTransfer.files;
    event.preventDefault();
    this.isOver[type] = false;

    if (files && files[0]) {
      this.getFile(files[0], type);
    }
  }

  onDragOver(event, type: string) {
    event.stopPropagation();
    event.preventDefault();
    this.isOver[type] = true;
  }

  onDragLeave(event, type: string) {
    event.preventDefault();
    this.isOver[type] = false;
  }

  resizeImage(file: any, size: {
    width: number;
    height: number;
  }): Promise<File> {
    return this.ngxPicaService.resizeImage(file, size.width, size.height, {
      aspectRatio: {
        keepAspectRatio: true,
      }
    }).pipe(first()).toPromise();
  }

  async upload(file, path: string): Promise<string> {
    const image = await this.getImageByFile(file);
    return this.storageService.upload(path, image);
  }

  private getImageByFile(file): Promise<any> {
    return new Promise(resolve => {
      const reader: FileReader = new FileReader();

      reader.addEventListener('load', (e: any) => {
        resolve(e.target.result);
      }, false);

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
        duration: 2000
      });
      return;
    }

    if (!file.type.match(/png|jpg|jpeg/)) {
      this.snackBar.open('ファイルタイプが不正です', null, {
        duration: 2000
      });
      return;
    }

    const isOk = await this.checkSize(file, type)
      .catch((error) => {
        this.snackBar.open(error, null, {
          duration: 2000
        });
      });

    if (isOk) {
      const imageFile = await this.resizeImage(file, this.size[type]);
      const image = await this.getImageByFile(imageFile);
      this.src[type] = image;
      if (this.channel) {
        const path = await this.upload(imageFile, `channels/${this.channel.id}/${type}`);
        this.channelService.updateChannel(
          this.channel.id,
          {
            [`${type}URL`]: path
          }
        ).then(() => {
          this.snackBar.open('イメージをアップロードしました', null, {
            duration: 2000
          });
        });
      }
    }
  }

  get links() {
    return this.form.get('links') as FormArray;
  }

  addLinkForm() {
    this.links.push(this.fb.control(''));
  }

  removeLinkForm(i: number) {
    this.links.removeAt(i);
  }

  saveJob() {
    const id = this.authService.user.id;
    this.channelService.updateJob(id, {
      id,
      ...this.job.value
    }).then(() => {
      this.job.markAsPristine();
      this.snackBar.open('ジョブカードを更新しました', null, {
        duration: 2000
      });
    });
  }

  uploadAds(imageURL) {
    this.adsSrc = imageURL;
    this.channelService.updateChannel(
      this.authService.user.id,
      {
        [`ads.imageURL`]: imageURL
      }
    );
  }

  updateAdsStatus() {
    this.channelService.updateChannel(
      this.authService.user.id,
      {
        ads: {
          ...this.adsForm.value,
          imageURL: this.adsSrc
        }
      }
    ).then(() => {
      this.adsForm.markAsPristine();
      this.snackBar.open('広告ステータスを変更しました', null, {
        duration: 2000
      });
    });
  }

}
