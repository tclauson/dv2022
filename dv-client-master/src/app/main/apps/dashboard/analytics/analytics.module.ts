import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DvSharedModule } from '@dv/shared.module';
import { DvWidgetModule } from '@dv/components/widget/widget.module';

import { AnalyticsDashboardComponent } from 'app/main/apps/dashboard/analytics/analytics.component';
import { AnalyticsDashboardService } from 'app/main/apps/dashboard/analytics/analytics.service';

const routes: Routes = [
  {
    path: '**',
    component: AnalyticsDashboardComponent,
    resolve: {
      data: AnalyticsDashboardService
    }
  }
];

@NgModule({
  declarations: [
    AnalyticsDashboardComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    GoogleMapsModule,
    ChartsModule,
    NgxChartsModule,

    DvSharedModule,
    DvWidgetModule
  ],
  providers: [
    AnalyticsDashboardService
  ]
})
export class AnalyticsDashboardModule {
}

