export interface Address {
  fullAddress: string;
  country: string;
  region?: string;
  district?: string;
}

export interface AddressType extends Address {
  lngLat: {
    type: 'Point';
    coordinates: number[];
  };
}

export interface AddressTypeLatLng extends Address {
  latLng: {
    type: 'Point';
    coordinates: number[];
  };
}