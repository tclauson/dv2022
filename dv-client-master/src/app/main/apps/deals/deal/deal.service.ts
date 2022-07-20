import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

import { ApiFactoryService } from '@dv/services/api-factory.service';
import { Deal } from './deal.model';
import { ApiBody } from '@dv/types';

@Injectable()
export class DealService implements Resolve<any> {
  routeParams: any;
  onDealChanged: BehaviorSubject<any>;
  onDealTargetChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService,
  ) {
    // Set the defaults
    this.onDealChanged = new BehaviorSubject({ });
    this.onDealTargetChanged = new BehaviorSubject({ })
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
        this.getDealTargets(),
        this.getDeal()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  /**
   * Get deal target list
   *
   * @returns {Promise<any>}
   */
  getDealTargets(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._apiFactoryService
        .exec({
          type: 'get',
          model: 'Dealtarget'
        })
        .subscribe(
          (response: any) => {
            this.onDealTargetChanged.next(response);
            resolve(response);
          },
          reject
        );
    });
  }

  /**
   * Get deal Detail
   *
   * @returns {Promise<any>}
   */
  getDeal(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onDealChanged.next(false);
        resolve(false);
      } else {
        this._apiFactoryService
          .exec({
            type: 'single',
            model: 'Deal',
            id: this.routeParams.id

          })
          .subscribe(
            (response: any) => {
              this.onDealChanged.next(response);
              resolve(response);
            },
            reject
          );
      }
    });
  }

  /**
   * Add Save deals
   *
   * @param {object} deal
   * @returns {Promise<any>}
   */
  addSaveDeal(deal: Deal): Promise<any> {
    return new Promise((resolve, reject) => {
      const apiObj: ApiBody = {
        type: 'create',
        model: 'Deal',
        body: deal
      };

      const _id = _.get(deal, '_id')
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