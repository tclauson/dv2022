import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import * as _ from 'lodash';

import { DvUtils } from '@dv/utils';

import { AssetUploaderService } from './asset-uploader.service';
import { ErrorHandlerService } from '@dv/services/error-handler.service';
import { PreviewLightboxService } from '../preview-lightbox/preview-lightbox.service';
import { DvProgressSpinnerService } from '../progress-spinner/progress-spinner.service';
import { AssetType, FeaturedAsset, PreAssetType, RefIdModel } from '../../types';
import { Observable } from 'rxjs';
import { CropperService } from '../cropper/cropper.service';

@Component({
  selector: 'asset-uploader',
  templateUrl: './asset-uploader.component.html',
  styleUrls: ['./asset-uploader.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AssetUploaderComponent implements OnChanges {
  @Output() assetChanged: EventEmitter<null> = new EventEmitter<null>();
  @Output() uploadSuccess: EventEmitter<null> = new EventEmitter<null>();
  @Output() uploadFailed: EventEmitter<null> = new EventEmitter<null>();

  @Input() refIdModel: RefIdModel
  @Input() assetGallery: PreAssetType[]
  @Input() featuredAsset: PreAssetType;
  @Input() readyForUpload: boolean;
  @Input() disabled = false
  @Input() multiple = true;
  @Input() accept = 'image/*';
  @Input() apiModel = null;

  @ViewChild('uploadInput', { static: false }) uploadInputEl;

  assets: AssetType[];
  assetFiles: File[];
  featuredAssetParsed: FeaturedAsset

  // Private
  private _removedPreAssetIds: Set<string>

  /**
   * Constructor
   *
   * @param {ErrorHandlerService} _errorHandlerService
   * @param {AssetUploaderService} _assetUploaderService
   * @param {PreviewLightboxService} _previewLightboxService
   * @param {DvProgressSpinnerService} _dvProgressSpinnnerService
   */
  constructor(
    private _errorHandlerService: ErrorHandlerService,
    private _assetUploaderService: AssetUploaderService,
    private _previewLightboxService: PreviewLightboxService,
    private _dvProgressSpinnnerService: DvProgressSpinnerService,
  ) {
    // Set the defaults
    this.assets = [];
    this.assetFiles = [];
    this.assetGallery = [];
    this.readyForUpload = false;
    this.featuredAssetParsed = { } as FeaturedAsset;

    // Set the private defaults
    this._removedPreAssetIds = new Set();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Change
   * @param {SimpleChanges} changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    // assetGallery Change
    if (changes?.assetGallery) {
      this.assetGallery = [];
      const assetGallery = changes.assetGallery.currentValue;
      if (assetGallery?.length > 0) {
        this.assetGallery = _.cloneDeep(assetGallery)
      }
    }

    // featuredAsset Change
    if (changes?.featuredAsset) {
      const featuredAssetCurrent = changes?.featuredAsset?.currentValue;
      const featuredAssetPrevious = changes?.featuredAsset?.previousValue;
      if (featuredAssetCurrent?._id) {
        this.assetGallery.unshift(featuredAssetCurrent);
        this.featuredAssetParsed = {
          type: '_id',
          value: featuredAssetCurrent._id
        }
      }
      if (featuredAssetPrevious?._id) {
        const index = this.assetGallery.findIndex(i => {
          return i._id === featuredAssetPrevious._id;
        });
        if (index !== -1) {
          this.assetGallery.splice(index, 1);
        }
      }
    }

    // readyForUpload Change
    if (changes?.readyForUpload) {
      const readyForUploadCurrent = changes?.readyForUpload?.currentValue
      const readyForUploadPrevious = changes?.readyForUpload?.previousValue
      if (readyForUploadCurrent && readyForUploadCurrent !== readyForUploadPrevious) {
        if (
          (
            this.featuredAsset
            && this.featuredAsset?._id !== this.featuredAssetParsed?.value
          )
          || this.assets?.length > 0
          || this._removedPreAssetIds.size > 0
        ) {
          this.uploadAssets();
        } else {
          this.uploadSuccess.emit();
        }
      }
    }
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Private methods
  // -----------------------------------------------------------------------------------------------------
  /**
   * Invalid Asset Index
   *
   * @private
   */
  private _invalidAssetIndex(): void {
    this._errorHandlerService.showError('Invalid asset index');
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Add Assets to Set and Push to Parent
   */
  onInputChange(): void {
    const assets: { [key: string]: File } = this.uploadInputEl.nativeElement.files;
    const keys = Object.keys(assets);

    for (const key in assets) {
      if (!assets.hasOwnProperty(key)) {
        continue
      }
      if (!assets[key].type.match(/image\/*/)) {
        this._errorHandlerService.showError(`${assets[key].name} is not a valid image`);
        continue;
      }

      if (!isNaN(parseInt(key, 10))) {
        this.parseAsset(assets[key])
          .subscribe(
            () => {
              if (key === keys[keys.length - 1]) {
                // On last iterate reset input files
                this.uploadInputEl.nativeElement.value = '';
              }
            }
          )
      }
    }
    this.assetChanged.emit()
  }

  /**
   *
   * @param {File} asset
   */
  parseAsset(asset: File): Observable<any> {
    const reader = new FileReader();
    return new Observable<any>(
      (observer) => {
        reader.onloadend = (e: any) => {
          const uuidName = DvUtils.generateAssetName(asset.name);
          // If multiple images push to array
          if (this.multiple) {
            this.assets.push({ uuid: uuidName, file: e.target.result });
            this.assetFiles.push(asset)
          } else {
            this.assets = [{ uuid: uuidName, file: e.target.result }];
            this.assetFiles = [asset];
          }
          observer.next();
          observer.complete();
        }
        reader.readAsDataURL(asset);
      }
    )
  }

  /**
   * Remove Asset from Set and Push to Parent
   *
   * @param {PreAssetType | AssetType} media
   */
  onRemoveAsset(media: PreAssetType | AssetType): void {
    if ((media as AssetType).uuid) {
      const index = this.assets.findIndex(i => {
        return i.uuid === (media as AssetType).uuid;
      })
      if (index === -1) {
        this._invalidAssetIndex()
        return;
      }
      this.assets.splice(index, 1);
      this.assetFiles.splice(index, 1)
    } else {
      const index = this.assetGallery.findIndex(i => {
        return i._id === (media as PreAssetType)._id;
      });
      if (index === -1) {
        this._invalidAssetIndex()
        return;
      }
      this.assetGallery.splice(index, 1);
      this._removedPreAssetIds.add((media as PreAssetType)._id);
    }
    this.assetChanged.emit()
  }

  /**
   * Set Featured Asset
   *
   * @param {PreAssetType | AssetType} media
   */
  onSetFeatureAsset(media: PreAssetType | AssetType): void {
    if ((media as AssetType).uuid) {
      const m = media as AssetType
      this.featuredAssetParsed.type = 'name';
      this.featuredAssetParsed.value = m.uuid;
    } else {
      const m = media as PreAssetType
      this.featuredAssetParsed.type = '_id';
      this.featuredAssetParsed.value = m._id;
    }
    this.assetChanged.emit()
  }


  /**
   * Open Asset Preview
   *
   * @param {File | string} asset
   */
  openLightbox(asset: File | string): void {
    this._previewLightboxService.open({ asset })
  }

  /**
   * Upload Assets
   */
  uploadAssets(): void {
    this._dvProgressSpinnnerService.setMessage('Uploading Assets');
    if (!this.refIdModel?.refId || !this.refIdModel?.model) {
      this.uploadFailed.emit();
      this._dvProgressSpinnnerService.hide();
      this._errorHandlerService.showError('Upload data is missing refId or model');
      return;
    }
    const assetsToUpload = [];
    this.assets.forEach((asset, index) => {
      assetsToUpload.push({
        file: this.assetFiles[index],
        uuid: asset.uuid
      })
    })

    this._assetUploaderService.uploadAssets(
      this.refIdModel,
      assetsToUpload,
      this.featuredAssetParsed,
      this._removedPreAssetIds,
      this.apiModel
    ).subscribe(
      () => {
        this.uploadSuccess.emit();
      },
      () => {
        this.uploadFailed.emit();
      }
    )
  }

}
