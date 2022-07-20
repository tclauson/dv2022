import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { dvAnimations } from '@dv/animations';

import { DealService } from './deal.service';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { AbilityService } from '@dv/services/ability.service';

import { Deal } from './deal.model';
import { RefIdModel } from '@dv/types';

@Component({
  selector: 'app-add-update-deal',
  templateUrl: './deal.component.html',
  styleUrls: ['./deal.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})

export class DealComponent implements OnDestroy, OnInit {
  readonly errorMessages: any = {
    name: [
      { type: 'required', message: 'Deal name is required' },
    ],
    summary: [
      { type: 'required', message: 'Summary is required' },
    ],
    included: [
      { type: 'required', message: 'What\'s included is required' },
    ],
    dealTarget: [
      { type: 'required', message: 'Deal Target is required' },
    ],
    price: [
      { type: 'required', message: 'Price is required' },
    ],
    expiry: [
      { type: 'required', message: 'Expiry is required' },
    ],
  };

  deal: Deal;
  pageType: string;
  dealForm: FormGroup;
  readyForUpload: boolean;
  refIdModel: RefIdModel;
  dealTargets: any[];
  canExec: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {FormBuilder} _formBuilder
   * @param {SnackBarService} _snackBarService
   * @param {DealService} _dealService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {AbilityService} _abilityService
   */
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _snackBarService: SnackBarService,
    private _dealService: DealService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _abilityService: AbilityService,
  ) {
    // Set the default
    this.deal = new Deal();
    this.readyForUpload = false;
    this.refIdModel = { model: 'Deal', refId: '' }
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
    this._dealService.onDealTargetChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        this.dealTargets = res.collection || res || [];
      });

    // Subscribe to update deals on changes
    this._dealService.onDealChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(deal => {
        if (deal) {
          this.deal = new Deal(deal);
          this.pageType = 'edit';
        } else {
          this.pageType = 'new';
          this.deal = new Deal();
        }

        this.dealForm = this.createDealForm();

        const action = this.pageType === 'edit' ? 'update' : 'create';
        this.canExec = this._abilityService.canExec(action, 'Deal', this.deal)

        if (!this.canExec) {
          this.dealForm.disable();
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
   * Create deal form
   *
   * @returns {FormGroup}
   */
  createDealForm(): FormGroup {
    return this._formBuilder.group({
      name: [this.deal.name, [Validators.required]],
      summary: [this.deal.summary, [Validators.required]],
      included: [this.deal.included, [Validators.required]],
      dealTarget: [this.deal.dealTarget, [Validators.required]],
      price: [this.deal.price, [Validators.required]],
      expiry: [this.deal.expiry, [Validators.required]]
    });
  }


  /**
   * Add/Update deal
   * @param {boolean} update
   */
  addSaveDeal(): void {
    this._dvProgressSpinnerService.show('Saving Deal')
    const data = this.dealForm.getRawValue();

    if (this.pageType === 'edit') {
      data._id = this.deal._id;
    }
    this._dealService.addSaveDeal(data)
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
    this._router.navigate([`/apps/deals/`]).then(() => {
      this._snackBarService.showMessage('Deal saved')
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
    this.dealForm.markAsDirty();
  }
}
