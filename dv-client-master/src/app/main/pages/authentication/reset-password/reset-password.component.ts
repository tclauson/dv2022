import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DvConfigService } from '@dv/services/config.service';
import { dvAnimations } from '@dv/animations';

import { PasswordValidator } from '@dv/validators/password.validator';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { ResetPasswordService } from './reset-password.service';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class ResetPasswordComponent implements OnInit {
  readonly errorMessages: any = {
    password: [
      { type: 'required', message: 'New Password is required' },
      { type: 'notEqual', message: 'New Password and Confirm Password does not match' },
      { type: 'lengthRequired', message: 'New Password must be of at least 8 characters' },
      { type: 'lowerRequired', message: 'New Password must contain at least one lower case character' },
      { type: 'upperRequired', message: 'New Password must contain at least one upper case character' },
      { type: 'specialRequired', message: 'New Password must contain at least one special character' },
      { type: 'numberRequired', message: 'New Password must contain at least one number' },
    ],
    confirmPassword: [
      { type: 'required', message: 'Confirm Password is required' },
      { type: 'notEqual', message: 'New Password and Confirm Password does not match' },
      { type: 'lengthRequired', message: 'Confirm Password must be of at least 8 characters' },
      { type: 'lowerRequired', message: 'Confirm Password must contain at least one lower case character' },
      { type: 'upperRequired', message: 'Confirm Password must contain at least one upper case character' },
      { type: 'specialRequired', message: 'Confirm Password must contain at least one special character' },
      { type: 'numberRequired', message: 'Confirm Password must contain at least one number' },
    ]
  };

  passwordForm: FormGroup;
  isLoading: boolean;


  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {FormBuilder} _formBuilder
   * @param {DvConfigService} _dvConfigService
   * @param {SnackBarService} _snackBarService
   * @param {ResetPasswordService} _resetPasswordService
   */
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _dvConfigService: DvConfigService,
    private _snackBarService: SnackBarService,
    private _resetPasswordService: ResetPasswordService,
  ) {
    // Configure the layout
    this._dvConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };

    // Set the defaults
    this.isLoading = false;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.passwordForm = this._formBuilder.group(
      {
        password: ['', Validators.compose([Validators.required, PasswordValidator.policyValidator])],
        confirmPassword: ['', Validators.compose([Validators.required, PasswordValidator.policyValidator])]
      },
      {
        validators: PasswordValidator.equalValidator('password', 'confirmPassword')
      }
    );
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Reset Password
   */
  resetPassword(): void {
    const data = this.passwordForm.getRawValue()
    if (data.password !== data.confirmPassword) {
      this._snackBarService.showMessage('New Password and Confirm Password Does Not Match');
      return;
    }
    this.isLoading = true;
    this._resetPasswordService.resetPassword(data.password)
      .then(() => {
        this._router.navigate(['/pages/auth/login'])
          .then(() => {
            this._snackBarService.showMessage('Password Updated Successfully');
          })
      })
      .catch(() => {
        this.isLoading = false;
        this._router.navigate(['/pages/errors/invalid-token']);
      })
  }

}