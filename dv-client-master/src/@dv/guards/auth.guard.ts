import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '@dv/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {AuthService} _accountService
   */
  constructor(
    private _router: Router,
    private _accountService: AuthService
  ) {
  }

  /**
   * Can Activate Route
   *
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {boolean | Observable<boolean>}
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    return new Observable((observer) => {
      this._accountService.loggedIn
        .pipe(take(1))
        .subscribe(res => {
          if (res) {
            observer.next(true);
            observer.complete();
          } else {
            this._router.navigate(['/pages/errors/error-403'], { queryParams: {} })
            observer.next(false);
            observer.complete();
          }
        })

      this._accountService.checkUserLoggedIn();
    })
  }
}
