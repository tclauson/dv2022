import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';

import { TermsComponent } from './terms.component';

const routes: Routes = [
  {
    path: 'terms',
    component: TermsComponent,
  }
];

@NgModule({
  declarations: [
    TermsComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule
  ]
})
export class TermsModule {
}
