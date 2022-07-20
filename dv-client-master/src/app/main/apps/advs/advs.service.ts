import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiFactoryService } from '@dv/services/api-factory.service';

@Injectable()
export class AdvsService implements Resolve<any> {
  onAdvsChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService
  ) {
    // Set the defaults
    this.onAdvsChanged = new BehaviorSubject([]);
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
        this.getAdvs(),
      ]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }


  /**
   * Get Advs
   *
   * @param {object} [params]
   * @returns {Promise<any>}
   */
  getAdvs(params?: object): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([]);
      this._apiFactoryService
        .exec({
          type: 'get',
          model: 'Adv',
          params
        })
        .subscribe(
          (response: any) => {
            response = response || [];
            this.onAdvsChanged.next(response);
            resolve(response);
          },
          reject
        );
    });
  }
}
