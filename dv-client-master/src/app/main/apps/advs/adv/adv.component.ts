import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { dvAnimations } from '@dv/animations';
import { DvUtils } from '@dv/utils';

import { AbilityService } from '@dv/services/ability.service';
import { ErrorHandlerService } from '@dv/services/error-handler.service';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { CropperService } from '@dv/components/cropper/cropper.service';
import { AdvService } from './adv.service';

import { UrlValidator } from '@dv/validators/url.validator';
import { Adv } from './adv.model';

@Component({
  selector: 'adv',
  templateUrl: './adv.component.html',
  styleUrls: ['./adv.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class AdvComponent implements OnInit, OnDestroy {
  readonly errorMessages: any = {
    name: [
      { type: 'required', message: 'Full name is required' },
    ],
    url: [
      { type: 'invalidUrl', message: 'Link is not valid' }
    ],
  };

  @ViewChild('updateAssetEl', { static: false }) updateAssetEl;

  adv: Adv;
  advForm: FormGroup;
  canExec: boolean;
  asset: File;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {FormBuilder} _formBuilder
   * @param {ErrorHandlerService} _errorHandlerService
   * @param {SnackBarService} _snackBarService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {AbilityService} _abilityService
   * @param {CropperService} _cropperService
   * @param {AdvService} _advService
   */
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _errorHandlerService: ErrorHandlerService,
    private _snackBarService: SnackBarService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _abilityService: AbilityService,
    private _cropperService: CropperService,
    private _advService: AdvService,
  ) {
    // Set the default
    this.adv = new Adv();
    this.canExec = true;

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
    // Subscribe to update advs on changes
    this._advService.onAdvChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(adv => {
        this.adv = new Adv(adv);

        this.advForm = this.createAdvForm();
        this.canExec = this._abilityService.canExec('update', 'Adv')

        if (!this.canExec) {
          this._router.navigate(['/pages/errors/error-403'])
        }
      });
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
   * Create advs form
   *
   * @returns {FormGroup}
   */
  createAdvForm(): FormGroup {
    return this._formBuilder.group({
      name: [this.adv.name, [Validators.required]],
      url: [this.adv.url, [UrlValidator.urlValidator]]
    });
  }

  /**
   * Update Asset
   */
  updateAsset(): void {
    const assets: { [key: string]: File } = this.updateAssetEl.nativeElement.files;
    const asset = Object.values(assets)[0];
    if (!asset.type.match(/image\/*/)) {
      this._errorHandlerService.showError(`${asset.name} is not a valid image`);
      return;
    }

    this.openCropper(asset);
  }


  /**
   * Add/Update adv
   */
  addSaveAdv(): void {
    this._dvProgressSpinnerService.show('Saving Adv')
    const data = this.advForm.getRawValue();

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('url', data.url);

    if (this.asset) {
      const featuredAsset: any = this.adv.featuredAsset;
      formData.append('assets', this.asset, featuredAsset.uuid);
    }

    this._advService.saveAdv(formData, this.adv._id)
      .then(() => {
        this._dvProgressSpinnerService.hide();
        // Redirect to advs and show message
        this._router.navigate(['/apps/advs']).then(() => {
          this._snackBarService.showMessage('Adv saved')
        })
      });
  }

  /**
   * Opens cropper for image crop
   */
  openCropper(asset: File): void {
    const cropperDialog = this._cropperService.open({
      cropBoxData: {
        width: 320,
        height: 50
      },
      dragMode: 'move',
      options: {
        cropBoxResizable: false,
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
      const reader = new FileReader();
      reader.onloadend = (e: any) => {
        const uuidName = DvUtils.generateAssetName(asset.name);
        this.adv.featuredAsset = { uuid: uuidName, file: e.target.result };
        this.asset = asset;
        this.updateAssetEl.nativeElement.value = '';
      };
      reader.readAsDataURL(asset);
      this.advForm.markAsDirty();
    } else {
      this.updateAssetEl.nativeElement.value = '';
    }
  }

}
