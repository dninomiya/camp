import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap, tap, first } from 'rxjs/operators';
import { Observable, combineLatest, Subject, Subscription } from 'rxjs';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-channel-detail',
  templateUrl: './channel-detail.component.html',
  styleUrls: ['./channel-detail.component.scss']
})
export class ChannelDetailComponent implements OnInit, OnDestroy {

  tabs = [
    {
      path: './',
      label: 'レッスン'
    },
    {
      path: './causes',
      label: 'コース'
    },
    {
      path: './plans',
      label: 'プラン'
    }
  ];

  isOwner: boolean;
  followerBuff = 0;
  followerCount: number;

  channel$: Observable<ChannelMeta> = this.route.params.pipe(
    switchMap(({id}) => this.channelService.getChannel(id)),
    tap(channel => {
      if ( channel) {
        this.followerCount = channel.followerCount;
      } else {
        this.router.navigate(['not-found']);
      }
    })
  );

  isFollow$: Observable<boolean> = combineLatest([
    this.authService.authUser$,
    this.channel$
  ]).pipe(
    switchMap(([user, channel]) => {
      return this.channelService.isFollow(user.id, channel.id);
    }),
    tap(() => {
      this.isLoading = false;
    })
  );

  isLoading = true;

  sub = new Subscription();

  uid: string;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private channelService: ChannelService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.sub = combineLatest([
      this.authService.authUser$,
      this.channel$
    ]).subscribe(([user, channel]) => {
      this.uid = user.id;
      this.isOwner = user.id === channel.authorId;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  follow(cid: string) {
    if (this.uid) {
      this.followerBuff++;
      this.channelService.follow(cid, this.uid);
    }
  }

  unfollow(cid: string) {
    if (this.uid) {
      this.followerBuff--;
      this.channelService.unfollow(cid, this.uid);
    }
  }

}
