import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiFactoryService } from '@dv/services/api-factory.service';

@Injectable()
export class DealsService {
  onDealsChanged: BehaviorSubject<any>;
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
    this.onDealTargetChanged = new BehaviorSubject<any>([]);
    this.onDealsChanged = new BehaviorSubject([]);
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
        this.getDealTargets(),
        this.getDeals()
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
      resolve([]);
      this._apiFactoryService
        .exec({
          type: 'get',
          model: 'Dealtarget'
        })
        .subscribe(
          (response: any) => {
            response = response || [];
            this.onDealTargetChanged.next(response);
            resolve(response);
          },
          reject
        );
    });
  }

  /**
   * Get Deals
   *
   * @param {object} [params]
   * @returns {Promise<any>}
   */
  getDeals(params?: object): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([]);
      this._apiFactoryService
        .exec({
          type: 'get',
          model: 'Deal',
          params
        })
        .subscribe(
          (response: any) => {
            response = response || []
            this.onDealsChanged.next(response);
            resolve(response);
          },
          reject
        );
    });
  }

  /**
   * Delete Condition
   *
   * @param {string} id
   * @returns {Promise<any>}
   */
  deleteDeal(id: string): Observable<any> {
    return this._apiFactoryService
      .exec({
        type: 'delete',
        model: 'Deal',
        id
      })
  }

}
