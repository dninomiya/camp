import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TermsComponent } from './terms/terms.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { LawComponent } from './law/law.component';
import { RootComponent } from './root/root.component';
import { HelpComponent } from './help/help.component';
import { AboutComponent } from './about/about.component';
import { PressComponent } from './press/press.component';
import { GuidelineComponent } from './guideline/guideline.component';
import { ContactComponent } from './contact/contact.component';
import { LegalComponent } from './legal/legal.component';


const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: 'about',
        component: AboutComponent
      },
      {
        path: 'help',
        component: HelpComponent
      },
      {
        path: 'press',
        component: PressComponent
      },
      {
        path: 'legal',
        component: LegalComponent
      },
      {
        path: 'guideline',
        component: GuidelineComponent
      },
      {
        path: 'terms',
        component: TermsComponent
      },
      {
        path: 'contact',
        component: ContactComponent
      },
      {
        path: 'privacypolicy',
        component: PrivacypolicyComponent
      },
      {
        path: 'law',
        component: LawComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntlRoutingModule { }
