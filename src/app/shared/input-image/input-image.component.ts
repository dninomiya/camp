import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPicaService } from '@digitalascetic/ngx-pica';
import { StorageService } from 'src/app/services/storage.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-input-image',
  templateUrl: './input-image.component.html',
  styleUrls: ['./input-image.component.scss'],
})
export class InputImageComponent implements OnInit {
  @Output() uploaded = new EventEmitter<string>();
  @Output() file = new EventEmitter<any>();
  @Input() oldSrc?: string;
  @Input() options: {
    path: string;
    label?: boolean;
    size: {
      width: number;
      height: number;
      limitMb: number;
    };
  };

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
        alpha: true,
      })
      .pipe(first())
      .toPromise();
  }

  async upload(file, path: string) {
    const image = await this.getImageByFile(file);
    this.storageService.upload(path, image).then((downloadURL) => {
      this.uploaded.emit(downloadURL);
      this.snackBar.open('イメージをアップロードしました', null, {
        duration: 2000,
      });
    });
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

  async getFile(file) {
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
      const imageFile = await this.resizeImage(file, this.options.size);
      const image = await this.getImageByFile(imageFile);

      this.src = image;
      if (this.options.path) {
        this.upload(imageFile, this.options.path);
      } else {
        this.file.emit(image);
      }
    }
  }
}
