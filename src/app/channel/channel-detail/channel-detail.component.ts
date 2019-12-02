import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { AuthService } from 'src/app/services/auth.service';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, combineLatest, Subscription, of } from 'rxjs';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { ActivatedRoute, Router } from '@angular/router';
import { UiService } from 'src/app/services/ui.service';
import { MatDialog } from '@angular/material';
import { ChannelReviewDialogComponent } from 'src/app/core/channel-review-dialog/channel-review-dialog.component';
import { RatePipe } from 'src/app/shared/rate.pipe';
import { SeoService } from 'src/app/services/seo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-channel-detail',
  templateUrl: './channel-detail.component.html',
  styleUrls: ['./channel-detail.component.scss'],
  providers: [RatePipe]
})
export class ChannelDetailComponent implements OnInit, OnDestroy {

  tabs = [
    {
      path: './',
      label: '概要'
    },
    {
      path: './lessons',
      label: 'レッスン'
    },
    {
      path: './causes',
      label: 'リスト'
    }
  ];

  isOwner: boolean;
  followerBuff = 0;
  followerCount: number;
  isMobile = this.uiService.isMobile;

  channel$: Observable<ChannelMeta> = this.route.params.pipe(
    switchMap(({id}) => this.channelService.getChannel(id)),
    tap(channel => {
      if ( channel) {
        const image = channel.coverURL || environment.host + '/assets/images/nino-camp.png';
        this.seoService.generateTags({
          title: channel.title,
          description: channel.description,
          image,
          type: 'website'
        });
        this.followerCount = channel.statistics.followerCount;
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
      if (user && channel) {
        return this.channelService.isFollow(user.id, channel.id);
      } else {
        return of(null);
      }
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
    private uiService: UiService,
    private dialog: MatDialog,
    private ratePipe: RatePipe,
    private seoService: SeoService
  ) { }

  ngOnInit() {
    this.sub = combineLatest([
      this.authService.authUser$,
      this.channel$
    ]).subscribe(([user, channel]) => {
      if (user) {
        this.uid = user.id;
        this.isOwner = user.id === channel.authorId;
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  follow(cid: string) {
    if (this.uid) {
      this.followerBuff++;
      this.channelService.follow(cid, this.uid);
    } else {
      this.authService.openLoginDialog();
    }
  }

  unfollow(cid: string) {
    if (this.uid) {
      this.followerBuff--;
      this.channelService.unfollow(cid, this.uid);
    }
  }

  getRate(channel: ChannelMeta): number {
    if (channel.totalRate && channel.totalRate) {
      return channel.totalRate / channel.statistics.reviewCount;
    } else {
      return 0;
    }
  }

  openReviewDialog(channel: ChannelMeta) {
    this.dialog.open(ChannelReviewDialogComponent, {
      width: '640px',
      autoFocus: false,
      restoreFocus: false,
      data: {
        channel,
        rate: this.ratePipe.transform(channel)
      }
    });
  }

}
