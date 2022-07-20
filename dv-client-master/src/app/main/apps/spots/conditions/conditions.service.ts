import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiFactoryService } from '@dv/services/api-factory.service';
import { LocationService } from '@dv/services/location.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class ConditionsService {
  routeParams: any;
  conditionModel: string;
  onConditionsChanged: BehaviorSubject<any>;

  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   * @param {LocationService} _locationService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService,
    private _locationService: LocationService
  ) {
    // Set the defaults
    this.onConditionsChanged = new BehaviorSubject([]);
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
    this.conditionModel = `Spot/${this.routeParams.spotId}/Condition`

    return new Promise((resolve, reject) => {

      Promise.all([this.getConditions()]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }


  /**
   * Get Conditions
   *
   * @param {object} [params]
   * @returns {Promise<any>}
   */
  getConditions(params?: object): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([]);
      this._apiFactoryService
        .exec({
          type: 'get',
          model: this.conditionModel,
          params
        })
        .subscribe(
          (response: any) => {
            response = response || [];
            this.onConditionsChanged.next(response);
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
  deleteCondition(id: string): Observable<any> {
    return this._apiFactoryService
      .exec({
        type: 'delete',
        model: 'Condition',
        id
      })
  }

}
