import { PreAssetType } from '@dv/types';
import { DEFAULT_STREAM_LINK } from '../../../../../@dv/constants/constants';

export class Shop {

  personalDetails: {
    _id?: string,
    name: string,
    email: string,
    tel: string,
    dob: string,
    gender: 'male' | 'female' | 'other',
  }
  shopDetails: {
    _id?: string,
    name: string,
    website: string,
    shopTime: {
      monday: [string, string]
      tuesday: [string, string]
      wednesday: [string, string]
      thursday: [string, string]
      friday: [string, string]
      saturday: [string, string]
      sunday: [string, string]
    },
    address: {
      fullAddress: string,
      lngLat: {
        type: 'Point'
        coordinates: [number, number],
      },
      district: string,
      region: string,
      country: string,
    },
    streamId: string,
    streamLink: string,
    featuredAsset?: PreAssetType,
    assetGallery?: PreAssetType[],
  }

  /**
   * Constructor
   *
   * @param shop
   */
  constructor(shop?) {

    this.personalDetails = {
      name: shop?.personalDetails?.name || '',
      email: shop?.personalDetails?.email || '',
      tel: shop?.personalDetails?.tel || '',
      dob: shop?.personalDetails?.dob || '',
      gender: shop?.personalDetails?.gender || ''
    }
    this.shopDetails = {
      name: shop?.shopDetails?.name || '',
      website: shop?.shopDetails?.website || '',
      shopTime: {
        monday: shop?.shopDetails?.shopTime?.monday || ['00:00', '00:00'],
        tuesday: shop?.shopDetails?.shopTime?.tuesday || ['00:00', '00:00'],
        wednesday: shop?.shopDetails?.shopTime?.wednesday || ['00:00', '00:00'],
        thursday: shop?.shopDetails?.shopTime?.thursday || ['00:00', '00:00'],
        friday: shop?.shopDetails?.shopTime?.friday || ['00:00', '00:00'],
        saturday: shop?.shopDetails?.shopTime?.saturday || ['00:00', '00:00'],
        sunday: shop?.shopDetails?.shopTime?.sunday || ['00:00', '00:00'],
      },
      address: {
        fullAddress: shop?.shopDetails?.address?.fullAddress || '',
        lngLat: {
          type: 'Point',
          coordinates: shop?.shopDetails?.address?.lngLat?.coordinates || [0, 0]
        },
        district: shop?.shopDetails?.address?.district || '',
        region: shop?.shopDetails?.address?.region || '',
        country: shop?.shopDetails?.address?.country || ''
      },
      streamId: shop?.shopDetails?.streamId || '',
      streamLink: shop?.shopDetails?.streamId ? `${DEFAULT_STREAM_LINK}${shop.shopDetails.streamId}` : ''
    }

    if (shop?.shopDetails?._id) {
      this.shopDetails._id = shop.shopDetails._id;
      this.personalDetails._id = shop.personalDetails._id;
      this.shopDetails.featuredAsset = shop.shopDetails?.featuredAsset || {  };
      this.shopDetails.assetGallery = shop.shopDetails?.assetGallery || [] as PreAssetType[];
    }
  }
}
