import { Component, OnInit, Input } from '@angular/core';
import { LessonMeta } from 'src/app/interfaces/lesson';

@Component({
  selector: 'app-grid-lesson-item',
  templateUrl: './grid-lesson-item.component.html',
  styleUrls: ['./grid-lesson-item.component.scss']
})
export class GridLessonItemComponent implements OnInit {
  @Input() lesson: LessonMeta;
  @Input() type?: string;

  thumbnailURL: string;

  constructor() { }

  ngOnInit() {}

}
