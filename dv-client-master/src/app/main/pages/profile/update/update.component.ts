import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

import { DvUtils } from '@dv/utils';
import { dvAnimations } from '@dv/animations';

import { ProfileService } from 'app/main/pages/profile/profile.service';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { AbilityService } from '@dv/services/ability.service';

import { Profile } from './profile.model';
import { TelValidator } from '@dv/validators/phone-number.validator';
import { StreamValidator } from '@dv/validators/stream.validator';
import { UrlValidator } from '@dv/validators/url.validator';
import { AddressType } from '@dv/types/map-object';
import { RefIdModel } from '@dv/types/uploader';

@Component({
  selector: 'user',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class UpdateComponent implements OnInit, OnDestroy {
  readonly errorMessages: any = {
    name: [
      { type: 'required', message: 'Full name is required' },
    ],
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Enter a valid email address' }
    ],
    dob: [
      { type: 'required', message: 'Date of birth is required' },
    ],
    tel: [
      { type: 'required', message: 'Phone number is required' },
      { type: 'invalidNumber', message: 'Phone number is not valid' },
    ],
    shop: {
      name: [
        { type: 'required', message: 'User name is required' }
      ],
      website: [
        { type: 'invalidUrl', message: 'Website link is not valid' }
      ],
      streamLink: [
        { type: 'invalidStream', message: 'Stream link is not valid' }
      ]
    }
  };

  user: Profile;
  userForm: FormGroup;
  fullAddress: AddressType;
  readyForUpload: boolean;
  refIdModel: RefIdModel
  canExec: boolean;
  isShop: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {FormBuilder} _formBuilder
   * @param {SnackBarService} _snackBarService
   * @param {ProfileService} _profileService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {AbilityService} _abilityService
   */
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _snackBarService: SnackBarService,
    private _profileService: ProfileService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _abilityService: AbilityService,
  ) {
    // Set the default
    this.user = new Profile(this._profileService.profile.getValue());
    this.fullAddress = { } as AddressType;
    this.readyForUpload = false;
    this.refIdModel = { model: 'Shop', refId: '' }
    this.canExec = true;
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
    // Subscribe to update users on changes
    this._profileService.profile
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        this.user = new Profile(user);
        this.isShop = this.user?.shop && user?.role?.name === 'Shop';
        this.userForm = this.createUserForm();
        this.canExec = this._abilityService.canExec('update', 'User', this.user)

        if (!this.canExec) {
          this.userForm.disable();
        }

        const streamLinkControl = this.userForm.get('shop.streamLink');

        streamLinkControl
          .valueChanges
          .pipe(takeUntil(this._unsubscribeAll))
          .subscribe(value => {
            const streamIdControl = this.userForm.get('shop.streamId');
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
   * Create users form
   *
   * @returns {FormGroup}
   */
  createUserForm(): FormGroup {
    const formGroup = this._formBuilder.group({
      name: [this.user.name, [Validators.required]],
      email: [{ value: this.user.email, disabled: true }],
      tel: [this.user.tel, Validators.compose([Validators.required, TelValidator.telValidator])],
      dob: [this.user.dob, [Validators.required]],
      gender: [this.user.gender, [Validators.required]],
    })

    if (this.isShop) {
      formGroup.addControl('shop',
        this._formBuilder.group({
          name: [this.user.shop.name, [Validators.required]],
          website: [this.user.shop.website, [UrlValidator.urlValidator]],
          shopTime: this._formBuilder.group({
            monday: [this.user.shop.shopTime.monday, [Validators.required]],
            tuesday: [this.user.shop.shopTime.tuesday, [Validators.required]],
            wednesday: [this.user.shop.shopTime.wednesday, [Validators.required]],
            thursday: [this.user.shop.shopTime.thursday, [Validators.required]],
            friday: [this.user.shop.shopTime.friday, [Validators.required]],
            saturday: [this.user.shop.shopTime.saturday, [Validators.required]],
            sunday: [this.user.shop.shopTime.sunday, [Validators.required]],
          }),
          address: this._formBuilder.group({
            lngLat: this._formBuilder.group({
              type: this.user.shop.address.lngLat.type,
              coordinates: [this.user.shop.address.lngLat.coordinates, [Validators.required]],
            }),
            fullAddress: [this.user.shop.address.fullAddress, [Validators.required]],
            district: [this.user.shop.address.district],
            region: [this.user.shop.address.region],
            country: [this.user.shop.address.country, [Validators.required]],
          }),
          streamLink: [this.user.shop.streamLink, [StreamValidator.streamValidator]],
          streamId: [this.user.shop.streamId],
        })
      )
    }

    return formGroup;
  }

  /**
   * Update Info
   */
  updateInfo(): void {
    this._dvProgressSpinnerService.show('Saving User')
    const data = _.omit(this.userForm.getRawValue(), ['email', 'shop.streamLink']);

    if (this.isShop) {
      data.shop._id = this.user.shop._id;
    }

    this._profileService
      .updateInfo(data)
      .subscribe(res => {
        if (this.isShop) {
          this.refIdModel.refId = res.shop._id
          this.readyForUpload = true;
        }
        else {
          this.onUploadSuccessful();
        }
      });
  }

  /**
   * On Upload Successful
   */
  onUploadSuccessful(): void {
    this.readyForUpload = false;
    this._dvProgressSpinnerService.hide();

    // Redirect to users and show message
    this._router.navigate(['/pages/profile']).then(() => {
      this._snackBarService.showMessage('Info updated')
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
    this.userForm.markAsDirty();
  }
}
