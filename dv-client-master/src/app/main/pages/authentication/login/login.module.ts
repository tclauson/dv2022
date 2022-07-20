import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import { NotAuthGuard } from '@dv/guards/not-auth.guard';

import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [NotAuthGuard]
  }
];

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule
  ]
})

export class LoginModule { }
