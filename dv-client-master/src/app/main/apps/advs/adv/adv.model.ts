import { AssetType, PreAssetType } from '@dv/types';

export class Adv {

  _id: string;
  name: string;
  url: string;
  featuredAsset?: PreAssetType | AssetType;

  /**
   * Constructor
   *
   * @param adv
   */
  constructor(adv?) {
    this._id = adv?._id || '';
    this.name = adv?.name || '';
    this.url = adv?.url || '';
    this.featuredAsset = adv?.featuredAsset || {};
  }
}
