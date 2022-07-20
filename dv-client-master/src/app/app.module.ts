import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AbilityModule } from '@casl/angular';
import { ɵe as TIME_LOCALE } from 'ngx-material-timepicker';

import { DvModule } from '@dv/dv.module';
import { DvSharedModule } from '@dv/shared.module';
import { DvProgressBarModule, DvSidebarModule, DvProgressSpinnerModule } from '@dv/components';
import { LayoutModule } from 'app/layout/layout.module';

import { JwtInterceptorUtil } from '@dv/utils/jwt-interceptor.util';
import { PureAbility } from '@casl/ability';

import { dvConfig } from 'app/dv-config';

import { AppAbility, conditionsMatcher, getSubjectType } from '../@dv/services/ability.service';
import { AppComponent } from 'app/app.component';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./main/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'apps',
    loadChildren: () => import('./main/apps/apps.module').then(m => m.AppsModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: '**',
    redirectTo: '/pages/errors/error-404'
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),

    TranslateModule.forRoot(),
    AbilityModule,

    // Dv modules
    DvModule.forRoot(dvConfig),
    DvProgressBarModule,
    DvProgressSpinnerModule,
    DvSharedModule,
    DvSidebarModule,

    // App modules
    LayoutModule,
  ],
  providers: [
    { provide: AppAbility, useValue: new AppAbility([], { detectSubjectType: getSubjectType, conditionsMatcher }) },
    { provide: PureAbility, useExisting: AppAbility },

    // Angular 9 Fix for MatTimePickerModule
    { provide: TIME_LOCALE, useValue: '' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorUtil, multi: true },
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule {
  constructor(
    private _injector: Injector
  ) {
    rootInjector = this._injector;
  }
}

export let rootInjector: Injector;
