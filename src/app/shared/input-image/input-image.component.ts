import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPicaService } from '@digitalascetic/ngx-pica';
import { StorageService } from 'src/app/services/storage.service';
import { first } from 'rxjs/operators';
import * as Jimp from 'jimp';

export interface ImageOption {
  path?: string;
  label?: boolean;
  crop?: boolean;
  size: {
    width: number;
    height: number;
    limitMb?: number;
  };
}

@Component({
  selector: 'app-input-image',
  templateUrl: './input-image.component.html',
  styleUrls: ['./input-image.component.scss'],
})
export class InputImageComponent implements OnInit {
  @Output() uploaded = new EventEmitter<string>();
  @Output() file = new EventEmitter<string>();

  @Input() oldSrc?: string;
  @Input() options: ImageOption;

  src: string;
  isOver: boolean;

  constructor(
    private snackBar: MatSnackBar,
    private ngxPicaService: NgxPicaService,
    private storageService: StorageService
  ) {}

  ngOnInit() {
    this.src = this.oldSrc;
  }

  onDrop(event) {
    const files = event.dataTransfer.files;
    event.preventDefault();
    this.isOver = false;

    if (files && files[0]) {
      this.getFile(files[0]);
    }
  }

  onDragOver(event) {
    event.stopPropagation();
    event.preventDefault();
    this.isOver = true;
  }

  onDragLeave(event) {
    event.preventDefault();
    this.isOver = false;
  }

  resizeImage(
    file: File,
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
        alpha: true,
      })
      .pipe(first())
      .toPromise();
  }

  crop(
    file: File,
    size: {
      width: number;
      height: number;
    }
  ): Promise<string> {
    return new Promise((resolve) => {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        Jimp.read(fileReader.result as string).then((result) => {
          result
            .cover(size.width, size.height)
            .getBase64Async(Jimp.MIME_PNG)
            .then((base64) => {
              resolve(base64);
            });
        });
      };

      fileReader.readAsArrayBuffer(file);
    });
  }

  async upload(base64Image: string, path: string) {
    this.storageService.upload(path, base64Image).then((downloadURL) => {
      this.uploaded.emit(downloadURL);
      this.snackBar.open('イメージをアップロードしました', null, {
        duration: 2000,
      });
    });
  }

  private getImageByFile(file: File): Promise<string> {
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

  checkSize(file): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();

      fr.onload = () => {
        const img: any = new Image();
        img.onload = () => {
          if (
            img.width < this.options.size.width ||
            img.height < this.options.size.height
          ) {
            reject('画像サイズが小さすぎます');
          } else {
            resolve(true);
          }
        };
        img.src = fr.result;
      };
      fr.readAsDataURL(file);
    });
  }

  async getFile(file: File) {
    if (!file) {
      return;
    }
    if (file.size / 1000000 > this.options.size.limitMb) {
      this.snackBar.open(
        `サイズが${this.options.size.limitMb}MBを超えています`,
        null,
        {
          duration: 2000,
        }
      );
      return;
    }

    if (!file.type.match(/png|jpg|jpeg/)) {
      this.snackBar.open('ファイルタイプが不正です', null, {
        duration: 2000,
      });
      return;
    }

    const isOk = await this.checkSize(file).catch((error) => {
      this.snackBar.open(error, null, {
        duration: 2000,
      });
    });

    if (isOk) {
      let base64Image: string;

      if (this.options.crop) {
        base64Image = await this.crop(file, this.options.size);
      } else {
        const imageFile = await this.resizeImage(file, this.options.size);
        base64Image = await this.getImageByFile(imageFile);
      }

      this.src = base64Image;
      if (this.options.path) {
        this.upload(base64Image, this.options.path);
      } else {
        this.file.emit(base64Image);
      }
    }
  }
}
