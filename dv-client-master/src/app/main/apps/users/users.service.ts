import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiFactoryService } from '@dv/services/api-factory.service';

@Injectable()
export class UsersService implements Resolve<any> {
  onUsersChanged: BehaviorSubject<any>;
  onRolesChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService
  ) {
    // Set the defaults
    this.onUsersChanged = new BehaviorSubject([]);
    this.onRolesChanged = new BehaviorSubject([]);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Resolver
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getRoles(),
        this.getUsers(),
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
   * Get Users
   *
   * @param {object} [params]
   * @returns {Promise<any>}
   */
  getUsers(params?: object): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([]);
      this._apiFactoryService
        .exec({
          type: 'get',
          model: 'User',
          params
        })
        .subscribe(
          (response: any) => {
            response = response || [];
            this.onUsersChanged.next(response);
            resolve(response);
          },
          reject
        );
    });
  }

  /**
   * Delete User
   *
   * @param {string} id
   * @returns {Promise<any>}
   */
  deleteUser(id: string): Observable<any> {
    return this._apiFactoryService
      .exec({
        type: 'delete',
        model: 'User',
        id
      })
  }
}
