import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import { NotAuthGuard } from '@dv/guards/not-auth.guard';

import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordService } from './reset-password.service';

const routes: Routes = [
  {
    path: 'auth/reset-password/:email/:token',
    component: ResetPasswordComponent,
    canActivate: [NotAuthGuard],
    resolve: {
      data: ResetPasswordService
    }
  }
];

@NgModule({
  declarations: [
    ResetPasswordComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule
  ],
  providers: [
    ResetPasswordService
  ]
})
export class ResetPasswordModule {
}
