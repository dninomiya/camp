import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { StudioGuard } from './guards/studio.guard';
import { MainShellComponent } from './shell/main-shell/main-shell.component';
import { ConnectStripeComponent } from './core/connect-stripe/connect-stripe.component';
import { ConnectVimeoComponent } from './core/connect-vimeo/connect-vimeo.component';

const routes: Routes = [
  {
    path: 'intl',
    loadChildren: () => import('./intl/intl.module').then(m => m.IntlModule)
  },
  {
    path: '',
    component: MainShellComponent,
    data: {
      root: true
    },
    children: [
      {
        path: 'lesson',
        loadChildren: () =>
          import('./lesson/lesson.module').then(m => m.LessonModule)
      },
      {
        path: 'cause',
        loadChildren: () =>
          import('./cause/cause.module').then(m => m.CauseModule)
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./user/user.module').then(m => m.UserModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'new',
        canLoad: [AuthGuard],
        data: {
          hideNav: true
        },
        loadChildren: () =>
          import('./editor/editor.module').then(m => m.EditorModule)
      },
      {
        path: 'edit',
        canLoad: [AuthGuard],
        data: {
          hideNav: true
        },
        loadChildren: () =>
          import('./editor/editor.module').then(m => m.EditorModule)
      },
      {
        path: 'setting',
        data: {
          hideNav: true
        },
        loadChildren: () =>
          import('./setting/setting.module').then(m => m.SettingModule),
        canLoad: [AuthGuard]
      },
      {
        path: 'search',
        data: {
          noHeader: true
        },
        loadChildren: () =>
          import('./search/search.module').then(m => m.SearchModule)
      },
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      }
    ]
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./welcome/welcome.module').then(m => m.WelcomeModule)
  },
  {
    path: 'isa',
    loadChildren: () => import('./isa/isa.module').then(m => m.IsaModule)
  },
  {
    path: 'connect-stripe',
    component: ConnectStripeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'connect-vimeo',
    component: ConnectVimeoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'studio/:id',
    loadChildren: () =>
      import('./studio/studio.module').then(m => m.StudioModule),
    canActivate: [StudioGuard]
  },
  {
    path: 'not-found',
    component: NotFoundComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
      useHash: false,
      scrollOffset: [0, 72]
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
