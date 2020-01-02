import { Component, OnInit, Input } from '@angular/core';
import { LessonMetaWithChannel } from 'src/app/interfaces/lesson';

@Component({
  selector: 'app-grid-lesson-item',
  templateUrl: './grid-lesson-item.component.html',
  styleUrls: ['./grid-lesson-item.component.scss']
})
export class GridLessonItemComponent implements OnInit {
  @Input() lesson: LessonMetaWithChannel;
  @Input() type?: string;
  @Input() causeId?: string;

  constructor() { }

  ngOnInit() { }

}
