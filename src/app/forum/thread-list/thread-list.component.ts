import { Component, OnInit, Input } from '@angular/core';
import { ForumService } from 'src/app/services/forum.service';
import { AuthService } from 'src/app/services/auth.service';
import { ThreadStatus } from 'src/app/interfaces/thread';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-thread-list',
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.scss']
})
export class ThreadListComponent implements OnInit {
  uid = this.authService.user.id;
  items$ = this.route.queryParams.pipe(
    switchMap(params => {
      return this.forumService.getList(
        params.status,
        this.uid
      );
    })
  );

  constructor(
    private forumService: ForumService,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() { }

}
