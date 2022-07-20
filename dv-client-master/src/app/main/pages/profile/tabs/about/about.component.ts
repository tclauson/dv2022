import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';

import { dvAnimations } from '@dv/animations';

import { ProfileService } from 'app/main/pages/profile/profile.service';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { PasswordValidator } from '@dv/validators/password.validator';

@Component({
  selector: 'profile-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class ProfileAboutComponent implements OnInit, OnDestroy {
  readonly errorMessages: any = {
    password: [
      { type: 'required', message: 'Password is required' },
    ],
    newPassword: [
      { type: 'required', message: 'New Password is required' },
      { type: 'notEqual', message: 'New Password and Confirm New Password does not match' },
      { type: 'lengthRequired', message: 'New Password must be of at least 8 characters' },
      { type: 'lowerRequired', message: 'New Password must contain at least one lower case character' },
      { type: 'upperRequired', message: 'New Password must contain at least one upper case character' },
      { type: 'specialRequired', message: 'New Password must contain at least one special character' },
      { type: 'numberRequired', message: 'New Password must contain at least one number' },
    ],
    confirmNewPassword: [
      { type: 'required', message: 'Confirm New Password is required' },
      { type: 'notEqual', message: 'New Password and Confirm New Password does not match' },
      { type: 'lengthRequired', message: 'Confirm New Password must be of at least 8 characters' },
      { type: 'lowerRequired', message: 'Confirm New Password must contain at least one lower case character' },
      { type: 'upperRequired', message: 'Confirm New Password must contain at least one upper case character' },
      { type: 'specialRequired', message: 'Confirm New Password must contain at least one special character' },
      { type: 'numberRequired', message: 'Confirm New Password must contain at least one number' },
    ]
  };

  @Input() isShop = false;

  @ViewChild('formDirective') private _formDirective: NgForm;

  about: any;
  passwordForm: FormGroup;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {FormBuilder} _formBuilder
   * @param {ProfileService} _profileService
   * @param {SnackBarService} _snackBarService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _profileService: ProfileService,
    private _snackBarService: SnackBarService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
  ) {
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
    this._profileService.profile
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        this.about = _.omit(user, ['avatar', 'colorTheme', 'shop.assetGallery'])
      })

    this.passwordForm = this.createPasswordForm();
  }

  /**
   * On Destroy
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
   * Create password form
   *
   * @returns {FormGroup}
   */
  createPasswordForm(): FormGroup {
    return this._formBuilder.group(
      {
        password: ['', [Validators.required]],
        newPassword: ['', Validators.compose([Validators.required, PasswordValidator.policyValidator])],
        confirmNewPassword: ['', Validators.compose([Validators.required, PasswordValidator.policyValidator])]
      },
      {
        validators: PasswordValidator.equalValidator('newPassword', 'confirmNewPassword')
      }
    );

  }

  /**
   * Change Password
   */
  changePassword(): void {
    let data = this.passwordForm.getRawValue()
    if (data.newPassword !== data.confirmNewPassword) {
      this._snackBarService.showMessage('New Password and Confirm Password Does Not Match');
      return;
    }
    data = _.omit(data, ['confirmNewPassword'])
    this._dvProgressSpinnerService.show('Updating Password');
    this._profileService.updatePassword(data).subscribe(() => {
      this._dvProgressSpinnerService.hide();
      this._snackBarService.showMessage('Password Updated Successfully');
      this._formDirective.resetForm();
      this.passwordForm.reset();
    })
  }

}
