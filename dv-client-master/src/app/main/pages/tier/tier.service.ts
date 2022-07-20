import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { ApiFactoryService } from '@dv/services/api-factory.service';
import { Tier } from './tier.model';
import { ApiBody } from '@dv/types';

@Injectable()
export class TierService implements Resolve<any> {
  routeParams: any;
  onTierChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService,
  ) {
    // Set the defaults
    this.onTierChanged = new BehaviorSubject([]);
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
        this.getTier()
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }


  /**
   * Get tier
   *
   * @returns {Promise<any>}
   */
  getTier(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([]);
      this._apiFactoryService
        .exec({
          type: 'get',
          model: 'tier',
          noApi: true,
        })
        .subscribe(
          (response: any) => {
            response = response || [];
            this.onTierChanged.next(response);
            resolve(response);
          },
          reject
        );
    });
  }


  /**
   * Save tier
   *
   * @param {object} tier
   * @returns {Promise<any>}
   */
  saveTier(tier: Tier[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const apiObj: ApiBody = {
        type: 'post',
        model: 'tier/update',
        body: tier
      };

      return this._apiFactoryService.exec(apiObj)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}