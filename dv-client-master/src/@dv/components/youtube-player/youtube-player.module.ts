import { NgModule } from '@angular/core';

import { YoutubePlayerComponent } from './youtube-player.component';
import { DvSharedModule } from '../../shared.module';

@NgModule({
  imports: [
    DvSharedModule
  ],
  declarations: [
    YoutubePlayerComponent
  ],
  exports: [
    YoutubePlayerComponent
  ]
})
export class YoutubePlayerModule {
}
