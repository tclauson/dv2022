import Options = Cropper.Options;
import SetCropBoxDataOptions = Cropper.SetCropBoxDataOptions;
import DragMode = Cropper.DragMode;

export const defaultCropperOptions: Options = {
  zoomable: false,
  movable: false,
  scalable: false,
  aspectRatio: 1,
  dragMode: 'crop',
  autoCrop: true,
  autoCropArea: 0.8,
  // responsive: true,
  viewMode: 1,
  checkCrossOrigin: true
};

export interface CropperDimensions {
  width: number;
  height: number;
}

export interface CropperConfig {
  panelClass?: string;
  hasBackdrop?: boolean;
  backdropClass?: string;
  options?: Options
  dimensions?: CropperDimensions,
  cropBoxData?: SetCropBoxDataOptions,
  dragMode?: DragMode
  asset: File;
}