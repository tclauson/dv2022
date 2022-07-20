import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { dvAnimations } from '@dv/animations';

import { SnackBarService } from '@dv/services/snack-bar.service';
import { PromotionService } from './promotion.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { AbilityService } from '@dv/services/ability.service';

import { Promotion } from './promotion.model';

@Component({
  selector: 'promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class PromotionComponent implements OnInit, OnDestroy {
  readonly errorMessages: any = {
    title: [
      { type: 'required', message: 'Title is required' },
    ],
    description: [
      { type: 'required', message: 'Description required' },
    ]
  };

  @ViewChild('formDirective') private _formDirective: NgForm;

  promotion: Promotion;
  promotionForm: FormGroup;
  canExec: boolean;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {FormBuilder} _formBuilder
   * @param {SnackBarService} _snackBarService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {AbilityService} _abilityService
   * @param {PromotionService} _promotionService
   */
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _snackBarService: SnackBarService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _abilityService: AbilityService,
    private _promotionService: PromotionService,
  ) {
    // Set the default
    this.promotion = new Promotion();
    this.canExec = true;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.promotion = new Promotion();
    this.promotionForm = this.createPromotionForm();
    this.canExec = this._abilityService.canExec('create', 'Promotion')

    if (!this.canExec) {
      this._router.navigate(['/pages/errors/error-403'])
    }
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void { }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create promotion form
   *
   * @returns {FormGroup}
   */
  createPromotionForm(): FormGroup {
    return this._formBuilder.group({
      title: [this.promotion.title, [Validators.required]],
      description: [this.promotion.description, [Validators.required]]
    });
  }

  /**
   * Update promotion
   */
  sendPromotion(): void {
    this._dvProgressSpinnerService.show('Sending Promotion')
    const data = this.promotionForm.getRawValue();

    this._promotionService.sendPromotion(data)
      .then(res => {
        this._dvProgressSpinnerService.hide();
        this._formDirective.resetForm();
        this.promotionForm.reset();
        this._snackBarService.showMessage('Promotion sent successfully');
      });
  }
}
