import { LessonMetaWithUser } from 'src/app/interfaces/lesson';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grid-lesson-item',
  templateUrl: './grid-lesson-item.component.html',
  styleUrls: ['./grid-lesson-item.component.scss'],
})
export class GridLessonItemComponent implements OnInit {
  @Input() lesson: LessonMetaWithUser;
  @Input() type?: string;
  @Input() causeId?: string;
  @Input() noDate?: boolean;
  @Input() simple?: boolean;

  constructor() {}

  ngOnInit() {}
}
