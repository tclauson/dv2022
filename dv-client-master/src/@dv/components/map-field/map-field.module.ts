import { NgModule } from '@angular/core';

import { DvSharedModule } from '../../shared.module';
import { MapDialogModule } from '..';

import { MapFieldComponent } from './map-field.component';

@NgModule({
  imports: [
    DvSharedModule,
    MapDialogModule
  ],
  declarations: [
    MapFieldComponent
  ],
  exports: [
    MapFieldComponent
  ]
})

export class MapFieldModule { }
