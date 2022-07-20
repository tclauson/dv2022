import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';

import { PolicyComponent } from './policy.component';

const routes: Routes = [
  {
    path: 'policy',
    component: PolicyComponent,
  }
];

@NgModule({
  declarations: [
    PolicyComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule
  ]
})
export class PolicyModule {
}
