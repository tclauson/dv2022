import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { dvAnimations } from '@dv/animations';

import { SnackBarService } from '@dv/services/snack-bar.service';
import { TierService } from './tier.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { AbilityService } from '@dv/services/ability.service';

import { Tier } from './tier.model';

@Component({
  selector: 'tier',
  templateUrl: './tier.component.html',
  styleUrls: ['./tier.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class TierComponent implements OnInit, OnDestroy {
  readonly errorMessages: any = {
    tier1: {
      fee: [
        { type: 'required', message: 'Tier1 Fee required' },
      ]
    },
    tier2: {
      fee: [
        { type: 'required', message: 'Tier2 Fee required' },
      ]
    },
  };

  tier: Tier;
  tierForm: FormGroup;
  canExec: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {FormBuilder} _formBuilder
   * @param {SnackBarService} _snackBarService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {AbilityService} _abilityService
   * @param {TierService} _tierService
   */
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _snackBarService: SnackBarService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _abilityService: AbilityService,
    private _tierService: TierService,
  ) {
    // Set the default
    this.tier = new Tier();
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
    // Subscribe to update tier on changes
    this._tierService.onTierChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(tier => {
        this.tier = new Tier(tier);

        this.tierForm = this.createTierForm();
        this.canExec = this._abilityService.canExec('update', 'Role')

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
   * Create tier form
   *
   * @returns {FormGroup}
   */
  createTierForm(): FormGroup {
    return this._formBuilder.group({
      tier1: this._formBuilder.group({
        fee: [this.tier.tier1.fee, [Validators.required]],
        description: [this.tier.tier1.description]
      }),
      tier2: this._formBuilder.group({
        fee: [this.tier.tier2.fee, [Validators.required]],
        description: [this.tier.tier2.description]
      })
    });
  }

  /**
   * Update tier
   */
  saveTier(): void {
    this._dvProgressSpinnerService.show('Saving Tier')
    const data = this.tierForm.getRawValue();

    data.tier1._id = this.tier.tier1._id;
    data.tier2._id = this.tier.tier2._id;

    this._tierService.saveTier(data)
      .then(res => {
        this._tierService.getTier().then();
        this._dvProgressSpinnerService.hide();
        this._snackBarService.showMessage('Tier updated successfully')
      });
  }
}
