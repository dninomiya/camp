import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatRadioModule } from '@angular/material/radio';
import { MarkdownModule } from 'ngx-markdown';
import { SafePipeModule } from 'safe-pipe';
import { DaysPipe } from './days.pipe';
import { FromNowPipe } from './pipes/from-now.pipe';
import { AutofocusDirective } from './autofocus.directive';
import { CardFormComponent } from '../setting/card-form/card-form.component';
import { ClipboardModule } from 'ngx-clipboard';
import { GridLessonItemComponent } from './grid-lesson-item/grid-lesson-item.component';
import { RouterModule } from '@angular/router';
import { WideLessonItemComponent } from './wide-lesson-item/wide-lesson-item.component';
import { VimeoComponent } from './vimeo/vimeo.component';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PrivacyLabelPipe } from './privacy-label.pipe';
import { PrivacyIconPipe } from './privacy-icon.pipe';
import { MatDialogModule } from '@angular/material/dialog';
import { InputImageComponent } from './input-image/input-image.component';
import { LimitPipe } from './limit.pipe';
import { CommentComponent } from './comment/comment.component';
import { VisibleDirective } from './visible.directive';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { AttachmentUserPipe } from './attachment-user.pipe';
import { PlanPerLabelPipe } from './plan-per-label.pipe';
import { PlanTitleLabelPipe } from './plan-title-label.pipe';
import { LinkIconPipe } from './link-icon.pipe';
import { SearchKitComponent } from '../shell/search-kit/search-kit.component';
import { RefinementListComponent } from './refinement-list/refinement-list.component';
import { MatChipsModule } from '@angular/material';
import { FooterComponent } from './footer/footer.component';
import { RatePipe } from './rate.pipe';
import { PlanPipe } from './plan.pipe';



@NgModule({
  declarations: [
    FromNowPipe,
    DaysPipe,
    AutofocusDirective,
    CardFormComponent,
    GridLessonItemComponent,
    WideLessonItemComponent,
    VimeoComponent,
    PrivacyLabelPipe,
    PrivacyIconPipe,
    InputImageComponent,
    LimitPipe,
    CommentComponent,
    VisibleDirective,
    StarRatingComponent,
    AttachmentUserPipe,
    PlanPerLabelPipe,
    PlanTitleLabelPipe,
    FooterComponent,
    LinkIconPipe,
    SearchKitComponent,
    RefinementListComponent,
    RatePipe,
    PlanPipe
  ],
  imports: [
    CommonModule,
    MarkdownModule.forChild(),
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SafePipeModule,
    HttpClientModule,
    MatMenuModule,
    HttpClientJsonpModule,
    MatAutocompleteModule
  ],
  exports: [
    CommonModule,
    MatCheckboxModule,
    MatCheckboxModule,
    MatButtonModule,
    MatBadgeModule,
    MatInputModule,
    MatAutocompleteModule,
    MatRippleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatRadioModule,
    MatMenuModule,
    MatToolbarModule,
    FooterComponent,
    MatListModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonToggleModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatSnackBarModule,
    SafePipeModule,
    MarkdownModule,
    MatBottomSheetModule,
    FromNowPipe,
    DaysPipe,
    AutofocusDirective,
    CardFormComponent,
    ClipboardModule,
    GridLessonItemComponent,
    WideLessonItemComponent,
    VimeoComponent,
    HttpClientModule,
    HttpClientJsonpModule,
    RouterModule,
    PrivacyLabelPipe,
    PrivacyIconPipe,
    MatDialogModule,
    InputImageComponent,
    LimitPipe,
    CommentComponent,
    VisibleDirective,
    StarRatingComponent,
    AttachmentUserPipe,
    PlanPerLabelPipe,
    PlanTitleLabelPipe,
    LinkIconPipe,
    SearchKitComponent,
    RefinementListComponent,
    RatePipe,
    PlanPipe
  ]
})
export class SharedModule { }
