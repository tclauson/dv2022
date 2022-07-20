import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import { AuthLazyGuard } from '@dv/guards/auth-lazy.guard';

const routes = [
  {
    path: 'dashboard/analytics',
    loadChildren: () => import('./dashboard/analytics/analytics.module').then(m => m.AnalyticsDashboardModule),
    canLoad: [AuthLazyGuard]
  },
  {
    path: 'shops',
    loadChildren: () => import('./shops/shops.module').then(m => m.ShopsModule),
    canLoad: [AuthLazyGuard]
  },
  {
    path: 'spots',
    loadChildren: () => import('./spots/spots.module').then(m => m.SpotsModule),
    canLoad: [AuthLazyGuard]
  },
  {
    path: 'deals',
    loadChildren: () => import('./deals/deals.module').then(m => m.DealsModule),
    canLoad: [AuthLazyGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
    canLoad: [AuthLazyGuard]
  },
  {
    path: 'advs',
    loadChildren: () => import('./advs/advs.module').then(m => m.AdvsModule),
    canLoad: [AuthLazyGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    DvSharedModule
  ]
})
export class AppsModule { }
