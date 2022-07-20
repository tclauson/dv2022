import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import { DateTimePickerModule, AssetUploaderModule, TextEditorModule, ConfirmDialogModule } from '@dv/components';

import { DealsService } from './deals.service';
import { DealService } from './deal/deal.service';

import { DealsComponent } from './deals.component';
import { DealComponent } from './deal/deal.component';

const routes: Routes = [
  {
    path: ':id',
    component: DealComponent,
    resolve: {
      data: DealService
    }
  },
  {
    path: '**',
    component: DealsComponent,
    resolve: {
      data: DealsService
    }
  },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule,
    TextEditorModule,
    DateTimePickerModule,
    AssetUploaderModule,
    ConfirmDialogModule
  ],
  declarations: [
    DealsComponent,
    DealComponent
  ],
  providers: [
    DealsService,
    DealService
  ]
})
export class DealsModule { }
