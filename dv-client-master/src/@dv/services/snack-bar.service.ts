import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';

import { ISnackBarInterface } from '../types/snackbar';

@Injectable({ providedIn: 'root' })
export class SnackBarService {
  /**
   * Constructor
   *
   * @param {MatSnackBar} _matSnackBar
   */
  constructor(
    private _matSnackBar: MatSnackBar
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show Message
   *
   * @param {string} message
   * @param {string} action
   * @param {number} duration
   * @returns {Observable<any>}
   */
  showMessage(message: string, action?: 'string', duration?: number): Observable<any> {
    return this._matSnackBar.open(
      message,
      action || 'OK',
      {
        verticalPosition: 'bottom',
        duration: (duration || 2) * 1000,
        panelClass: 'snackbar'
      }
    ).afterDismissed();
  }

}
