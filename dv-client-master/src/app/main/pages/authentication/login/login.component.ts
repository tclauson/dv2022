import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { dvAnimations } from '@dv/animations';

import { DvConfigService } from '@dv/services/config.service';
import { AuthService } from '@dv/services/auth.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class LoginComponent implements OnInit {
  readonly validationErrors: any = {
    email: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Enter a valid email address' }
    ],
    password: [
      { type: 'required', message: 'Password is required' },
    ],
  };

  loginForm: FormGroup;
  isLoading: boolean;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {FormBuilder} _formBuilder
   * @param {DvConfigService} _dvConfigService
   * @param {AuthService} _accountService
   */
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _dvConfigService: DvConfigService,
    private _accountService: AuthService,
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
    this.loginForm = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this._accountService.loggedIn
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        if (res) {
          this._unsubscribeAll.next();
          this._unsubscribeAll.complete();
          this._router.navigate(['/apps/dashboard/analytics']);
        }
        this.isLoading = false;
      });
  }

  login(): void {
    this.isLoading = true;
    this._accountService.login(this.loginForm.value);
  }
}
