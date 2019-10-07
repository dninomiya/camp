import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vimeo',
  templateUrl: './vimeo.component.html',
  styleUrls: ['./vimeo.component.scss']
})
export class VimeoComponent implements OnInit {

  @Input() id: string;

  constructor() { }

  ngOnInit() {
  }

}
