import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from 'src/app/services/channel.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.scss']
})
export class PlansComponent implements OnInit {
  channel$ = this.route.parent.params.pipe(
    switchMap(({id}) => this.channelService.getChannel(id))
  );
  user$ = this.authService.authUser$;

  constructor(
    private route: ActivatedRoute,
    private channelService: ChannelService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

}
