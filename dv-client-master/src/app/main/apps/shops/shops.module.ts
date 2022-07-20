import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import {
  AssetUploaderModule,
  ConfirmDialogModule,
  DateTimePickerModule,
  MapFieldModule,
  WeeklyTimePickerModule,
  YoutubePlayerModule
} from '@dv/components';

import { ShopsService } from './shops.service';
import { ShopService } from './shop/shop.service';

import { ShopsComponent } from './shops.component';
import { ShopComponent } from './shop/shop.component';


const routes: Routes = [
  {
    path: ':id',
    component: ShopComponent,
    resolve: {
      data: ShopService
    }
  },
  {
    path: '**',
    component: ShopsComponent,
    resolve: {
      data: ShopsService
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule,
    MapFieldModule,
    AssetUploaderModule,
    DateTimePickerModule,
    WeeklyTimePickerModule,
    ConfirmDialogModule,
    YoutubePlayerModule
  ],
  declarations: [
    ShopComponent,
    ShopsComponent
  ],
  providers: [
    ShopsService,
    ShopService
  ]
})
export class ShopsModule {
}
