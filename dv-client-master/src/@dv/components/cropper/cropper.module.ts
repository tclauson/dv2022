import { NgModule } from '@angular/core';
import { DvSharedModule } from '../../shared.module';

import { CropperComponent } from './cropper.component';
import { CropperService } from './cropper.service';

@NgModule({
  imports: [
    DvSharedModule,
  ],
  declarations: [
    CropperComponent
  ],
  providers: [
    CropperService
  ],
  entryComponents: [
    CropperComponent
  ]
})

export class CropperModule { }
