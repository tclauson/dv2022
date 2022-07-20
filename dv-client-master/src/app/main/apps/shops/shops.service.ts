import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiFactoryService } from '@dv/services/api-factory.service';

@Injectable()
export class ShopsService implements Resolve<any> {
  onShopsChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService
  ) {
    // Set the defaults
    this.onShopsChanged = new BehaviorSubject([]);
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
      Promise.all([this.getShops()]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }

  /**
   * Get Shops
   *
   * @param {object} [params]
   * @returns {Promise<any>}
   */
  getShops(params?: object): Promise<any> {
    return new Promise((resolve, reject) => {
      this._apiFactoryService
        .exec({
          type: 'get',
          model: 'Shop',
          params
        })
        .subscribe(
          (response: any) => {
            response = response || [];
            this.onShopsChanged.next(response);
            resolve(response);
          },
          reject
        );
    });
  }

  /**
   * Delete Shop
   *
   * @param {string} id
   * @returns {Promise<any>}
   */
  deleteShop(id: string): Observable<any> {
    return this._apiFactoryService
      .exec({
        type: 'delete',
        model: 'Shop',
        id
      })
  }
}
