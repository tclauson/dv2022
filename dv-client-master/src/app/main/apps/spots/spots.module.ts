import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import { AssetUploaderModule, ConfirmDialogModule, MapFieldModule } from '@dv/components';

import { SpotsService } from './spots.service';
import { SpotService } from './spot/spot.service';
import { ConditionsService } from './conditions/conditions.service';
import { ConditionService } from './conditions/condition/condition.service';

import { SpotsComponent } from './spots.component';
import { SpotComponent } from './spot/spot.component';
import { ConditionsComponent } from './conditions/conditions.component';
import { ConditionComponent } from './conditions/condition/condition.component';
import { DetailsDialogComponent } from './conditions/details-dialog/details-dialog.component';

const routes: Routes = [
  {
    path: ':spotId/conditions/:id',
    component: ConditionComponent,
    resolve: {
      data: ConditionService
    }
  },
  {
    path: ':spotId/conditions',
    component: ConditionsComponent,
    resolve: {
      data: ConditionsService
    }
  },
  {
    path: ':id',
    component: SpotComponent,
    resolve: {
      data: SpotService
    }
  },
  {
    path: '**',
    component: SpotsComponent,
    resolve: {
      data: SpotsService
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule,
    AssetUploaderModule,
    MapFieldModule,
    ConfirmDialogModule
  ],

  declarations: [
    SpotsComponent,
    SpotComponent,
    ConditionsComponent,
    ConditionComponent,
    DetailsDialogComponent,
  ],
  providers: [
    SpotsService,
    SpotService,
    ConditionsService,
    ConditionService,
  ],
  entryComponents: [
    DetailsDialogComponent
  ]
})
export class SpotsModule { }
