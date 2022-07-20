import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';

import { InvalidTokenComponent } from './invalid-token.component';

const routes = [
  {
    path: 'errors/invalid-token',
    component: InvalidTokenComponent
  }
];

@NgModule({
  declarations: [
    InvalidTokenComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule
  ]
})
export class InvalidTokenModule {
}
