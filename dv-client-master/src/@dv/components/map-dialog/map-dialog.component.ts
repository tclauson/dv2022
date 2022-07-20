import {
  AfterViewInit, ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GoogleMap, MapMarker } from '@angular/google-maps';
import * as _ from 'lodash';

import { AddressTypeLatLng } from '@dv/types/map-object';
import { DEFAULT_COORDS } from '../../constants/constants';


@Component({
  selector: 'map-dialog',
  templateUrl: './map-dialog.component.html',
  styleUrls: ['./map-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MapDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap;
  @ViewChild(MapMarker, { static: false }) markerEl: MapMarker;
  @ViewChild('hintDialog', { static: false }) hintDialogEl: ElementRef;
  @ViewChild('autocompleteInput', { static: false }) autoCompleteInputEl: ElementRef;

  zoom: number;
  address: AddressTypeLatLng;
  options: google.maps.MapOptions;
  center: google.maps.LatLngLiteral | google.maps.LatLng;
  markerPosition: google.maps.LatLngLiteral | google.maps.LatLng;
  markerOptions: google.maps.MarkerOptions
  latLngChanged: any;
  geocoder: google.maps.Geocoder;

  /**
   * Constructor
   *
   * @param {ChangeDetectorRef}  _cdr
   * @param {MatDialogRef<MapDialogComponent>} matDialogRef
   * @param data
   */
  constructor(
    private _cdr: ChangeDetectorRef,
    public matDialogRef: MatDialogRef<MapDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {

    // Set the defaults
    this.zoom = 12;
    this.address = !_.isEmpty(this.data) ? this.data : {
      latLng: {
        type: 'Point',
        coordinates: DEFAULT_COORDS
      },
      fullAddress: '',
      country: ''
    }
    this.address.fullAddress = this.data?.fullAddress || '';
    this.options = {
      zoomControl: false,
      disableDoubleClickZoom: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      rotateControl: false,
      scaleControl: false,
      maxZoom: 15,
      minZoom: 8,
    }
    this.markerOptions = {
      draggable: true,
    }
    this.geocoder = new google.maps.Geocoder()
    this.latLngChanged = _.debounce(this._latLngChanged, 1500);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Init
   */
  ngOnInit(): void {
    if (!this.address.fullAddress) {
      this.getDataGeo();
    }
  }

  /**
   * After View Init
   */
  ngAfterViewInit(): void {
    this.updateMarker();
    this.autocompleteInput();
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this.address = { } as AddressTypeLatLng
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // ----------------------------------------------------------------------------------------------------

  set latLng(coordinates: [number, number]) {
    this.address.latLng.coordinates = coordinates;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // ----------------------------------------------------------------------------------------------------

  /**
   * Lat,Lng Changed
   *
   * @param latLng
   * @private
   */
  private _latLngChanged(latLng: string): void {
    this.address.latLng.coordinates = latLng.split(/,/).map(parseFloat) as [number, number];
    this.getDataGeo();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Auto Complete Input
   */
  autocompleteInput(): void {
    const autocompleteEl = new google.maps.places.Autocomplete(this.autoCompleteInputEl.nativeElement);
    autocompleteEl.addListener('place_changed', () => {
      const response = autocompleteEl.getPlace();

      // Set to empty get full Address;
      this.address.fullAddress = '';

      this.parseAddress(response);
      this.latLng = [response.geometry.location.lat(), response.geometry.location.lng()];
      this.updateMarker();
    });
  }


  /**
   * Get Geo Data
   *
   * @param place
   */
  getDataGeo(place?): void {
    if (place) {
      this.latLng = [place.latLng.lat(), place.latLng.lng()];
    }
    const coords = this.address.latLng.coordinates
    const location = new google.maps.LatLng({ lat: coords[0], lng: coords[1] });
    this.geocoder.geocode(
      { location },
      (results, status) => {
        if (status === google.maps.GeocoderStatus.OK) {
          // Clear address to fill in first match
          this.address.fullAddress = '';
          for (const result of results) {
            this.parseAddress(result)
          }
          this.updateMarker();
        }
      }
    );
  }

  /**
   * Hint Dialog Close
   */
  hintDialogClose(): void {
    this.hintDialogEl.nativeElement.classList.add('hide');
  }

  /**
   * Set Center, Marker Position
   */
  updateMarker(): void {
    const coords = this.address.latLng.coordinates
    this.markerPosition = { lat: coords[0], lng: coords[1] };
    this.center = this.markerPosition;
    // Forced change detection on nested object;
    this._cdr.detectChanges();
  }


  /**
   * Parse and Save Address
   *
   * @param result
   */
  parseAddress(result): void {
    const resultType = result.types;
    // Set full address
    if (
      !this.address.fullAddress &&
      (resultType.includes('establishment') || resultType[0] === 'route' || resultType[0] === 'street_address')
    ) {
      this.address.fullAddress = result.formatted_address;
    }

    // Set district, region & country
    for (const addressComponent of result.address_components) {
      switch (addressComponent.types[0]) {
        case 'locality':  // District
          this.address.district = addressComponent.long_name;
          break;
        case 'administrative_area_level_1': // Region
          this.address.region = addressComponent.long_name;
          break;
        case 'country': // Country
          this.address.country = addressComponent.long_name;
          break;
      }
    }
  }

}
