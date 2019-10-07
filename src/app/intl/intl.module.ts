import { NgModule } from '@angular/core';
import { IntlRoutingModule } from './intl-routing.module';
import { TermsComponent } from './terms/terms.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { LawComponent } from './law/law.component';
import { SharedModule } from '../shared/shared.module';
import { RootComponent } from './root/root.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { PressComponent } from './press/press.component';
import { GuidelineComponent } from './guideline/guideline.component';
import { ContactComponent } from './contact/contact.component';

@NgModule({
  declarations: [
    TermsComponent,
    PrivacypolicyComponent,
    LawComponent,
    RootComponent,
    HelpComponent,
    AboutComponent,
    PressComponent,
    GuidelineComponent,
    ContactComponent
  ],
  imports: [
    SharedModule,
    IntlRoutingModule,
    MatSidenavModule,
    MatExpansionModule
  ]
})
export class IntlModule { }
