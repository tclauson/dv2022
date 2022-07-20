import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { ApiFactoryService } from '@dv/services/api-factory.service';
import { ApiBody } from '@dv/types';

@Injectable()
export class ResetPasswordService implements Resolve<any> {
  routeParams: any;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _router: Router,
    private _apiFactoryService: ApiFactoryService,
  ) {
  }

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    this.routeParams = route.params;

    return new Promise((resolve, reject) => {

      Promise.all([
        this.checkToken()
      ]).then(
        () => {
          resolve();
        },
        err => {
          this._router.navigate(['/pages/errors/invalid-token']);
          reject(err);
        }
      );
    });
  }

  /**
   * Get token detail
   *
   * @returns {Promise<any>}
   */
  checkToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._apiFactoryService
        .exec({
          type: 'post',
          model: 'verify-token',
          noApi: true,
          body: {
            email: this.routeParams.email,
            token: this.routeParams.token
          }
        })
        .subscribe(
          () => {
            resolve();
          },
          reject
        );
    });
  }

  /**
   * Save password
   *
   * @param {object} password
   * @returns {Promise<any>}
   */
  resetPassword(password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const apiObj: ApiBody = {
        type: 'post',
        model: 'reset-password',
        noApi: true,
        body: {
          email: this.routeParams.email,
          token: this.routeParams.token,
          password
        }
      };

      return this._apiFactoryService.exec(apiObj)
        .subscribe(() => {
          resolve();
        }, reject);
    });
  }
}