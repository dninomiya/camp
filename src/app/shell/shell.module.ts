import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { DrawerComponent } from './drawer/drawer.component';
import { SharedModule } from '../shared/shared.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MainShellComponent } from './main-shell/main-shell.component';
import { NgAisModule } from 'angular-instantsearch';
import { StudioShellComponent } from './studio-shell/studio-shell.component';
import { CauseListComponent } from './cause-list/cause-list.component';

@NgModule({
  declarations: [
    HeaderComponent,
    DrawerComponent,
    MainShellComponent,
    StudioShellComponent,
    CauseListComponent,
  ],
  imports: [
    SharedModule,
    MatSidenavModule,
    NgAisModule,
  ],
  exports: [
    MainShellComponent
  ]
})
export class ShellModule { }
