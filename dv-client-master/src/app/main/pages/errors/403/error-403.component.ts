import { Component, ViewEncapsulation } from '@angular/core';
import { DvConfigService } from '@dv/services/config.service';
import { AuthService } from '@dv/services/auth.service';

@Component({
  selector: 'error-403',
  templateUrl: './error-403.component.html',
  styleUrls: ['./error-403.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Error403Component {
  routerLink: string;
  /**
   * Constructor
   *
   * @param {AuthService} _accountService
   * @param {DvConfigService} _dvConfigService
   */
  constructor(
    private _accountService: AuthService,
    private _dvConfigService: DvConfigService
  ) {
    if (!this._accountService.isLoggedIn()) {
      this.routerLink = '/';
      // Configure the layout
      this._dvConfigService.config = {
        layout: {
          navbar: {
            hidden: true
          },
          toolbar: {
            hidden: true
          },
          sidepanel: {
            hidden: true
          }
        }
      };
    } else {
      this.routerLink = '/apps/dashboard/analytics'
    }
  }
}
