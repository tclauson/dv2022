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
import { Router } from '@angular/router';
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
import { ErrorHandlerService } from '@dv/services/error-handler.service';
import { SnackBarService } from '@dv/services/snack-bar.service';
import { AbilityService } from '@dv/services/ability.service';
import { UsersService } from './users.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: dvAnimations
})
export class UsersComponent implements AfterViewInit, OnDestroy, OnInit {
  readonly displayedColumns = [
    'featured-asset',
    'name',
    'email',
    'dob',
    'gender',
    'type',
    'createdAt',
    'updatedAt',
    'delete'
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
  canManageUsers: boolean;
  deleteMessage: string;
  userRoles: any[];

  // Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {Router} _router
   * @param {MatDialog} _matDialog
   * @param {PreviewLightboxService} _previewLightboxService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {ErrorHandlerService} _errorHandlerService
   * @param {SnackBarService} _snackBarService
   * @param {AbilityService} _abilityService
   * @param {UsersService} _userService
   */
  constructor(
    private _router: Router,
    private _matDialog: MatDialog,
    private _previewLightboxService: PreviewLightboxService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _errorHandlerService: ErrorHandlerService,
    private _snackBarService: SnackBarService,
    private _abilityService: AbilityService,
    private _userService: UsersService
  ) {
    // Set the defaults
    this.deleteMessage = 'Deleting the user will delete all the feeds of the user,';
    this.deleteMessage += '<br/>All the comments and likes of the user,'
    this.deleteMessage += '<br/><br/>Are you sure you want to delete the user?';
    this.userRoles = [];

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
    this.canManageUsers = this._abilityService.canExec('manage', 'User');
    if (!this.canManageUsers) {
      this._router.navigate(['/pages/errors/error-403'])
    }

    this._userService.onRolesChanged
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(res => {
        this.userRoles = res;
      })

    this.dataSource = new TableSource(
      this._unsubscribeAll,
      this.paginator,
      this.sort,
      this.filter,
      this._userService,
      'onUsersChanged',
      'getUsers',
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
   * @param user
   */
  confirmDelete(e: Event, user): void {
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
        this._dvProgressSpinnerService.show('Deleting the user and everything for it, please wait! It may take a while');
        this._userService.deleteUser(user._id).subscribe(() => {
          this._userService.getUsers().then();
          this._dvProgressSpinnerService.hide();
          this._snackBarService.showMessage('Deleted Successfully');
        })
      }
    });
  }

  getRoleColor(name: string | null): string {
    switch (name) {
      case 'Tier 1':
        return 'purple-500';
      case 'Tier 2':
        return 'blue-500';
      default:
        return '';
    }
  }

}
