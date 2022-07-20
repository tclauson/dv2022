import { Component, ViewEncapsulation } from '@angular/core';
import { AuthService } from '@dv/services/auth.service';
import { DvConfigService } from '@dv/services/config.service';

@Component({
  selector: 'error-500',
  templateUrl: './error-500.component.html',
  styleUrls: ['./error-500.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Error500Component {
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
