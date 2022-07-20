import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';

import { Error404Component } from 'app/main/pages/errors/404/error-404.component';

const routes = [
  {
    path: 'errors/error-404',
    component: Error404Component
  }
];

@NgModule({
  declarations: [
    Error404Component
  ],
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule
  ]
})
export class Error404Module {
}
