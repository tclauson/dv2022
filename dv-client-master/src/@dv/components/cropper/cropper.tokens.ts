import { InjectionToken } from '@angular/core';
import { CropperDimensions } from '../../types';
import Options = Cropper.Options;
import SetCropBoxDataOptions = Cropper.SetCropBoxDataOptions;
import DragMode = Cropper.DragMode;

export const CROPPER_DATA = new InjectionToken<{
  dimensions: CropperDimensions,
  cropBoxData: SetCropBoxDataOptions,
  dragMode: DragMode
  options: Options,
  asset: File,
}>('CROPPER_DATA');