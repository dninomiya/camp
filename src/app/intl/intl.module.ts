import { NgModule } from '@angular/core';
import { IntlRoutingModule } from './intl-routing.module';
import { TermsComponent } from './terms/terms.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { LawComponent } from './law/law.component';
import { SharedModule } from '../shared/shared.module';
import { RootComponent } from './root/root.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HelpComponent } from './help/help.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { PressComponent } from './press/press.component';
import { GuidelineComponent } from './guideline/guideline.component';
import { ContactComponent } from './contact/contact.component';
import { LegalComponent } from './legal/legal.component';

@NgModule({
  declarations: [
    TermsComponent,
    PrivacypolicyComponent,
    LawComponent,
    RootComponent,
    HelpComponent,
    PressComponent,
    GuidelineComponent,
    ContactComponent,
    LegalComponent
  ],
  imports: [
    SharedModule,
    IntlRoutingModule,
    MatSidenavModule,
    MatExpansionModule
  ]
})
export class IntlModule {}
