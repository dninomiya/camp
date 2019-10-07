import { Component, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Validators, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  showMail: boolean;
  valid: boolean;
  captchaKey = environment.captchaKey;
  channel$ = this.route.parent.params.pipe(
    switchMap(({id}) => this.channelService.getChannel(id))
  );

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService
  ) { }

  ngOnInit() {
  }

  resolved(captchaResponse: string) {
    this.valid = true;
  }

}
