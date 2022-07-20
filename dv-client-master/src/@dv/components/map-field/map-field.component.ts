import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as _ from 'lodash';

import { dvAnimations } from '@dv/animations';

import { MapDialogComponent } from '../map-dialog/map-dialog.component';
import { AddressType, AddressTypeLatLng } from '../../types';

@Component({
  selector: 'map-field',
  templateUrl: './map-field.component.html',
  styleUrls: ['./map-field.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class MapFieldComponent implements OnInit, OnDestroy {
  readonly errorMessages = {
    address: {
      fullAddress: [
        { type: 'required', message: 'Address is required' }
      ]
    }
  }
  @Input() disabled = false;
  @Input() get label(): string {
    return this._label;
  }
  set label(value: string) {
    this._label = value;
  }

  @Input() get placeholder(): string {
    return this._placeholder;
  }
  set placeholder(value: string) {
    this._placeholder = value;
  }

  form: FormGroup;

  // Private
  private _label: string;
  private _placeholder: string;
  private _disabled: boolean;
  private _required: boolean;

  /**
   * Constructor
   *
   * @param {ControlContainer} _controlContainer
   * @param {FormBuilder} _formBuilder
   * @param {MatDialog} _matDialog
   */
  constructor(
    private _controlContainer: ControlContainer,
    private _formBuilder: FormBuilder,
    private _matDialog: MatDialog,
  ) {
    // Set the private defaults
    this._label = 'Pick Location';
    this._placeholder = 'Pick Location';
    this._disabled = false;
    this._required = false;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Init
   */
  ngOnInit(): void {
    this.form = this._controlContainer.control as FormGroup;
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show Map Dialog
   */
  showMapDialog(): void {
    const dialogData: MatDialogConfig = {
      maxWidth: '100vw',
      maxHeight: '100vh',
      width: '95vw',
      height: '95vh',
      panelClass: 'map-dialog-overlay',
      data: { }
    }
    let address = _.cloneDeep(this.form.getRawValue());
    const coords = address.lngLat.coordinates;
    if (coords[0] !== 0 && coords[1] !== 0) {
      address.latLng = address.lngLat;
      address = _.omit(address, 'lngLat')
      address.latLng.coordinates = coords.reverse();
      dialogData.data = address;
    }

    const dialogRef = this._matDialog.open(MapDialogComponent, dialogData);

    dialogRef.afterClosed().subscribe((res: AddressTypeLatLng) => {
      if (res) {
        // @ts-ignore
        let resAddress: AddressType = _.cloneDeep(res);
        resAddress = _.omit(resAddress, 'latLng');
        resAddress.lngLat = res.latLng;
        resAddress.lngLat.coordinates = resAddress.lngLat.coordinates.reverse();
        this.form.patchValue(resAddress);
        this.form.markAsDirty();
      }
    });
  }

}
