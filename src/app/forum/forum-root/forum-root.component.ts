import { Component, OnInit, HostBinding } from '@angular/core';
import { ForumService } from 'src/app/services/forum.service';
import { ForumUnreadCount } from 'src/app/interfaces/thread';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MatSnackBar } from '@angular/material';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-forum-root',
  templateUrl: './forum-root.component.html',
  styleUrls: ['./forum-root.component.scss']
})
export class ForumRootComponent implements OnInit {

  isThread: boolean;

  tabs = [
    {
      label: 'リクエスト',
      status: 'request'
    },
    {
      label: 'オープン',
      status: 'open'
    },
    {
      label: 'クローズ',
      status: 'closed'
    },
  ];

  isAlert = !localStorage.getItem('noFCM');

  constructor(
    private authService: AuthService,
    private forumService: ForumService,
    private afMessaging: AngularFireMessaging,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isThread = !this.route.firstChild.snapshot.data.formRoot;
      }
    });

    this.forumService.getUnreadCount(
      this.authService.user.id
    ).subscribe((count: ForumUnreadCount) => {
      if (count) {
        this.tabs = this.tabs.map(tab => {
          return {
            ...tab,
            badge: count[tab.status]
          };
        });
      }
    });
  }

  requestPermission() {
    this.afMessaging.requestToken
      .subscribe(
        (token) => {
          this.authService.setFCMToken(token).then(() => {
            this.stopFCM();
            this.snackBar.open('通知機能を有効にしました', null, {
              duration: 2000
            });
          });
        },
        (error) => {
          if (error.message.match('blocked')) {
            this.snackBar.open('シークレットウィンドウを解除するか、ブラウザの通知を有効にしてください', null, {
              duration: 4000
            });
          }
          console.log(error.message);
        }
      );
  }

  ngOnInit() {
  }

  stopFCM() {
    this.isAlert = false;
    localStorage.setItem('noFCM', 'true');
  }

}
