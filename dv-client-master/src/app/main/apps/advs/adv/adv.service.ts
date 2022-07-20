import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

import { ApiFactoryService } from '@dv/services/api-factory.service';
import { Adv } from './adv.model';
import { ApiBody } from '@dv/types';

@Injectable()
export class AdvService implements Resolve<any> {
  routeParams: any;
  onRolesChanged: BehaviorSubject<any>;
  onAdvChanged: BehaviorSubject<any>;

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
    this.onAdvChanged = new BehaviorSubject({ });
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
        this.getAdv()
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
   * Get adv Detail
   *
   * @returns {Promise<any>}
   */
  getAdv(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onAdvChanged.next(false);
        resolve(false);
      } else {
        this._apiFactoryService
          .exec({
            type: 'single',
            model: 'Adv',
            id: this.routeParams.id
          })
          .subscribe(
            (response: any) => {
              this.onAdvChanged.next(response);
              resolve(response);
            },
            reject
          );
      }
    });
  }

  /**
   * Add Save advs
   *
   * @param {FormData} adv
   * @param {string} id
   * @returns {Promise<any>}
   */
  saveAdv(adv: FormData, id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const apiObj: ApiBody = {
        type: 'form',
        formMethod: 'put',
        model: 'Adv',
        body: adv,
        id
      };

      return this._apiFactoryService.exec(apiObj)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}