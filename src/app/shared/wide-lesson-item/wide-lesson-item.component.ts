import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-wide-lesson-item',
  templateUrl: './wide-lesson-item.component.html',
  styleUrls: ['./wide-lesson-item.component.scss']
})
export class WideLessonItemComponent implements OnInit {

  @Input() isRecommend?: boolean;

  constructor() { }

  ngOnInit() {
    this.isRecommend = this.isRecommend !== undefined;
  }

}
