import { Component, OnInit, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-mat-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class StarRatingComponent implements OnInit {

  @Input() rating: number;
  @Input() readonly: boolean;
  private starCount = 3;
  @Output() ratingUpdated = new EventEmitter();

  labels = [
    'まあまあ',
    'ふつう',
    'よかった'
  ];

  currentRating = 0;

  private ratingArr = [];

  constructor() {}

  ngOnInit() {
    this.currentRating = Math.round(this.rating);
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }

  onClick(rating: number) {
    this.ratingUpdated.emit(rating);
    this.currentRating = rating;
  }

  showIcon(index: number) {
    if (this.currentRating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

}
