import { Component, ViewEncapsulation } from '@angular/core';

import { DvConfigService } from '@dv/services/config.service';
import { dvAnimations } from '@dv/animations';

@Component({
  selector: 'policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class PolicyComponent {
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
