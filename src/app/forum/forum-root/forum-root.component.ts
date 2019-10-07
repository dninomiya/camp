import { Component, OnInit } from '@angular/core';
import { ForumService } from 'src/app/services/forum.service';
import { ForumUnreadCount } from 'src/app/interfaces/thread';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-forum-root',
  templateUrl: './forum-root.component.html',
  styleUrls: ['./forum-root.component.scss']
})
export class ForumRootComponent implements OnInit {

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
    private snackBar: MatSnackBar
  ) {
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

    this.afMessaging.messages
      .subscribe((message) => { console.log(message); });
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
        (error) => { console.error(error); }
      );
  }

  ngOnInit() {
  }

  stopFCM() {
    this.isAlert = false;
    localStorage.setItem('noFCM', 'true');
  }

}
