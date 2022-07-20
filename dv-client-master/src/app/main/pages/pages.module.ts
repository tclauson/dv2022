import { NgModule } from '@angular/core';

import { LoginModule } from './authentication/login/login.module';
import { ForgotPasswordModule } from './authentication/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './authentication/reset-password/reset-password.module';
import { MailConfirmModule } from './authentication/mail-confirm/mail-confirm.module';
import { Error403Module } from './errors/403/error-403.module';
import { Error404Module } from './errors/404/error-404.module';
import { Error500Module } from './errors/500/error-500.module';
import { InvalidTokenModule } from './errors/invalid-token/invalid-token.module';
import { ProfileModule } from './profile/profile.module';
import { TierModule } from './tier/tier.module';
import { PromotionModule } from './promotion/promotion.module';
import { PolicyModule } from './policy/policy.module';
import { TermsModule } from './terms/terms.module';

@NgModule({
  imports: [
    // Authentication
    LoginModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    MailConfirmModule,

    // Errors
    Error403Module,
    Error404Module,
    Error500Module,
    InvalidTokenModule,

    // Profile
    ProfileModule,

    // Admin
    TierModule,
    PromotionModule,

    // Policy
    PolicyModule,
    TermsModule
  ]
})

export class PagesModule { }
