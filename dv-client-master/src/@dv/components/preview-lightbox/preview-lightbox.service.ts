import { ComponentRef, Injectable, Injector } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';

import { PreviewLightboxComponent } from './preview-lightbox.component';
import { PreviewLightboxRef } from './preview-lightbox.ref';
import { PREVIEW_LIGHTBOX_DATA } from './preview-lightbox.tokens';

import { PreviewLightboxConfig } from '../../types';

const DEFAULT_CONFIG: PreviewLightboxConfig = {
  hasBackdrop: true,
  backdropClass: 'dark-backdrop',
  panelClass: 'preview-lightbox-backdrop',
  asset: ''
}

@Injectable()
export class PreviewLightboxService {
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
   * @param {PreviewLightboxConfig} config
   * @returns  {PreviewLightboxRef}
   */
  open(config: PreviewLightboxConfig = { }): PreviewLightboxRef {
    const dialogConfig = { ...DEFAULT_CONFIG, ...config };
    const overlayRef = this.createOverlay(dialogConfig);
    const previewLightboxRef = new PreviewLightboxRef(overlayRef);

    previewLightboxRef.componentInstance = this.attachDialogContainer(overlayRef, dialogConfig, previewLightboxRef);
    // overlayRef.backdropClick().subscribe(_ => previewLightboxRef.close());

    return previewLightboxRef;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Create Overlay
   *
   * @param {PreviewLightboxConfig} config
   * @returns {OverlayRef}
   * @private
   */
  private createOverlay(config: PreviewLightboxConfig): OverlayRef {
    const overlayConfig = this.getOverlayConfig(config);
    return this._overlay.create(overlayConfig);
  }

  /**
   * Aattach Component to Overlay
   *
   * @param {OverlayRef} overlayRef
   * @param {PreviewLightboxRef} previewLightboxRef
   * @returns {PreviewLightboxComponent}
   * @private
   * @param config
   */
  private attachDialogContainer(overlayRef: OverlayRef, config: PreviewLightboxConfig, previewLightboxRef: PreviewLightboxRef): PreviewLightboxComponent {
    const _injector = this.createInjector(config, previewLightboxRef);
    const containerPortal = new ComponentPortal(PreviewLightboxComponent, null, _injector);
    const containerRef: ComponentRef<PreviewLightboxComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  /**
   * Create Injector
   *
   * @param {PreviewLightboxConfig} config
   * @param {PreviewLightboxRef} previewLightboxRef
   * @returns PortalInjector
   */
  private createInjector(config: PreviewLightboxConfig, previewLightboxRef: PreviewLightboxRef): PortalInjector {
    const injectionTokens = new WeakMap();

    injectionTokens.set(PreviewLightboxRef, previewLightboxRef);
    injectionTokens.set(PREVIEW_LIGHTBOX_DATA, config.asset);

    return new PortalInjector(this._injector, injectionTokens);
  }

  /**
   * Get Overlay Configuration
   *
   * @param {PreviewLightboxConfig} config
   * @returns {OverlayConfig}
   */
  private getOverlayConfig(config: PreviewLightboxConfig): OverlayConfig {
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