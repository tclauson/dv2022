import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';

import { dvAnimations } from '@dv/animations';

import { TableSource } from '@dv/components/table-source/table-source';
import { PreviewLightboxService } from '@dv/components/preview-lightbox/preview-lightbox.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { ErrorHandlerService } from '@dv/services/error-handler.service';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { AbilityService } from '@dv/services/ability.service';
import { AdvsService } from './advs.service';

@Component({
  selector: 'advs',
  templateUrl: './advs.component.html',
  styleUrls: ['./advs.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class AdvsComponent implements OnDestroy, OnInit {
  readonly displayedColumns = ['featured-asset', 'name'];

  dataSource: TableSource | null;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {PreviewLightboxService} _previewLightboxService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {ErrorHandlerService} _errorHandlerService
   * @param {SnackBarService} _snackBarService
   * @param {AbilityService} _abilityService
   * @param {AdvsService} _advsService
   */
  constructor(
    private _previewLightboxService: PreviewLightboxService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _errorHandlerService: ErrorHandlerService,
    private _snackBarService: SnackBarService,
    private _abilityService: AbilityService,
    private _advsService: AdvsService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject<any>();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.dataSource = new TableSource(
      this._unsubscribeAll,
      null,
      null,
      null,
      this._advsService,
      'onAdvsChanged',
      'getAdvs',
    );
  }

  /**
   * On Destroy
   */
  ngOnDestroy(): void {
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Open Asset Preview
   *
   * @param {Event} e
   * @param {string} asset
   */
  openLightbox(e: Event, asset: string): void {
    e.stopPropagation();
    e.preventDefault();
    this._previewLightboxService.open({ asset })
  }

}
