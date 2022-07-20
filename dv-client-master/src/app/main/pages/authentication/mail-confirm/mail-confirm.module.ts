import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import { NotAuthGuard } from '@dv/guards/not-auth.guard';

import { MailConfirmComponent } from './mail-confirm.component';

const routes: Routes = [
  {
    path: 'auth/mail-confirm',
    component: MailConfirmComponent,
    canActivate: [NotAuthGuard]
  }
];

@NgModule({
  declarations: [
    MailConfirmComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule
  ]
})
export class MailConfirmModule {
}
