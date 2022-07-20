import { Component, ViewEncapsulation } from '@angular/core';
import { DvConfigService } from '@dv/services/config.service';
import { AuthService } from '@dv/services/auth.service';

@Component({
  selector: 'invalid-token',
  templateUrl: './invalid-token.component.html',
  styleUrls: ['./invalid-token.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InvalidTokenComponent {
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
    this.routerLink = '';
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
  }
}
