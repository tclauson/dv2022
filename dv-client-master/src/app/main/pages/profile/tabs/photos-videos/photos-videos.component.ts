import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import { dvAnimations } from '@dv/animations';

import { PreviewLightboxService } from '@dv/components/preview-lightbox/preview-lightbox.service';
import { ProfileService } from 'app/main/pages/profile/profile.service';

@Component({
  selector: 'profile-photos-videos',
  templateUrl: './photos-videos.component.html',
  styleUrls: ['./photos-videos.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class ProfilePhotosVideosComponent implements OnInit, OnDestroy {
  photosVideos: any;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {ProfileService} _profileService
   * @param {PreviewLightboxService} _previewLightboxService
   */
  constructor(
    private _profileService: ProfileService,
    private _previewLightboxService: PreviewLightboxService,
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this._profileService.profile
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        const assets = _.pick(user, ['shop.featuredAsset', 'shop.assetGallery']);
        // Cloned to avoid modifying original object
        const assetGallery = [...assets.shop.assetGallery];
        assetGallery.unshift(assets.shop.featuredAsset);
        this.photosVideos = _.groupBy(assetGallery, a => {
          return moment(a.createdAt).format('MMM YYYY')
        });
      })
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open Image Preview
   *
   * @param {File | string} asset
   */
  openLightbox(asset: File | string): void {
    this._previewLightboxService.open({ asset })
  }
}
