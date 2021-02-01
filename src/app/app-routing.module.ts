import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { StudioGuard } from './guards/studio.guard';
import { MainShellComponent } from './shell/main-shell/main-shell.component';

const routes: Routes = [
  {
    path: 'intl',
    loadChildren: () => import('./intl/intl.module').then((m) => m.IntlModule),
  },
  {
    path: '',
    component: MainShellComponent,
    data: {
      root: true,
    },
    children: [
      {
        path: 'lesson',
        loadChildren: () =>
          import('./lesson/lesson.module').then((m) => m.LessonModule),
      },
      {
        path: 'cause',
        loadChildren: () =>
          import('./cause/cause.module').then((m) => m.CauseModule),
      },
      {
        path: 'edit-product',
        data: {
          hideNav: true,
        },
        canActivate: [AuthGuard],
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./project-editor/project-editor.module').then(
            (m) => m.ProjectEditorModule
          ),
      },
      {
        path: 'mypage',
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
        canLoad: [AuthGuard],
      },
      {
        path: 'tree-edit',
        loadChildren: () =>
          import('./tree-editor/tree-editor.module').then(
            (m) => m.TreeEditorModule
          ),
        canLoad: [AdminGuard],
        data: {
          hideNav: true,
        },
      },
      {
        path: 'favorites',
        loadChildren: () =>
          import('./favorite/favorite.module').then((m) => m.FavoriteModule),
        canLoad: [AuthGuard],
      },
      {
        path: 'plans',
        loadChildren: () =>
          import('./plan-list/plan-list.module').then((m) => m.PlanListModule),
      },
      {
        path: 'new',
        canLoad: [AuthGuard],
        data: {
          hideNav: true,
        },
        loadChildren: () =>
          import('./editor/editor.module').then((m) => m.EditorModule),
      },
      {
        path: 'edit',
        canLoad: [AuthGuard],
        data: {
          hideNav: true,
        },
        loadChildren: () =>
          import('./editor/editor.module').then((m) => m.EditorModule),
      },
      {
        path: 'setting',
        data: {
          hideNav: true,
        },
        loadChildren: () =>
          import('./setting/setting.module').then((m) => m.SettingModule),
        canLoad: [AuthGuard],
      },
      {
        path: 'search',
        data: {
          noHeader: true,
        },
        loadChildren: () =>
          import('./search/search.module').then((m) => m.SearchModule),
      },
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
    ],
  },
  {
    path: 'atomic',
    data: {
      hideNav: true,
    },
    loadChildren: () => import('./tree/tree.module').then((m) => m.TreeModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./welcome/welcome.module').then((m) => m.WelcomeModule),
  },
  {
    path: 'studio/:id',
    loadChildren: () =>
      import('./studio/studio.module').then((m) => m.StudioModule),
    canActivate: [StudioGuard],
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'disabled',
      anchorScrolling: 'enabled',
      useHash: false,
      scrollOffset: [0, 72],
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
