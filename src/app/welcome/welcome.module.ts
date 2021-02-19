import { NgModule } from '@angular/core';

import { WelcomeRoutingModule } from './welcome-routing.module';
import { WelcomeComponent } from './welcome.component';
import { SharedModule } from '../shared/shared.module';
import { MockComponent } from './mock/mock.component';
import { NgxYoutubePlayerModule } from 'ngx-youtube-player';
import { NgxUsefulSwiperModule } from 'ngx-useful-swiper';
import { PlanListModule } from '../plan-list/plan-list.module';
import { ServicesComponent } from './services/services.component';
import { BuddyComponent } from './buddy/buddy.component';
import { FeaturesComponent } from './features/features.component';
import { ContactComponent } from './contact/contact.component';
import { FlowComponent } from './flow/flow.component';
import { VoicesComponent } from './voices/voices.component';
import { WorksComponent } from './works/works.component';
import { FaqSectionComponent } from './faq-section/faq-section.component';
import { MessageSectionComponent } from './message-section/message-section.component';
import { HeroSectionComponent } from './hero-section/hero-section.component';
import { SkillSectionComponent } from './skill-section/skill-section.component';
import { HeadingComponent } from './heading/heading.component';

@NgModule({
  declarations: [WelcomeComponent, MockComponent, ServicesComponent, BuddyComponent, FeaturesComponent, ContactComponent, FlowComponent, VoicesComponent, WorksComponent, FaqSectionComponent, MessageSectionComponent, HeroSectionComponent, SkillSectionComponent, HeadingComponent],
  imports: [
    SharedModule,
    WelcomeRoutingModule,
    NgxYoutubePlayerModule.forRoot(),
    NgxUsefulSwiperModule,
    PlanListModule,
  ],
})
export class WelcomeModule {}
