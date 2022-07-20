import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { dvAnimations } from '@dv/animations';

import { ConditionService } from './condition.service';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { AbilityService } from '@dv/services/ability.service';

import { Condition } from './condition.model';
import { RefIdModel } from '@dv/types/uploader';

@Component({
  selector: 'condition',
  templateUrl: './condition.component.html',
  styleUrls: ['./condition.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class ConditionComponent implements OnDestroy, OnInit {
  readonly errorMessages: any = {
    temperature: [
      { type: 'required', message: 'Temperature is required' }
    ],
    swell: [
      { type: 'required', message: 'Swell is required' }
    ],
    visibility: [
      { type: 'required', message: 'Visibility is required' }
    ],
    depth: [
      { type: 'required', message: 'Depth is required' }
    ],
    altitude: [
      { type: 'required', message: 'Altitude is required' }
    ],
    skill: [
      { type: 'required', message: 'Skill is required' }
    ],
  };

  condition: Condition;
  pageType: string;
  conditionForm: FormGroup;
  readyForUpload: boolean;
  refIdModel: RefIdModel;
  spotId: string;
  canExec: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {FormBuilder} _formBuilder
   * @param {SnackBarService} _snackBarService
   * @param {ConditionService} _conditionService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {AbilityService} _abilityService
   */
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _snackBarService: SnackBarService,
    private _conditionService: ConditionService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _abilityService: AbilityService,
  ) {
    // Set the default
    this.condition = new Condition();
    this.readyForUpload = false;
    this.refIdModel = { model: 'Condition', refId: '' }
    this.spotId = this._conditionService.routeParams.spotId;
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
    // Subscribe to update conditions on changes
    this._conditionService.onConditionChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(condition => {

        if (condition) {
          this.condition = new Condition(condition);
          this.pageType = 'edit';
        } else {
          this.pageType = 'new';
          this.condition = new Condition();
        }

        this.conditionForm = this.createConditionForm();

        const action = this.pageType === 'edit' ? 'update' : 'create';
        this.canExec = this._abilityService.canExec(action, 'Condition', this.condition)

        if (!this.canExec) {
          this.conditionForm.disable();
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
   * Create conditions form
   *
   * @returns {FormGroup}
   */
  createConditionForm(): FormGroup {
    return this._formBuilder.group({
      temperature: [this.condition.temperature, [Validators.required]],
      swell: [this.condition.swell, [Validators.required]],
      visibility: [this.condition.visibility, [Validators.required]],
      depth: [this.condition.depth, [Validators.required]],
      altitude: [this.condition.altitude, [Validators.required]],
      skill: [this.condition.skill, [Validators.required]],
    });
  }

  /**
   * Add conditions
   */
  addSaveCondition(): void {
    this._dvProgressSpinnerService.show('Saving Conditions')
    const data = this.conditionForm.getRawValue();

    if (this.pageType === 'edit') {
      data._id = this.condition._id;
    }
    this._conditionService.addSaveCondition(data)
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
    this._router.navigate([`/apps/spots/${this.spotId}/conditions`]).then(() => {
      this._snackBarService.showMessage('Conditions saved')
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
    this.conditionForm.markAsDirty();
  }

}
