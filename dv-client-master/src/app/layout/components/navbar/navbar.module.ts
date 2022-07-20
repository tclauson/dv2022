import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DvNavigationModule } from '@dv/components';
import { DvSharedModule } from '@dv/shared.module';

import { NavbarComponent } from './navbar.component';

@NgModule({
  declarations: [
    NavbarComponent
  ],
  imports: [
    MatButtonModule,
    MatIconModule,

    DvSharedModule,
    DvNavigationModule
  ],
  exports: [
    NavbarComponent
  ]
})
export class NavbarModule {
}
