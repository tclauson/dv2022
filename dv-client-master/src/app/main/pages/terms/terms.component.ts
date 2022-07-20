import { Component, ViewEncapsulation } from '@angular/core';

import { DvConfigService } from '@dv/services/config.service';
import { dvAnimations } from '@dv/animations';

@Component({
  selector: 'terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class TermsComponent {
  /**
   * Constructor
   *
   * @param {DvConfigService} _dvConfigService
   */
  constructor(
    private _dvConfigService: DvConfigService
  ) {
    // Configure the layout
    this._dvConfigService.config = {
      layout: {
        navbar: {
          hidden: true
        },
        toolbar: {
          hidden: true
        },
        footer: {
          hidden: true
        },
        sidepanel: {
          hidden: true
        }
      }
    };
  }
}
