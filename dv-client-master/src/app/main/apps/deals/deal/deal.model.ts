import { PreAssetType } from '@dv/types';

export class Deal {
  _id?: string;
  shop?: string | any;
  name: string;
  summary: string;
  included: string;
  dealTarget: string;
  price: number;
  expiry: string;
  featuredAsset?: PreAssetType;
  assetGallery?: PreAssetType[];

  /**
   * Constructor
   *
   * @param deal
   */
  constructor(deal?: Deal) {
    this.name = deal?.name || '';
    this.summary = deal?.summary || '';
    this.included = deal?.included || '';
    this.dealTarget = (deal?.dealTarget as any)?._id || deal?.dealTarget  || '';
    this.price = deal?.price || 0;
    this.expiry = deal?.expiry || '';
    this.shop = deal?.shop?._id || deal?.shop || '';

    if (deal?._id) {
      this._id = deal._id;
      this.featuredAsset = deal?.featuredAsset || { } as PreAssetType;
      this.assetGallery = deal?.assetGallery || [] as PreAssetType[];
    }
  }
}
