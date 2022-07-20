import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from '@dv/services/auth.service';

@Injectable({ providedIn: 'root' })
export class NotAuthGuard implements CanActivate {

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
      this._accountService.loggedIn.pipe(take(1)).subscribe(res => {
        if (res) {
          this._router.navigate(['/apps/dashboard/analytics'], { queryParams: { } })
          observer.next(false);
          observer.complete();
        }
        else {
          observer.next(true);
          observer.complete();
        }
      })

      this._accountService.checkUserLoggedIn();
    })
  }
}
