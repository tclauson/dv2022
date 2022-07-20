import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

import { DvUtils } from '@dv/utils';
import { dvAnimations } from '@dv/animations';

import { SnackBarService } from '@dv/services/snack-bar.service';
import { ShopService } from './shop.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { AbilityService } from '@dv/services/ability.service';

import { Shop } from './shop.model';
import { TelValidator } from '@dv/validators/phone-number.validator';
import { StreamValidator } from '@dv/validators/stream.validator';
import { UrlValidator } from '@dv/validators/url.validator';
import { AddressType } from '@dv/types/map-object';
import { RefIdModel } from '@dv/types/uploader';

@Component({
  selector: 'shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class ShopComponent implements OnInit, OnDestroy {
  readonly errorMessages: any = {
    personalDetails: {
      name: [
        { type: 'required', message: 'Full name is required' },
      ],
      email: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Enter a valid email address' }
      ],
      tel: [
        { type: 'required', message: 'Phone number is required' },
        { type: 'invalidNumber', message: 'Phone number is not valid' },
      ],
    },
    shopDetails: {
      name: [
        { type: 'required', message: 'Shop name is required' }
      ],
      website: [
        { type: 'invalidUrl', message: 'Website link is not valid' }
      ],
      streamLink: [
        { type: 'invalidStream', message: 'Stream link is not valid' }
      ],
    }
  };

  shop: Shop;
  pageType: string;
  shopForm: FormGroup;
  fullAddress: AddressType;
  readyForUpload: boolean;
  refIdModel: RefIdModel
  canExec: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {FormBuilder} _formBuilder
   * @param {SnackBarService} _snackBarService
   * @param {ShopService} _shopService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {AbilityService} _abilityService
   */
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _snackBarService: SnackBarService,
    private _shopService: ShopService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _abilityService: AbilityService,
  ) {
    // Set the default
    this.shop = new Shop();
    this.fullAddress = { } as AddressType;
    this.readyForUpload = false;
    this.refIdModel = { model: 'Shop', refId: '' }
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
    // Subscribe to update shops on changes
    this._shopService.onShopChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(shop => {
        if (shop) {
          this.shop = new Shop(shop);
          this.pageType = 'edit';
        } else {
          this.pageType = 'new';
          this.shop = new Shop();
        }

        this.shopForm = this.createShopForm();

        const action = this.pageType === 'edit' ? 'update' : 'create';
        this.canExec = this._abilityService.canExec(action, 'Shop')

        if (!this.canExec) {
          this.shopForm.disable();
        }

        const streamLinkControl = this.shopForm.get('shopDetails.streamLink');

        streamLinkControl
          .valueChanges
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(value => {
            const streamIdControl = this.shopForm.get('shopDetails.streamId');
            if (streamLinkControl.valid) {
              const youtubeStreamId = DvUtils.youtubeIdExtractor(value);
              streamIdControl.patchValue(youtubeStreamId)
            } else {
              streamIdControl.patchValue('');
            }
          })
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
   * Create shops form
   *
   * @returns {FormGroup}
   */
  createShopForm(): FormGroup {
    return this._formBuilder.group({
      personalDetails: this._formBuilder.group({
        name: [this.shop.personalDetails.name, [Validators.required]],
        email: [this.shop.personalDetails.email, [Validators.required, Validators.email]],
        tel: [this.shop.personalDetails.tel, Validators.compose([Validators.required, TelValidator.telValidator])],
        dob: [this.shop.personalDetails.dob],
        gender: [this.shop.personalDetails.gender]
      }),
      shopDetails: this._formBuilder.group({
        name: [this.shop.shopDetails.name, [Validators.required]],
        website: [this.shop.shopDetails.website, [UrlValidator.urlValidator]],
        shopTime: this._formBuilder.group({
          monday: [this.shop.shopDetails.shopTime.monday, [Validators.required]],
          tuesday: [this.shop.shopDetails.shopTime.tuesday, [Validators.required]],
          wednesday: [this.shop.shopDetails.shopTime.wednesday, [Validators.required]],
          thursday: [this.shop.shopDetails.shopTime.thursday, [Validators.required]],
          friday: [this.shop.shopDetails.shopTime.friday, [Validators.required]],
          saturday: [this.shop.shopDetails.shopTime.saturday, [Validators.required]],
          sunday: [this.shop.shopDetails.shopTime.sunday, [Validators.required]],
        }),
        address: this._formBuilder.group({
          lngLat: this._formBuilder.group({
            type: this.shop.shopDetails.address.lngLat.type,
            coordinates: [this.shop.shopDetails.address.lngLat.coordinates, [Validators.required]]
          }),
          fullAddress: [this.shop.shopDetails.address.fullAddress, [Validators.required]],
          district: [this.shop.shopDetails.address.district],
          region: [this.shop.shopDetails.address.region],
          country: [this.shop.shopDetails.address.country, [Validators.required]],
        }),
        streamLink: [this.shop.shopDetails.streamLink, [StreamValidator.streamValidator]],
        streamId: [this.shop.shopDetails.streamId],
      })
    });
  }

  /**
   * Add/Update shop
   */
  addSaveShop(): void {
    this._dvProgressSpinnerService.show('Saving Shop')
    const data = _.omit(this.shopForm.getRawValue(), ['shopDetails.streamLink']);

    if (this.pageType === 'edit') {
      data.shopDetails._id = this.shop.shopDetails._id;
      data.personalDetails._id = this.shop.personalDetails._id;
    }
    this._shopService.addSaveShop(data)
      .then(res => {
        this.refIdModel.refId = res._id
        this.readyForUpload = true;
      });
  }

  /**
   * On Upload Successful
   */
  onUploadSuccessful(): void {
    this.readyForUpload = false;
    this._dvProgressSpinnerService.hide();
    // Redirect to shops and show message
    this._router.navigate(['/apps/shops']).then(() => {
      this._snackBarService.showMessage('Shop saved')
    })
  }

  /**
   * On Upload Failed
   */
  onUploadFailed(): void {
    this.readyForUpload = false;
    this._dvProgressSpinnerService.hide();
  }

  /**
   * On Asset Changed
   */
  onAssetChanged(): void {
    this.shopForm.markAsDirty();
  }
}
