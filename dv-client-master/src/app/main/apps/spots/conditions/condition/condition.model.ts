import { PreAssetType } from '@dv/types';

export class Condition {
  _id?: string;
  createdBy?: any | string;
  temperature: number;
  swell: number;
  visibility: number;
  depth: number;
  altitude: number;
  skill: number;
  featuredAsset?: PreAssetType;
  assetGallery?: PreAssetType[];

  /**
   * Constructor
   *
   * @param condition
   */
  constructor(condition?) {
    this.temperature = condition?.temperature || ''
    this.swell = condition?.swell || ''
    this.visibility = condition?.visibility || ''
    this.depth = condition?.depth || ''
    this.altitude = condition?.altitude || ''
    this.skill = condition?.skill || ''
    if (condition?._id) {
      this._id = condition._id;
      this.createdBy = condition?.createdBy?._id || condition?.createdBy || '';
      this.featuredAsset = condition?.featuredAsset || { } as PreAssetType;
      this.assetGallery = condition?.assetGallery || [] as PreAssetType[];
    }
  }
}
