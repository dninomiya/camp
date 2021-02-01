import { LayoutModule } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireFunctionsModule, REGION } from '@angular/fire/functions';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { NgAisModule } from 'angular-instantsearch';
import { RecaptchaModule } from 'ng-recaptcha';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from '../app-routing.module';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { PointDialogComponent } from '../point-dialog/point-dialog.component';
import { CardDialogComponent } from '../shared/card-dialog/card-dialog.component';
import { SharedModule } from '../shared/shared.module';
import { ShellModule } from '../shell/shell.module';
import { ConfirmUnsubscribeDialogComponent } from './confirm-unsubscribe-dialog/confirm-unsubscribe-dialog.component';
import { ListEditDialogComponent } from './list-edit-dialog/list-edit-dialog.component';
import { MailDialogComponent } from './mail-dialog/mail-dialog.component';
import { markedOptionsFactory } from './markedOptionsFactory';
import { NotFoundComponent } from './not-found/not-found.component';
import { SharedConfirmDialogComponent } from './shared-confirm-dialog/shared-confirm-dialog.component';
import { TagEditorDialogComponent } from './tag-editor-dialog/tag-editor-dialog.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    CardDialogComponent,
    ConfirmUnsubscribeDialogComponent,
    SharedConfirmDialogComponent,
    MailDialogComponent,
    LoginDialogComponent,
    ListEditDialogComponent,
    TagEditorDialogComponent,
    PointDialogComponent,
  ],
  imports: [
    SharedModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    AngularFireMessagingModule,
    HttpClientModule,
    NgAisModule,
    AngularFireAnalyticsModule,
    LayoutModule,
    RecaptchaModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      },
    }),
    DeviceDetectorModule.forRoot(),
  ],
  exports: [
    MarkdownModule,
    SharedModule,
    AppRoutingModule,
    NotFoundComponent,
    DeviceDetectorModule,
    NgxJsonLdModule,
    ShellModule,
    MatMomentDateModule,
  ],
  providers: [{ provide: REGION, useValue: 'asia-northeast1' }, DatePipe],
  entryComponents: [
    CardDialogComponent,
    ListEditDialogComponent,
    ConfirmUnsubscribeDialogComponent,
    SharedConfirmDialogComponent,
    MailDialogComponent,
    LoginDialogComponent,
    TagEditorDialogComponent,
  ],
})
export class CoreModule {}
