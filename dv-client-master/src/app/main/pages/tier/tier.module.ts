import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import { TextEditorModule } from '@dv/components';

import { AuthGuard } from '@dv/guards/auth.guard';
import { TierService } from './tier.service';
import { TierComponent } from './tier.component';

const routes: Routes = [
  {
    path: 'tier',
    component: TierComponent,
    canActivate: [AuthGuard],

    resolve: {
      data: TierService
    }
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule,
    TextEditorModule,
  ],
  declarations: [
    TierComponent,
  ],
  providers: [
    TierService
  ]
})
export class TierModule {
}
