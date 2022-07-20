import { Injectable } from '@angular/core';

import { ApiFactoryService } from '@dv/services/api-factory.service';
import { ApiBody } from '@dv/types';

@Injectable()
export class ForgotPasswordService {

  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService,
  ) {
  }

  /**
   * Send recovery link
   *
   * @param {object} email
   * @returns {Promise<any>}
   */
  recoveryLink(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const apiObj: ApiBody = {
        type: 'post',
        model: 'recovery-link',
        noApi: true,
        body: { email }
      };

      return this._apiFactoryService.exec(apiObj)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}