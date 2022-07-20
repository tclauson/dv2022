import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { dvAnimations } from '@dv/animations';
import { dvConfig } from '../../../dv-config';

import { DvConfigService } from '@dv/services/config.service';
import { ProfileService } from 'app/main/pages/profile/profile.service';
import { PreviewLightboxService } from '@dv/components/preview-lightbox/preview-lightbox.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { CropperService } from '@dv/components/cropper/cropper.service';


@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('updateAvatarEl', { static: false }) updateAvatarEl;

  name: string;
  avatarUrl: string;
  colorTheme: 'light' | 'dark';
  userColorTheme: 'light' | 'dark';
  colorThemeChanged: boolean;
  isShop: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {DvConfigService} _dvConfigService
   * @param {PreviewLightboxService} _previewLightboxService
   * @param {SnackBarService} _snackBarService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {CropperService} _cropperService
   * @param {ProfileService} _profileService
   */
  constructor(
    private _dvConfigService: DvConfigService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _snackBarService: SnackBarService,
    private _previewLightboxService: PreviewLightboxService,
    private _cropperService: CropperService,
    private _profileService: ProfileService,
  ) {
    // set the default
    this.name = '';
    this.avatarUrl = '';
    this.colorThemeChanged = false;
    this.isShop = false;

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
    this._dvConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(config => {
        this.colorTheme = config.colorTheme.includes('dark') ? 'dark' : 'light';
        if (this.userColorTheme) {
          this.colorThemeChanged = this.userColorTheme !== this.colorTheme;
        }
      })

    this._profileService.profile
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        this.name = user.name;
        this.isShop = user.shop && user.role.name === 'Shop';
        this.avatarUrl = user?.avatar?.url || '';
        this.userColorTheme = user?.colorTheme;
        this.colorThemeChanged = this.userColorTheme !== this.colorTheme;
      })
  }

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

  /**
   * Update Avatar
   */
  updateAvatar(): void {
    const assets: { [key: string]: File } = this.updateAvatarEl.nativeElement.files;
    const avatar: File = Object.values(assets)[0];
    this.openCropper(avatar);
  }

  /**
   * Opens cropper for image crop
   */
  openCropper(asset: File): void {
    const cropperDialog = this._cropperService.open({
      options: {
        aspectRatio: 1,
      },
      asset,
    })

    cropperDialog
      .afterClosed()
      .subscribe(res => {
        this.onCloseCropper(res);
      })
  }

  /**
   * Close Cropper
   *
   * @param {File | null} asset
   */
  onCloseCropper(asset: File | null): void {
    if (asset) {
      this._dvProgressSpinnerService.show('Updating Avatar...')
      this.updateAvatarEl.nativeElement.value = '';
      this._profileService.updateAvatar(asset)
        .subscribe(() => {
          this._dvProgressSpinnerService.hide();
        })
    } else {
      this.updateAvatarEl.nativeElement.value = '';
    }
  }

  /**
   * Change Color colorTheme
   */
  changeColorTheme(): void {
    const colorTheme = { colorTheme: dvConfig.colorTheme }
    if (this.colorTheme === 'light') {
      colorTheme.colorTheme += '-dark';
    } else {
      colorTheme.colorTheme.replace('-dark', '');
    }
    this._dvConfigService.config = colorTheme
  }

  /**
   * Save Color Scheme
   */
  saveColorScheme(): void {
    this._dvProgressSpinnerService.show('Updating Color Theme');
    this._profileService
      .updateInfo({ colorTheme: this.colorTheme })
      .subscribe(() => {
        this._snackBarService.showMessage('Color Scheme Updated Successfully');
        this._dvProgressSpinnerService.hide();
      });
  }

}
