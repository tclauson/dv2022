import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

import { ApiFactoryService } from '@dv/services/api-factory.service';
import { Condition } from './condition.model';
import { ApiBody } from '@dv/types';

@Injectable()
export class ConditionService implements Resolve<any> {
  routeParams: any;
  conditionModel: string;
  onConditionChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService,
  ) {
    // Set the defaults
    this.onConditionChanged = new BehaviorSubject({});
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
    this.routeParams = route.params;
    this.conditionModel = `Spot/${this.routeParams.spotId}/Condition`;

    return new Promise((resolve, reject) => {

      Promise.all([
        this.getCondition()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  /**
   * Get condition Detail
   *
   * @returns {Promise<any>}
   */
  getCondition(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onConditionChanged.next(false);
        resolve(false);
      } else {
        this._apiFactoryService
          .exec({
            type: 'single',
            model: this.conditionModel,
            id: this.routeParams.id
          })
          .subscribe(
            (response: any) => {
              this.onConditionChanged.next(response);
              resolve(response);
            },
            reject
          );
      }
    });
  }

  /**
   * Add Save conditions
   *
   * @param {object} condition
   * @returns {Promise<any>}
   */
  addSaveCondition(condition: Condition): Promise<any> {
    return new Promise((resolve, reject) => {
      const apiObj: ApiBody = {
        type: 'create',
        model: this.conditionModel,
        body: condition
      };

      const _id = _.get(condition, '_id')
      if (_id) {
        apiObj.type = 'update';
        apiObj.id = _id;
        apiObj.body = _.omit(apiObj.body, ['_id']);
      }

      this._apiFactoryService
        .exec(apiObj)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}