import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { dvAnimations } from '@dv/animations';

import { SnackBarService } from '@dv/services/snack-bar.service';
import { UserService } from './user.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { AbilityService } from '@dv/services/ability.service';

import { User } from './user.model';
import { TelValidator } from '@dv/validators/phone-number.validator';
import { RefIdModel } from '@dv/types';

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class UserComponent implements OnInit, OnDestroy {
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
      { type: 'invalidNumber', message: 'Phone number is not valid' },
    ],
    role: [
      { type: 'required', message: 'Type is required' },
    ]
  };

  user: User;
  pageType: string;
  userForm: FormGroup;
  readyForUpload: boolean;
  refIdModel: RefIdModel
  canExec: boolean;
  userRoles: any[];

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
   * @param {UserService} _userService
   */
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _snackBarService: SnackBarService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _abilityService: AbilityService,
    private _userService: UserService,
  ) {
    // Set the default
    this.user = new User();
    this.readyForUpload = false;
    this.refIdModel = { model: 'User', refId: '' }
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
    this._userService.onRolesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(userRoles => {
        this.userRoles = userRoles;
      });

    // Subscribe to update users on changes
    this._userService.onUserChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(user => {
        if (user) {
          this.user = new User(user);
          this.pageType = 'edit';
        } else {
          this.pageType = 'new';
          this.user = new User();
        }

        this.userForm = this.createUserForm();

        const action = this.pageType === 'edit' ? 'update' : 'create';
        this.canExec = this._abilityService.canExec(action, 'User')

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
   * Create users form
   *
   * @returns {FormGroup}
   */
  createUserForm(): FormGroup {
    return this._formBuilder.group({
      name: [this.user.name, [Validators.required]],
      email: [this.user.email, [Validators.required, Validators.email]],
      tel: [this.user.tel, Validators.compose([TelValidator.telValidator])],
      dob: [this.user.dob, [Validators.required]],
      gender: [this.user.gender, [Validators.required]],
      role: [this.user.role, [Validators.required]]
    });
  }

  /**
   * Add/Update user
   */
  addSaveUser(): void {
    this._dvProgressSpinnerService.show('Saving User')
    const data = this.userForm.getRawValue();

    if (this.pageType === 'edit') {
      data._id = this.user._id;
    }
    this._userService.addSaveUser(data)
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
    // Redirect to users and show message
    this._router.navigate(['/apps/users']).then(() => {
      this._snackBarService.showMessage('User saved')
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
