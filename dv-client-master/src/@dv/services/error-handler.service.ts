import { Injectable } from '@angular/core';
import { SnackBarService } from './snack-bar.service';
import { DvProgressSpinnerService } from '../components/progress-spinner/progress-spinner.service';
import { DvProgressBarService } from '../components/progress-bar/progress-bar.service';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  /**
   * Constructor
   *
   * @param {DvProgressBarService} _dvProgressBarService
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   * @param {SnackBarService} _snackBarService
   */
  constructor(
    private _dvProgressBarService: DvProgressBarService,
    private _dvProgressSpinnerService: DvProgressSpinnerService,
    private _snackBarService: SnackBarService
  ) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show Error in Snackbar
   *
   * @param  {Error | object | string} error
   * @returns {Error}
   */
  showError(error: Error | object | string): void | Error {
    try {
      let e = error as string;
      if (error instanceof Error || typeof error === 'object') {
        e = (error as any)?.error?.message || (error as Error)?.message || JSON.stringify(error);
      }
      this._dvProgressBarService.hide();
      this._dvProgressSpinnerService.hide();
      this._snackBarService.showMessage(e).subscribe(() => {
        throw new Error(e);
      });
    } catch (e) {
      console.error(e);
    }
  }

}
