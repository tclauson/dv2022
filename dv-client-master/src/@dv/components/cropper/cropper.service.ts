import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import * as _ from 'lodash';

import { CropperComponent } from './cropper.component';
import { CropperRef } from './cropper.ref';
import { CROPPER_DATA } from './cropper.tokens';

import { CropperConfig } from '../../types';

const DEFAULT_CONFIG: CropperConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'cropper-backdrop',
  options: { },
  asset: null,
}

@Injectable()
export class CropperService {
  /**
   * Constructor
   *
   * @param {Injector} _injector
   * @param {Overlay} _overlay
   */
  constructor(
    private _injector: Injector,
    private _overlay: Overlay
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open Component in Overlay
   *
   * @param {CropperConfig} config
   * @returns  {CropperRef}
   */
  open(config: CropperConfig): CropperRef {
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(dialogConfig);
    const cropperRef = new CropperRef(overlayRef);

    cropperRef.componentInstance = this.attachDialogContainer(overlayRef, dialogConfig, cropperRef);
    // overlayRef.backdropClick().subscribe(_ => cropperRef.close());

    return cropperRef;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create Overlay
   *
   * @param {CropperConfig} config
   * @returns {OverlayRef}
   * @private
   */
  private createOverlay(config: CropperConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  /**
   * Aattach Component to Overlay
   *
   * @param {OverlayRef} overlayRef
   * @param {CropperRef} cropperRef
   * @param config
   * @private
   * @returns {CropperComponent}
   */
  private attachDialogContainer(overlayRef: OverlayRef, config: CropperConfig, cropperRef: CropperRef): CropperComponent {
    const _injector = this.createInjector(config, cropperRef);
    const containerPortal = new ComponentPortal(CropperComponent, null, _injector);
    const containerRef: ComponentRef<CropperComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  /**
   * Create Injector
   *
   * @param {CropperConfig} config
   * @param {CropperRef} cropperRef
   * @returns PortalInjector
   */
  private createInjector(config: CropperConfig, cropperRef: CropperRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(CropperRef, cropperRef);
    injectionTokens.set(CROPPER_DATA, _.pick(config, ['asset', 'dimensions', 'options', 'cropBoxData', 'dragMode']));

    return new PortalInjector(this._injector, injectionTokens);
  }

  /**
   * Get Overlay Configuration
   *
   * @param {CropperConfig} config
   * @returns {OverlayConfig}
   */
  private getOverlayConfig(config: CropperConfig): OverlayConfig {
    const positionStrategy = this._overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    return new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this._overlay.scrollStrategies.block(),
      positionStrategy
    });
  }
}