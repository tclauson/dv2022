import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

import { ApiFactoryService } from '@dv/services/api-factory.service';
import { Spot } from './spot.model';
import { ApiBody } from '@dv/types';

@Injectable()
export class SpotService implements Resolve<any> {
  routeParams: any;
  onSpotChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService,
  ) {
    // Set the defaults
    this.onSpotChanged = new BehaviorSubject({ });
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

    return new Promise((resolve, reject) => {

      Promise.all([
        this.getSpot()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  /**
   * Get spot Detail
   *
   * @returns {Promise<any>}
   */
  getSpot(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onSpotChanged.next(false);
        resolve(false);
      } else {
        this._apiFactoryService
          .exec({
            type: 'single',
            model: 'Spot',
            id: this.routeParams.id
          })
          .subscribe(
            (response: any) => {
              this.onSpotChanged.next(response);
              resolve(response);
            },
            reject
          );
      }
    });
  }

  /**
   * Add Save spots
   *
   * @param {object} spot
   * @returns {Promise<any>}
   */
  addSaveSpot(spot: Spot): Promise<any> {
    return new Promise((resolve, reject) => {
      const apiObj: ApiBody = {
        type: 'create',
        model: 'Spot',
        body: spot
      };

      const _id = _.get(spot, '_id')
      if (_id) {
        apiObj.type = 'update';
        apiObj.id = _id;
        apiObj.body = _.omit(apiObj.body, ['_id']);
      }

      return this._apiFactoryService
        .exec(apiObj)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}