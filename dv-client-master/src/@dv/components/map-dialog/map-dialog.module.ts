import { NgModule } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { DvSharedModule } from '../../shared.module';

import { MapDialogComponent } from './map-dialog.component';

@NgModule({
  imports: [
    GoogleMapsModule,
    DvSharedModule
  ],
  declarations: [
    MapDialogComponent
  ],
  exports: [
    MapDialogComponent
  ],
  entryComponents: [
    MapDialogComponent
  ]
})

export class MapDialogModule { }
