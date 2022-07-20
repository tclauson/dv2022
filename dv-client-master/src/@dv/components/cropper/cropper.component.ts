import { Component, EventEmitter, Inject, NgZone, OnDestroy, ViewEncapsulation } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import Cropper from 'cropperjs';

import { DvUtils } from '@dv/utils';

import { CropperRef } from './cropper.ref';
import { CROPPER_DATA } from './cropper.tokens';
import { defaultCropperOptions } from '../../types';
import Options = Cropper.Options;

const ANIMATION_TIMINGS = '400ms cubic-bezier(0.25, 0.8, 0.25, 1)';

@Component({
  selector: 'cropper',
  templateUrl: './cropper.component.html',
  styleUrls: ['./cropper.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fade', [
      state('fadeOut', style({ opacity: 0 })),
      state('fadeIn', style({ opacity: 1 })),
      transition('* => fadeIn', animate(ANIMATION_TIMINGS))
    ]),
    trigger('slideContent', [
      state('void', style({ transform: 'translate3d(0, 25%, 0) scale(0.9)', opacity: 0 })),
      state('enter', style({ transform: 'none', opacity: 1 })),
      state('leave', style({ transform: 'translate3d(0, 25%, 0)', opacity: 0 })),
      transition('* => *', animate(ANIMATION_TIMINGS)),
    ])
  ]
})
export class CropperComponent implements OnDestroy {

  isLoading: boolean;
  loadError: any;
  animationState: 'void' | 'enter' | 'leave';
  animationStateChanged: EventEmitter<AnimationEvent>;
  cropper: Cropper;
  options: Options;
  assetEncoded: string;
  resCropper: File | null;

  // Private
  private _asset: File;

  /**
   * Constructor
   *
   * @param _ngZone {NgZone}
   * @param _cropperRef {CropperRef}
   * @param cropperData
   */
  constructor(
    private _ngZone: NgZone,
    private _cropperRef: CropperRef,
    @Inject(CROPPER_DATA) public cropperData
  ) {
    // Set the defaults
    this.isLoading = true;
    this.animationState = 'enter';
    this.animationStateChanged = new EventEmitter<AnimationEvent>();
    this.options = { } as Options;

    if (this.cropperData.options) {
      this.options = Object.assign(this.options, this.cropperData.options)
    }
    this.asset = this.cropperData.asset;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this.destroyCropperJS()
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  set asset(asset: File) {
    DvUtils
      .readAsset(asset)
      .subscribe(res => {
        this.assetEncoded = res;
      });
    this._asset = asset;
  }


  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Image loaded
   *
   * @param {Event} e
   */
  onLoad(e: Event): void {
    this.loadError = false;
    const asset = e.target as HTMLImageElement;

    if (this.options.checkCrossOrigin) {
      asset.crossOrigin = 'anonymous';
    }

    // Image on ready event
    asset.addEventListener('ready', () => {
      this.isLoading = false;
    });

    // Setup aspect ratio according to settings
    let aspectRatio = NaN;
    if (this.cropperData.dimensions) {
      const { width, height } = this.cropperData.dimensions;
      aspectRatio = width / height;
    }

    const cropperReady = () => {
      if (this.cropperData.cropBoxData) {
        this.cropper.setCropBoxData(this.cropperData.cropBoxData);
      }
      if (this.cropperData.dragMode) {
        this.cropper.setDragMode(this.cropperData.dragMode);
      }
    }

    // Set crop options, extend default with custom config
    this.options = Object.assign(
      defaultCropperOptions,
      {
        aspectRatio,
        ready: cropperReady
      },
      this.options
    );

    this.destroyCropperJS()
    this.cropper = new Cropper(asset, this.options);
  }

  /**
   * Image load error
   *
   * @param {Event} e
   */
  onLoadError(e: Event): void {
    this.loadError = true;
    this.isLoading = false;
  }

  /**
   * When Animation Start
   *
   * @param {AnimationEvent} e
   */
  onAnimationStart(e: AnimationEvent): void {
    this.animationStateChanged.emit(e);
  }

  /**
   * When Animation is Done
   *
   * @param {AnimationEvent} e
   */
  onAnimationDone(e: AnimationEvent): void {
    this.animationStateChanged.emit(e);
  }

  /**
   * When Animation Start is Executed
   */
  startExitAnimation(): void {
    this.animationState = 'leave';
  }

  /**
   * Blob callback
   */
  blobCallback(blob: Blob): void {
    this._ngZone.run(() => {
      const b: any = blob;
      if (b) {
        b.lastModifiedDate  = new Date();
        b.name = this._asset.name;
      }
      this.closeCropper(b);
    })
  }


  /**
   * when crop button submitted
   */
  onCropSubmit(): void {
    this.cropper
      .getCroppedCanvas(this.cropperData?.cropBoxData || { })
      .toBlob(this.blobCallback.bind(this), 'image/jpeg');
  }

  /**
   *  Close or cancel cropper
   */
  closeCropper(asset?: File): void {
    this.resCropper = asset;
    this._cropperRef.close();
    this.destroyCropperJS();
  }

  /**
   * Destroy Cropperjs Instance
   */
  destroyCropperJS(): void {
    if (this.cropper) {
      this.cropper.destroy();
      this.cropper = undefined;
    }
  }

}
