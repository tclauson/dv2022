import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

import { DvUtils } from '@dv/utils'

import { ApiFactoryService } from '../../services/api-factory.service';
import { ApiBody, AssetType, FeaturedAsset, RefIdModel } from '../../types';

@Injectable({
  providedIn: 'root'
})
export class AssetUploaderService {
  /**
   * Constructor
   *
   * @param {ApiFactoryService} _apiFactoryService
   */
  constructor(
    private _apiFactoryService: ApiFactoryService
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  // /**
  //  *
  //  * @param {string} url
  //  * @returns {SafeResourceUrl}
  //  */
  // createSafeUrl(url: string): SafeResourceUrl {
  //   try {
  //     return this._domSanitizer.bypassSecurityTrustResourceUrl(url);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  /**
   *
   * @param {RefIdModel} data
   * @param {Set<File>} assets
   * @param {File | string} [featured]
   * @param {string[]} [removeIds]
   * @param {string} apiModel
   * @returns {Observable<[number]>}
   */
  uploadAssets(
    data: RefIdModel,
    assets: AssetType[],
    featured?: FeaturedAsset | null,
    removeIds?: Set<string>,
    apiModel?: string
  ): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('model', data.model);
    formData.append('refId', data.refId);

    assets.forEach(asset => {
      if (!asset.uuid) {
        asset.uuid = DvUtils.generateAssetName(asset.file.name)
      }
      formData.append('assets', asset.file, asset.uuid);
    });

    if (!_.isEmpty(featured)) {
      formData.append('featured', JSON.stringify(featured))
    }
    if (removeIds?.size > 0) {
      formData.append('removeIds', JSON.stringify(Array.from(removeIds)))
    }

    const apiObj: ApiBody = {
      type: 'form',
      model: apiModel || 'asset-upload',
      body: formData
    }

    return this._apiFactoryService.exec(apiObj)

  }

}
