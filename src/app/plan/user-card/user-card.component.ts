import { take } from 'rxjs/operators';
import { UserService } from './../../services/user.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ChannelMeta } from 'src/app/interfaces/channel';
import { PlanService } from 'src/app/services/plan.service';
import { Plan } from 'src/app/interfaces/plan';
import { MatDialog } from '@angular/material/dialog';
import { MailDialogComponent } from 'src/app/core/mail-dialog/mail-dialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss'],
})
export class UserCardComponent implements OnInit {
  @Input() channel: ChannelMeta;
  @Input() isOwner: boolean;
  @Output() loaded = new EventEmitter<boolean>();

  plans: Plan[] = this.planService.plans;
  rate: number;
  data: {
    avatar: string;
    name: string;
    profile: string;
    links: string[];
    isHost?: boolean;
  };

  constructor(
    private planService: PlanService,
    private dialog: MatDialog,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (this.channel.id === environment.hostChannel) {
      this.data = {
        avatar: this.channel.avatarURL,
        name: this.channel.title,
        profile: this.channel.description,
        links: this.channel.links,
        isHost: true,
      };
      this.loaded.emit(true);
    } else {
      this.userService
        .getUser(this.channel.id)
        .pipe(take(1))
        .subscribe((user) => {
          this.data = {
            avatar: user.avatarURL,
            name: user.name,
            profile: user.profile,
            links: user.links,
          };
          this.loaded.emit(true);
        });
    }
  }

  openMailDialog(email: string) {
    this.dialog.open(MailDialogComponent, {
      width: '640px',
      restoreFocus: false,
      autoFocus: false,
      data: this.channel.email,
    });
  }
}
