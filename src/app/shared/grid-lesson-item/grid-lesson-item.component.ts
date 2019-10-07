import { Component, OnInit, Input } from '@angular/core';
import { LessonMeta } from 'src/app/interfaces/lesson';
import { LessonService } from 'src/app/services/lesson.service';

@Component({
  selector: 'app-grid-lesson-item',
  templateUrl: './grid-lesson-item.component.html',
  styleUrls: ['./grid-lesson-item.component.scss']
})
export class GridLessonItemComponent implements OnInit {
  @Input() lesson: LessonMeta;
  @Input() type?: string;

  thumbnailURL: string;

  constructor(
    private lessonService: LessonService
  ) { }

  ngOnInit() {
    if (this.lesson.videoId) {
      this.getThumbnail(this.lesson.videoId);
    }
  }

  private async getThumbnail(id: string) {
    this.thumbnailURL = await this.lessonService.getThumbnail(id);
  }

}
