import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { VimeoService } from 'src/app/services/vimeo.service';

@Component({
  selector: 'app-vimeo-dialog',
  templateUrl: './vimeo-dialog.component.html',
  styleUrls: ['./vimeo-dialog.component.scss'],
})
export class VimeoDialogComponent implements OnInit {
  isOver: boolean;
  authURL: string;
  uploadURL: string;
  size: number;
  unit: string;
  file: File;
  isBasic: boolean;
  videoId: string;
  createWaiting: boolean;
  loading = true;
  uploadQuota: any;

  constructor(
    private vimeoService: VimeoService,
    private dialog: MatDialogRef<VimeoDialogComponent>
  ) {}

  ngOnInit() {
    this.vimeoService.getVimeoAccount().then((user) => {
      console.log(user);
      this.loading = false;
      if (user) {
        this.uploadQuota = user.uploadQuota.periodic;
        console.log(this.uploadQuota);
      }
    });
  }

  handleFileSelected(event) {
    this.file = event.srcElement.files[0];
    this.size = this.file.size;
  }

  createVideo() {
    this.createWaiting = true;
    this.vimeoService.createVideo(this.file.size).then((res) => {
      const uploadURL = res.uploadURL;
      const videoId = res.videoId;
      this.vimeoService.uploadVideo({
        uploadURL,
        file: this.file,
      });
      this.dialog.close(videoId);
    });
  }

  onDrop(event: DragEvent) {
    this.file = event.dataTransfer.files[0];
    this.size = this.file.size;
    event.preventDefault();
    this.isOver = false;
  }

  onDragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
    this.isOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isOver = false;
  }
}
