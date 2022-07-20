import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import { TextEditorModule } from '@dv/components';

import { AuthGuard } from '@dv/guards/auth.guard';
import { PromotionService } from './promotion.service';
import { PromotionComponent } from './promotion.component';

const routes: Routes = [
  {
    path: 'promotion',
    component: PromotionComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule,
    TextEditorModule,
  ],
  declarations: [
    PromotionComponent,
  ],
  providers: [
    PromotionService
  ]
})
export class PromotionModule {
}
