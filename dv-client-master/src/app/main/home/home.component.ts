import { Component, ViewEncapsulation } from '@angular/core';
import { DvConfigService } from '@dv/services/config.service';
import { AuthService } from '@dv/services/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class HomeComponent {
  isLoggedIn: boolean;
  readonly googlePlayLink = 'https://play.google.com/store/apps/details?id=com.divervisibility'
  readonly appStoreLink = 'https://apps.apple.com/app/divers-visibility/id1538346002';

  /**
   * Constructor
   *
   * @param {DvConfigService} _dvConfigService
   * @param {AuthService} _accountService
   */
  constructor(
    private _dvConfigService: DvConfigService,
    public _accountService: AuthService
  ) {
    // Set the defaults
    this.isLoggedIn = this._accountService.isLoggedIn();

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
    }
  }
}
