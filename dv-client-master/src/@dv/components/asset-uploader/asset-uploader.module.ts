import { NgModule } from '@angular/core';

import { DvSharedModule } from '@dv/shared.module';
// Shorten URL causes emod error
import { PreviewLightboxModule } from '../preview-lightbox/preview-lightbox.module';

import { AssetUploaderComponent } from './asset-uploader.component';

@NgModule({
  imports: [
    DvSharedModule,
    PreviewLightboxModule
  ],
  declarations: [
    AssetUploaderComponent,
  ],
  exports: [
    AssetUploaderComponent
  ]
})

export class AssetUploaderModule { }
