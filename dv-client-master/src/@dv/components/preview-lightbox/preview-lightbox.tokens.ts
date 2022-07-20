import { InjectionToken } from '@angular/core';
import { PreviewImage } from '@dv/types/uploader';

export const PREVIEW_LIGHTBOX_DATA = new InjectionToken<PreviewImage>('PREVIEW_LIGHTBOX_DATA');