import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
  ViewEncapsulation
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatSelect } from '@angular/material/select';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { dvAnimations } from '@dv/animations';

import { TableSource } from '@dv/components/table-source/table-source';
import { PreviewLightboxService } from '@dv/components/preview-lightbox/preview-lightbox.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { ConfirmDialogComponent } from '@dv/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { AbilityService } from '@dv/services/ability.service';
import { ShopsService } from './shops.service';

@Component({
  selector: 'shops',
  templateUrl: './shops.component.html',
  styleUrls: ['./shops.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class ShopsComponent implements AfterViewInit, OnDestroy, OnInit {
  readonly displayedColumns = [
    'featured-asset',
    'name',
    'location',
    'user-name',
    'user-email',
    'createdAt',
    'updatedAt'
  ];

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild('filter', { static: true })
  filter: ElementRef;

  @ViewChildren('columnSelect')
  columnsFilter: MatSelect[];

  dataSource: TableSource | null;
  canManageShops: boolean;
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
   * @param _shopsService
   */
  constructor(
    private _matDialog: MatDialog,
    private _previewLightboxService: PreviewLightboxService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _snackBarService: SnackBarService,
    private _abilityService: AbilityService,
    private _shopsService: ShopsService
  ) {
    // Set the defaults
    this.deleteMessage = 'Deleting the shop will delete it\'s user,';
    this.deleteMessage += '<br/>All the feeds of the user,'
    this.deleteMessage += '<br/>All the comments and likes of the user,'
    this.deleteMessage += '<br/><br/>Are you sure you want to delete the shop?';

    // Set the private defaults
    this._unsubscribeAll = new Subject<any>();

    this.canManageShops = this._abilityService.canExec('delete', 'Shop');
    if (this.canManageShops) {
      this.displayedColumns.push('delete')
    }
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
      this.filter,
      this._shopsService,
      'onShopsChanged',
      'getShops',
    );
  }

  /**
   * After View Init
   */
  ngAfterViewInit(): void {
    // Table not initialized until view
    this.dataSource.columnsFilter = this.columnsFilter;
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

  /**
   * Show Confirmation Dialog
   *
   * @param {Event} e
   * @param shop
   */
  confirmDelete(e: Event, shop): void {
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
        this._dvProgressSpinnerService.show('Deleting the shop and everything for it, please wait! It may take a while');
        this._shopsService.deleteShop(shop._id).subscribe(() => {
          this._shopsService.getShops().then();
          this._dvProgressSpinnerService.hide();
          this._snackBarService.showMessage('Deleted Successfully');
        })
      }
    });
  }

}
