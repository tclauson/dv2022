import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import { NotAuthGuard } from '@dv/guards/not-auth.guard';

import { ForgotPasswordComponent } from './forgot-password.component';
import { ForgotPasswordService } from './forgot-password.service';

const routes: Routes = [
  {
    path: 'auth/forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [NotAuthGuard]
  }
];

@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule,
  ],
  providers: [
    ForgotPasswordService
  ]
})
export class ForgotPasswordModule {
}
