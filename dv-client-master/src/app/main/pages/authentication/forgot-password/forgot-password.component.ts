import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';

import { DvConfigService } from '@dv/services/config.service';
import { dvAnimations } from '@dv/animations';

import { SnackBarService } from '@dv/services/snack-bar.service';
import { ForgotPasswordService } from './forgot-password.service';

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class ForgotPasswordComponent implements OnInit {
  @ViewChild('formDirective') private _formDirective: NgForm;

  forgotPasswordForm: FormGroup;
  isLoading: boolean;

  /**
   * Constructor
   *
   * @param {DvConfigService} _dvConfigService
   * @param {FormBuilder} _formBuilder
   * @param {SnackBarService} _snackBarService
   * @param {ForgotPasswordService} _forgotPasswordService
   */
  constructor(
    private _formBuilder: FormBuilder,
    private _dvConfigService: DvConfigService,
    private _snackBarService: SnackBarService,
    private _forgotPasswordService: ForgotPasswordService,
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
    this.forgotPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Send recovery link
   */
  recoveryLink(): void {
    const data = this.forgotPasswordForm.getRawValue()
    this.isLoading = true;
    this._forgotPasswordService.recoveryLink(data.email)
      .then(() => {
        this.isLoading = false;
        this._formDirective.resetForm();
        this.forgotPasswordForm.reset();
        this._snackBarService.showMessage('Password recovery link sent to the associated email');
      })
      .catch(() => {
        this.isLoading = false;
      })
  }
}
