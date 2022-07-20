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
import { takeUntil } from 'rxjs/operators';

import { dvAnimations } from '@dv/animations';

import { TableSource } from '@dv/components/table-source/table-source';
import { PreviewLightboxService } from '@dv/components/preview-lightbox/preview-lightbox.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { ConfirmDialogComponent } from '@dv/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { AbilityService } from '@dv/services/ability.service';
import { DealsService } from './deals.service';

@Component({
  selector: 'deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations,
})

export class DealsComponent implements AfterViewInit, OnDestroy, OnInit {
  readonly displayedColumns = ['featured-asset', 'name', 'price', 'for', 'expiry', 'status', 'delete'];

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild('filter', { static: true })
  filter: ElementRef;

  @ViewChildren('columnSelect')
  columnsFilter: MatSelect[];

  dataSource: TableSource | null;
  dealTargets: any[];
  deleteMessage: string;


  // Private
  private readonly _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {MatDialog} _matDialog
   * @param {PreviewLightboxService} _previewLightboxService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {SnackBarService} _snackBarService
   * @param {AbilityService} _abilityService
   * @param {DealsService} _dealsService
   */
  constructor(
    private _matDialog: MatDialog,
    private _previewLightboxService: PreviewLightboxService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _snackBarService: SnackBarService,
    private _abilityService: AbilityService,
    private _dealsService: DealsService
  ) {
    // Set the defaults
    this.deleteMessage += 'Are you sure you want to delete the deal?';

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
      this.filter,
      this._dealsService,
      'onDealsChanged',
      'getDeals'
    );

    this._dealsService.onDealTargetChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        this.dealTargets = res?.collection || res || [];
      })
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
   * Can Manage Deal
   *
   * @param deal
   */
  canManageDeal(deal): boolean {
    return this._abilityService.canExec('manage', 'Deal', deal)
  }

  /**
   * Show Confirmation Dialog
   *
   * @param {Event} e
   * @param deal
   */
  confirmDelete(e: Event, deal): void {
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
        this._dvProgressSpinnerService.show('Deleting the deal, please wait! It may take a while');
        this._dealsService.deleteDeal(deal._id).subscribe(() => {
          this._dealsService.getDeals().then();
          this._dvProgressSpinnerService.hide();
          this._snackBarService.showMessage('Deleted Successfully');
        })
      }
    });
  }
}