export interface AssetType {
  uuid?: string,
  file: File
}

export interface PreviewImage {
  name?: string;
  url: string;
}

export interface PreAssetType extends PreviewImage {
  _id: string,
  name: string
  url: string,
}

export interface RefIdModel {
  refId: string,
  model: string
}

export interface FeaturedAsset {
  type: '_id' | 'name',
  value: string
}