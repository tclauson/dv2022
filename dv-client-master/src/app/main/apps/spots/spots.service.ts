import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiFactoryService } from '@dv/services/api-factory.service';
import { LocationService } from '@dv/services/location.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class SpotsService {
  onSpotsChanged: BehaviorSubject<any>;

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
    this.onSpotsChanged = new BehaviorSubject([]);
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
      Promise.all([this.getSpots()]).then(
        () => {
          resolve();
        },
        reject
      );
    });
  }


  /**
   * Get Spots
   *
   * @param {object} [params]
   * @returns {Promise<any>}
   */
  getSpots(params?: object): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([]);
      // this._locationService.getCurrentPosition().subscribe((resLocation) => {
      //   this._apiFactoryService.exec({ type: 'get', body: { model: 'spot' } }).subscribe(
      //     responseApi => {
      //       this.spots = responseApi || [];
      //       this.onSpotsChanged.next(this.spots);
      //       resolve(responseApi);
      //     },
      //     reject
      //   );
      // });
      this._apiFactoryService
        .exec({
          type: 'get',
          model: 'Spot',
          params
        })
        .subscribe(
          (response: any) => {
            response = response || [];
            this.onSpotsChanged.next(response);
            resolve(response);
          },
          reject
        );

    });
  }

  /**
   * Delete Spot
   *
   * @param {string} id
   * @returns {Promise<any>}
   */
  deleteSpot(id: string): Observable<any> {
    return this._apiFactoryService
      .exec({
        type: 'delete',
        model: 'Spot',
        id
      })
  }
}
