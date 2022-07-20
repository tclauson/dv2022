import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DvSharedModule } from '@dv/shared.module';
import {
  AssetUploaderModule,
  CropperModule,
  DateTimePickerModule,
  MapFieldModule,
  PreviewLightboxModule,
  WeeklyTimePickerModule,
  YoutubePlayerModule
} from '@dv/components';
import { AuthGuard } from '@dv/guards/auth.guard';

import { UpdateComponent } from './update/update.component';
import { ProfileComponent } from './profile.component';
import { ProfileAboutComponent } from './tabs/about/about.component';
import { ProfilePhotosVideosComponent } from './tabs/photos-videos/photos-videos.component';
import { ProfileLiveStreamComponent } from './tabs/live-stream/live-stream.component';


const routes: Routes = [
  {
    path: 'profile',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'update',
        component: UpdateComponent,
      },
      {
        path: '',
        component: ProfileComponent,
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),

    DvSharedModule,
    DateTimePickerModule,
    WeeklyTimePickerModule,
    MapFieldModule,
    AssetUploaderModule,
    PreviewLightboxModule,
    CropperModule,
    YoutubePlayerModule
  ],
  declarations: [
    UpdateComponent,
    ProfileComponent,
    ProfileAboutComponent,
    ProfilePhotosVideosComponent,
    ProfileLiveStreamComponent
  ]
})
export class ProfileModule { }
