import { NgModule } from '@angular/core';

import { DvSharedModule } from '@dv/shared.module';

import { PreviewLightboxService } from './preview-lightbox.service';

import { PreviewLightboxComponent } from './preview-lightbox.component';
import { CloseIconComponent } from './close-icon/close-icon.component';

@NgModule({
  imports: [
    DvSharedModule
  ],
  declarations: [
    PreviewLightboxComponent,
    CloseIconComponent
  ],
  providers: [
    PreviewLightboxService
  ],
  entryComponents: [
    PreviewLightboxComponent
  ]
})

export class PreviewLightboxModule { }
