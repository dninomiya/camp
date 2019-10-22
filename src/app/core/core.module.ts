import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { SharedModule } from '../shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { NgxStripeModule } from 'ngx-stripe';
import { AngularFireFunctionsModule, FunctionsRegionToken } from '@angular/fire/functions';
import { AppRoutingModule } from '../app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { DatePipe } from '@angular/common';
import { markedOptionsFactory } from './markedOptionsFactory';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { CardDialogComponent } from '../shared/card-dialog/card-dialog.component';
import { AddListDialogComponent } from './add-list-dialog/add-list-dialog.component';
import { ShellModule } from '../shell/shell.module';
import { ConnectStripeComponent } from './connect-stripe/connect-stripe.component';
import { ConfirmUnsubscribeDialogComponent } from './confirm-unsubscribe-dialog/confirm-unsubscribe-dialog.component';
import { SharedConfirmDialogComponent } from './shared-confirm-dialog/shared-confirm-dialog.component';
import { ChannelReviewDialogComponent } from './channel-review-dialog/channel-review-dialog.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { MailDialogComponent } from './mail-dialog/mail-dialog.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { ConnectVimeoComponent } from './connect-vimeo/connect-vimeo.component';
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { ListEditDialogComponent } from './list-edit-dialog/list-edit-dialog.component';
import { TagEditorDialogComponent } from './tag-editor-dialog/tag-editor-dialog.component';
import { NgAisModule } from 'angular-instantsearch';

@NgModule({
  declarations: [
    NotFoundComponent,
    CardDialogComponent,
    AddListDialogComponent,
    ConnectStripeComponent,
    ConfirmUnsubscribeDialogComponent,
    SharedConfirmDialogComponent,
    ChannelReviewDialogComponent,
    MailDialogComponent,
    ConnectVimeoComponent,
    LoginDialogComponent,
    ListEditDialogComponent,
    TagEditorDialogComponent
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
    RecaptchaModule,
    MarkdownModule.forRoot({
      loader: HttpClient,
      markedOptions: {
        provide: MarkedOptions,
        useFactory: markedOptionsFactory,
      },
    }),
    NgxStripeModule.forRoot(environment.stripe.publicKey),
    DeviceDetectorModule.forRoot()
  ],
  exports: [
    MarkdownModule,
    SharedModule,
    AppRoutingModule,
    NotFoundComponent,
    DeviceDetectorModule,
    ConnectStripeComponent,
    NgxJsonLdModule,
    ShellModule,
    ConnectVimeoComponent
  ],
  providers: [
    { provide: FunctionsRegionToken, useValue: 'us-central1' },
    DatePipe
  ],
  entryComponents: [
    CardDialogComponent,
    ListEditDialogComponent,
    AddListDialogComponent,
    ConfirmUnsubscribeDialogComponent,
    SharedConfirmDialogComponent,
    ChannelReviewDialogComponent,
    MailDialogComponent,
    LoginDialogComponent,
    TagEditorDialogComponent
  ]
})
export class CoreModule { }
