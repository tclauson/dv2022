import { Injectable, NgZone } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { BootControl } from '../../boot-control';

import { JWT_TOKEN_KEY } from '../constants/constants';

import { ApiFactoryService } from './api-factory.service';
import { ProfileService } from '../../app/main/pages/profile/profile.service';
import { ErrorHandlerService } from './error-handler.service';
import { DvProgressSpinnerService } from '../components/progress-spinner/progress-spinner.service';


@Injectable({ providedIn: 'root' })
export class AuthService {
  // Private
  private _$loggedIn: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {NgZone} _ngZone
   * @param {ErrorHandlerService} _errorHandlerService
   * @param {ApiFactoryService} _apiFactoryService
   * @param {ProfileService} _profileService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   */
  constructor(
    private _router: Router,
    private _ngZone: NgZone,
    private _errorHandlerService: ErrorHandlerService,
    private _apiFactoryService: ApiFactoryService,
    private _profileService: ProfileService,
    private _dvProgressSpinnerService: DvProgressSpinnerService
  ) {
    this._$loggedIn = new Subject<any>();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get loggedIn(): any {
    return this._$loggedIn.asObservable();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Is Logged In
   *
   * @returns {boolean}
   */
  isLoggedIn(): boolean {
    const user = this._profileService.profile.getValue();
    return !_.isEmpty(user) || !!this.readSaveJWT('get');
  }

  /**
   * Get Current User Logged In
   */
  checkUserLoggedIn(): void {
    const user = this._profileService.profile.getValue();
    if (!_.isEmpty(user)) {
      this._$loggedIn.next(true);
    } else if (this.readSaveJWT('get')) {
      this._apiFactoryService
        .exec({
          type: 'get',
          model: 'self'
        })
        .subscribe(
          res => {
            this._profileService.profile = res;
            this._$loggedIn.next(true);
          },
          () => {
            this.readSaveJWT('delete');
            this._$loggedIn.next(false)
          }
        );
    } else {
      this._$loggedIn.next(false);
    }
  }


  /**
   * Login User
   *
   * @param credentials
   */
  login(credentials: object): void {
    this._apiFactoryService
      .exec(
        {
          type: 'post',
          noApi: true,
          model: 'login',
          body: credentials,
        })
      .subscribe(
        res => {
          this._profileService.profile = res;
          this.readSaveJWT('create', res.token);
          this._$loggedIn.next(true);
        },
        () => {
          this.readSaveJWT('delete');
          this._$loggedIn.next(false);
        }
      );
  }

  /**
   * Logout User
   */
  logout(): void {
    this._apiFactoryService
      .exec({
        type: 'post',
        model: 'logout',
      }).subscribe(
      () => {
        this.readSaveJWT('delete');

        this._router.navigate(['/']).then(() => {
          // Destroyed after to avoid profile subscription errors
          this._profileService.profile = { };
          this._dvProgressSpinnerService.hide();
          this._ngZone.runOutsideAngular(() => {
            // Run outside Zone to avoid infinite loop
            BootControl.getbootControl().reboot = true;
          });
        });
      });
  }

  /**
   * Get, Save, Delete JWT Token
   *
   * @param {string} type
   * @param {string} [key]
   * @returns {string}
   */
  readSaveJWT(type: string, key?: string): void | string {
    switch (type) {
      case 'create' :
        localStorage.setItem(JWT_TOKEN_KEY, key);
        return;
      case 'get' :
        return localStorage.getItem(JWT_TOKEN_KEY);
      case 'delete' :
        localStorage.removeItem(JWT_TOKEN_KEY);
        return;
    }
  }

}
