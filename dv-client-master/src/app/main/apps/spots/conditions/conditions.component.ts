import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { dvAnimations } from '@dv/animations';

import { TableSource } from '@dv/components';
import { PreviewLightboxService } from '@dv/components/preview-lightbox/preview-lightbox.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { ConfirmDialogComponent } from '@dv/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { AbilityService } from '@dv/services/ability.service';
import { ConditionsService } from './conditions.service';
import { DetailsDialogComponent } from './details-dialog/details-dialog.component';

@Component({
  selector: 'conditions',
  templateUrl: './conditions.component.html',
  styleUrls: ['./conditions.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations,
})
export class ConditionsComponent implements OnDestroy, OnInit {
  readonly displayedColumns = ['featured-asset', 'date-time', 'temperature', 'visibility', 'swell', 'created-by', 'user-type' , 'details',  'delete'];

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  // @ViewChild('filter', { static: true })
  // filter: ElementRef;

  dataSource: TableSource | null;
  spotId: string;
  deleteMessage: string;

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {MatDialog} _matDialog
   * @param {PreviewLightboxService} _previewLightboxService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {SnackBarService} _snackBarService
   * @param {AbilityService} _abilityService
   * @param {ConditionsService} _conditionsService
   */
  constructor(
    private _matDialog: MatDialog,
    private _previewLightboxService: PreviewLightboxService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _snackBarService: SnackBarService,
    private _abilityService: AbilityService,
    private _conditionsService: ConditionsService
  ) {
    // Set the defaults
    this.spotId = this._conditionsService.routeParams.spotId;
    this.deleteMessage = 'Are you sure you want to delete the conditions?';

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
      this.paginator,
      this.sort,
      null,
      this._conditionsService,
      'onConditionsChanged',
      'getConditions'
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
   * Open Detail Dialog
   *
   * @param {Event} e
   * @param {object} condition
   */
  openDetails(e: Event, condition: object): void {
    e.stopPropagation();
    e.preventDefault();
    const dialogRef = this._matDialog.open(DetailsDialogComponent, {
      panelClass: 'event-form-dialog',
      data: {
        condition
      }
    });
  }

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

  /**
   * Can Manage Deal
   *
   * @param condition
   */
  canManageCondition(condition): boolean {
    return this._abilityService.canExec('manage', 'Condition', condition)
  }

  /**
   * Show Confirmation Dialog
   *
   * @param {Event} e
   * @param condition
   */
  confirmDelete(e: Event, condition): void {
    e.stopPropagation();
    e.preventDefault();
    const dialogData: MatDialogConfig = {
      data: {
        message: this.deleteMessage
      }
    }
    const dialogRef = this._matDialog.open(ConfirmDialogComponent, dialogData);

    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this._dvProgressSpinnerService.show('Deleting the conditions, please wait! It may take a while');
        this._conditionsService.deleteCondition(condition._id).subscribe(() => {
          this._conditionsService.getConditions().then();
          this._dvProgressSpinnerService.hide();
          this._snackBarService.showMessage('Deleted Successfully');
        })
      }
    });
  }
}
