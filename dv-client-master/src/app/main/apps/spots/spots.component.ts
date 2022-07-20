import {
  AfterViewChecked,
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

import { TableSource } from '@dv/components';
import { PreviewLightboxService } from '@dv/components/preview-lightbox/preview-lightbox.service';
import { DvProgressSpinnerService } from '@dv/components/progress-spinner/progress-spinner.service';
import { ConfirmDialogComponent } from '@dv/components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { AbilityService } from '@dv/services/ability.service';
import { SpotsService } from './spots.service';

// enum TabViewEnum { listView, mapView }

@Component({
  selector: 'spots',
  templateUrl: './spots.component.html',
  styleUrls: ['./spots.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class SpotsComponent implements AfterViewChecked, AfterViewInit, OnDestroy, OnInit {
  readonly displayedColumns = [
    'featured-asset',
    'name',
    'location',
    'createdAt',
    'updatedAt',
    'conditions'
  ];

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator;

  @ViewChild(MatSort, { static: true })
  sort: MatSort;

  @ViewChild('filter', { static: true })
  filter: ElementRef;

  @ViewChildren('columnSelect')
  columnsFilter: MatSelect[];

  // @ViewChild('mapTabEl', { static: false })
  // mapTabEl: MatTabGroup;

  // tabIndex: TabViewEnum;
  dataSource: TableSource | null;
  canManageSpots: boolean;
  deleteMessage: string;

  // Private
  private readonly _unsubscribeAll: Subject<any>;

  // @HostListener('window:resize', ['$event'])
  // onResize(): void {
  //   this.getMapHeight();
  // }

  /**
   * Constructor
   *
   * @param {MatDialog} _matDialog
   * @param {PreviewLightboxService} _previewLightboxService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {SnackBarService} _snackBarService
   * @param {AbilityService} _abilityService
   * @param {SpotsService} _spotsService
   */
  constructor(
    private _matDialog: MatDialog,
    private _previewLightboxService: PreviewLightboxService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _snackBarService: SnackBarService,
    private _abilityService: AbilityService,
    private _spotsService: SpotsService,
  ) {
    // Set the defaults
    // this.tabIndex = TabViewEnum.listView;
    // this.address = {
    //   lngLat: { type: 'Point', coordinates: [115.1846493, -8.667925] },
    //   country: 'Indonesia',
    //   full_address: ''
    // } as AddressType;
    // this.zoom = 12;
    // this.mapLoaded = false;
    this.deleteMessage = 'Deleting the spot will delete all the conditions,';
    this.deleteMessage += '<br/>All the feeds for it.'
    this.deleteMessage += '<br/><br/>Are you sure you want to delete the spot?';

    // Set the private defaults
    this._unsubscribeAll = new Subject<any>();

    this.canManageSpots = this._abilityService.canExec('delete', 'Spot');
    if (this.canManageSpots) {
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
      this._spotsService,
      'onSpotsChanged',
      'getSpots'
    );
  }

  ngAfterViewInit(): void {
    // Table not initialized until view
    this.dataSource.columnsFilter = this.columnsFilter;
  }

  /**
   * After View Checked
   */
  ngAfterViewChecked(): void {
    //   this.getMapHeight();
    //   this._cdr.detectChanges();
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

  // /**
  //  * Change Tab Output
  //  *
  //  * @param {Number} tab
  //  */
  // changeTab(tab: number): void {
  //   this.tabIndex = TabViewEnum[TabViewEnum[tab]];
  // }

  // getMapHeight(): void {
  //   this.mapHeight = this.contentEl.nativeElement.offsetHeight - this.mapTabEl._elementRef.nativeElement.childNodes[0].offsetHeight;
  // }
  //

  /**
   * Show Confirmation Dialog
   *
   * @param {Event} e
   * @param spot
   */
  confirmDelete(e: Event, spot): void {
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
        this._dvProgressSpinnerService.show('Deleting the spot and everything for it, please wait! It may take a while');
        this._spotsService.deleteSpot(spot._id).subscribe(() => {
          this._spotsService.getSpots().then();
          this._dvProgressSpinnerService.hide();
          this._snackBarService.showMessage('Deleted Successfully');
        })
      }
    });
  }

}