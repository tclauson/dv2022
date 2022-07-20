import { Injectable } from '@angular/core';

import { ApiFactoryService } from '@dv/services/api-factory.service';
import { Promotion } from './promotion.model';
import { ApiBody } from '@dv/types';

@Injectable()
export class PromotionService {
  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService,
  ) { }

  /**
   * Save promotion
   *
   * @param {object} promotion
   * @returns {Promise<any>}
   */
  sendPromotion(promotion: Promotion): Promise<any> {
    return new Promise((resolve, reject) => {
      const apiObj: ApiBody = {
        type: 'post',
        model: 'promotion',
        body: promotion
      };

      return this._apiFactoryService.exec(apiObj)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
}