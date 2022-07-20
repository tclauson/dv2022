import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { dvAnimations } from '@dv/animations';

import { SnackBarService } from '@dv/services/snack-bar.service';
import { SpotService } from './spot.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { AbilityService } from '@dv/services/ability.service';

import { Spot } from './spot.model';
import { AddressType } from '@dv/types/map-object';
import { RefIdModel } from '@dv/types/uploader';

@Component({
  selector: 'spot',
  templateUrl: './spot.component.html',
  styleUrls: ['./spot.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})

export class SpotComponent implements OnDestroy, OnInit {
  readonly errorMessages: any = {
    name: [
      { type: 'required', message: 'Spot name is required' }
    ],
    address: {
      fullAddress: [
        { type: 'required', message: 'Address is required' }
      ]
    }
  };

  spot: Spot;
  pageType: string;
  spotForm: FormGroup;
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
   * @param {SpotService} _spotService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {AbilityService} _abilityService
   */
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _snackBarService: SnackBarService,
    private _spotService: SpotService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _abilityService: AbilityService,
  ) {
    // Set the default
    this.spot = new Spot();
    this.fullAddress = { } as AddressType;
    this.readyForUpload = false;
    this.refIdModel = { model: 'Spot', refId: '' };
    this.canExec = true;

    // Set the private defaults
    this._unsubscribeAll = new Subject<any>();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to update spots on changes
    this._spotService.onSpotChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(spot => {

        if (spot) {
          this.spot = new Spot(spot);
          this.pageType = 'edit';
        } else {
          this.pageType = 'new';
          this.spot = new Spot();
        }

        this.spotForm = this.createSpotForm();

        const action = this.pageType === 'edit' ? 'update' : 'create';
        this.canExec = this._abilityService.canExec(action, 'Spot')

        if (!this.canExec) {
          this.spotForm.disable();
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
   * Create spots form
   *
   * @returns {FormGroup}
   */
  createSpotForm(): FormGroup {
    return this._formBuilder.group({
      name: [this.spot.name, [Validators.required]],
      address: this._formBuilder.group({
        lngLat: this._formBuilder.group({
          type: this.spot.address.lngLat.type,
          coordinates: [this.spot.address.lngLat.coordinates, [Validators.required]]
        }),
        fullAddress: [this.spot.address.fullAddress, [Validators.required]],
        district: [this.spot.address.district],
        region: [this.spot.address.region],
        country: [this.spot.address.country, [Validators.required]],
      }),
    });
  }

  /**
   * Add spots
   */
  addSaveSpot(): void {
    this._dvProgressSpinnerService.show('Saving Spot')
    const data = this.spotForm.getRawValue();

    if (this.pageType === 'edit') {
      data._id = this.spot._id;
    }
    this._spotService.addSaveSpot(data)
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
    // Redirect to spots and show message
    this._router.navigate(['/apps/spots']).then(() => {
      this._snackBarService.showMessage('Spot saved')
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
    this.spotForm.markAsDirty();
  }

}
