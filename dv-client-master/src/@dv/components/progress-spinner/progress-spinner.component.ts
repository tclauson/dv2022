import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { DvProgressSpinnerService } from './progress-spinner.service';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'dv-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrls: ['./progress-spinner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DvProgressSpinnerComponent implements OnInit, OnDestroy {
  mode: 'determinate' | 'indeterminate' | 'buffer' | 'query';
  value: number;
  visible: boolean;
  message: string;

// Private
  private _unsubscribeAll: Subject<any>;

  /**
   * Constructor
   *
   * @param {DvProgressSpinnerService} _dvProgressSpinnerService
   */
  constructor(
    private _dvProgressSpinnerService: DvProgressSpinnerService
  ) {
    // Set the defaults

    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    // Subscribe to the progress bar service properties

    // Mode
    this._dvProgressSpinnerService.mode
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((mode) => {
        this.mode = mode;
      });

    // Value
    this._dvProgressSpinnerService.value
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((value) => {
        this.value = value;
      });

    // Visible
    this._dvProgressSpinnerService.visible
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((visible) => {
        this.visible = visible;
      });

    // Message
    this._dvProgressSpinnerService.message
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((message) => {
        this.message = message;
      });

  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

}
