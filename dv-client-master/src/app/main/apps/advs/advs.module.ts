import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import { CropperModule, PreviewLightboxModule } from '@dv/components';

import { AdvsService } from './advs.service';
import { AdvService } from './adv/adv.service';

import { AdvsComponent } from './advs.component';
import { AdvComponent } from './adv/adv.component';


const routes: Routes = [
  {
    path: ':id',
    component: AdvComponent,
    resolve: {
      data: AdvService
    }
  },
  {
    path: '**',
    component: AdvsComponent,
    resolve: {
      data: AdvsService
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule,
    PreviewLightboxModule,
    CropperModule
  ],
  declarations: [
    AdvsComponent,
    AdvComponent
  ],
  providers: [
    AdvsService,
    AdvService
  ]
})
// Renamed to avoid AdBlocker issues
export class AdvsModule {
}
