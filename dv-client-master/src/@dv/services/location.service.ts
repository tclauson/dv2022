import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LocationService {

  coordinates: [number, number];

  /**
   * Get Current Position
   *
   * @returns {Observable<any>}
   */
  getCurrentPosition(): Observable<any> {

    return new Observable((observer: Observer<any>) => {

      if (this.coordinates) {
        observer.next(this.coordinates);
        observer.complete();
      } else
        navigator.geolocation.getCurrentPosition(
          resp => {
            this.coordinates = [resp.coords.longitude, resp.coords.latitude];
            observer.next(this.coordinates);
            observer.complete();
          },
          observer.error
        );

    });

  }

}
