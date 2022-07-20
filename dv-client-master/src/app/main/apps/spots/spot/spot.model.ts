import { PreAssetType } from '@dv/types';

export class Spot {
  _id?: string;
  name: string;
  address: {
    fullAddress: string,
    lngLat: {
      type: 'Point'
      coordinates: [number, number],
    },
    district: string,
    region: string,
    country: string,
  };
  featuredAsset?: PreAssetType;
  assetGallery?: PreAssetType[];

  /**
   * Constructor
   *
   * @param spot
   */
  constructor(spot?) {
    this.name = spot?.name || ''
    this.address = {
      fullAddress: spot?.address?.fullAddress || '',
        lngLat: {
        type: 'Point',
        coordinates: spot?.address?.lngLat?.coordinates || [0, 0]
      },
      district: spot?.address?.district || '',
        region: spot?.address?.region || '',
        country: spot?.address?.country || ''
    };
    if (spot?._id) {
      this._id = spot._id;
      this.featuredAsset = spot?.featuredAsset || { } as PreAssetType;
      this.assetGallery = spot?.assetGallery || [] as PreAssetType[];
    }
  }

}
