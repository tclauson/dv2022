import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import * as _ from 'lodash';

import { ApiFactoryService } from '@dv/services/api-factory.service';
import { Shop } from './shop.model';
import { ApiBody } from '@dv/types';

@Injectable()
export class ShopService implements Resolve<any> {
  routeParams: any;
  onShopChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService,
  ) {
    // Set the defaults
    this.onShopChanged = new BehaviorSubject({ });
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
        this.getShop()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  /**
   * Get shop detail
   *
   * @returns {Promise<any>}
   */
  getShop(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.routeParams.id === 'new') {
        this.onShopChanged.next(false);
        resolve(false);
      } else {
        this._apiFactoryService
          .exec({
            type: 'single',
            model: 'Shop',
            id: this.routeParams.id
          })
          .subscribe(
            (response: any) => {
              this.onShopChanged.next(response);
              resolve(response);
            },
            reject
          );
      }
    });
  }

  /**
   * Add Save shops
   *
   * @param {object} shop
   * @returns {Promise<any>}
   */
  addSaveShop(shop: Shop): Promise<any> {
    return new Promise((resolve, reject) => {
      const apiObj: ApiBody = {
        type: 'create',
        model: 'Shop',
        body: shop
      };

      const _id = _.get(shop, 'shopDetails._id')
      if (_id) {
        apiObj.type = 'update';
        apiObj.id = _id;
        apiObj.body = _.omit(apiObj.body, ['shopDetails._id']);
      }

      return this._apiFactoryService.exec(apiObj)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}