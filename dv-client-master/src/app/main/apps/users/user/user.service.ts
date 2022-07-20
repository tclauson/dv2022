import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

import { ApiFactoryService } from '@dv/services/api-factory.service';
import { User } from './user.model';
import { ApiBody } from '@dv/types';

@Injectable()
export class UserService implements Resolve<any> {
  routeParams: any;
  onRolesChanged: BehaviorSubject<any>;
  onUserChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService,
  ) {
    // Set the defaults
    this.onRolesChanged = new BehaviorSubject([]);
    this.onUserChanged = new BehaviorSubject({ });
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
        this.getRoles(),
        this.getUser()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }


  /**
   * Get roles
   *
   * @returns {Promise<any>}
   */
  getRoles(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([]);
      this._apiFactoryService
        .exec({
          type: 'get',
          model: 'roles'
        })
        .subscribe(
          (response: any) => {
            response = response || [];
            this.onRolesChanged.next(response);
            resolve(response);
          },
          reject
        );
    });
  }


  /**
   * Get user Detail
   *
   * @returns {Promise<any>}
   */
  getUser(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onUserChanged.next(false);
        resolve(false);
      } else {
        this._apiFactoryService
          .exec({
            type: 'single',
            model: 'User',
            id: this.routeParams.id
          })
          .subscribe(
            (response: any) => {
              this.onUserChanged.next(response);
              resolve(response);
            },
            reject
          );
      }
    });
  }

  /**
   * Add Save users
   *
   * @param {object} user
   * @returns {Promise<any>}
   */
  addSaveUser(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      const apiObj: ApiBody = {
        type: 'create',
        model: 'User',
        body: user
      };

      const _id = _.get(user, '_id')
      if (_id) {
        apiObj.type = 'update';
        apiObj.id = _id;
        apiObj.body = _.omit(apiObj.body, ['_id']);
      }

      return this._apiFactoryService.exec(apiObj)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}