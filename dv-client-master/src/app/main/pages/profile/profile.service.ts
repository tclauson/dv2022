import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

import { dvConfig } from '../../../dv-config';

import { ApiFactoryService } from '@dv/services/api-factory.service';
import { ErrorHandlerService } from '@dv/services/error-handler.service';
import { DvConfigService } from '@dv/services/config.service';
import { AbilityService } from '@dv/services/ability.service';
import { AssetUploaderService } from '@dv/components/asset-uploader/asset-uploader.service';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  readonly keysException = ['_id', '__v', 'password', 'role', 'token', 'deviceId', 'status'];

  // Private
  private readonly _profile: BehaviorSubject<object>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {AbilityService} _abilityService
   * @param {ApiFactoryService} _apiFactoryService
   * @param {DvConfigService} _dvConfigService
   * @param _errorHandlerService {ErrorHandlerService}
   * @param {AssetUploaderService} _assetUploaderService
   */
  constructor(
    private _router: Router,
    private _abilityService: AbilityService,
    private _apiFactoryService: ApiFactoryService,
    private _dvConfigService: DvConfigService,
    private _errorHandlerService: ErrorHandlerService,
    private _assetUploaderService: AssetUploaderService
  ) {
    // Set Private Defaults
    this._profile = new BehaviorSubject<object>({});
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  get profile(): any {
    return this._profile;
  }

  set profile(user: any) {
    this._profile.next(user);
    let colorTheme = dvConfig.colorTheme;
    if (user.colorTheme === 'dark') {
      colorTheme += '-dark'
    }
    this._dvConfigService.config = { colorTheme: colorTheme }
    this._updateAbility(user);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update Ability
   *
   * @param user
   * @private
   */
  private _updateAbility(user): void {
    const rules = [];
    if (!_.isEmpty(user)) {
      user.role.permissions.forEach(p => {
        rules.push(_.pick(p, ['action', 'subject', 'conditions']));
      })
    }
    this._abilityService.createAbility(rules);
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Update User Info
   */
  updateInfo(updatedInfo): Observable<any> {
    const body: any = { };
    const user = this.profile.getValue();
    for (const key in updatedInfo) {
      if (updatedInfo.hasOwnProperty(key) && !this.keysException.includes(key)) {
        if (!user[key]) {
          this._errorHandlerService.showError(`Invalid profile property ${key}`);
          break;
        }
        body[key] = updatedInfo[key];
      }
    }

    return this._apiFactoryService
      .exec({
        type: 'post',
        model: 'self/update',
        body
      })
      .pipe(
        map(res => {
          this.profile = res;
          return user;
        })
      );
  }

  /**
   * Update Password
   * @param body
   * @returns {Observable<any>}
   */
  updatePassword(body: { password: string, newPassword: string }): Observable<any> {
    if (!body.password && !body.newPassword) {
      this._errorHandlerService.showError('Missing Password or New Password');
    }

    return this._apiFactoryService
      .exec({
        type: 'post',
        model: 'self/update-password',
        body
      });
  }

  /**
   * Update Avatar
   * @param {File} avatar
   * @returns {Observable<any>}
   */
  updateAvatar(avatar: File): Observable<any> {

    return this._assetUploaderService
      .uploadAssets(
        {
          model: 'User',
          refId: this.profile.getValue()._id
        },
        [{ file: avatar }],
        null,
        null,
        'self/update-avatar'
      )
      .pipe(
        map(res => {
          const user = this.profile.getValue()
          user.avatar = res;
          this.profile = user;
          return true;
        })
      )
  }

}
