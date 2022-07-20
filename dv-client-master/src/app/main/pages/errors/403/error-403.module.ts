import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DvSharedModule } from '@dv/shared.module';

import { Error403Component } from 'app/main/pages/errors/403/error-403.component';

const routes = [
  {
    path: 'errors/error-403',
    component: Error403Component
  }
];

@NgModule({
  declarations: [
    Error403Component
  ],
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule
  ]
})
export class Error403Module {
}
